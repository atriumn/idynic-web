import axios from 'axios';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://dev.auth.atriumn.com';

// Create axios instance for auth API
const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API response types based on OpenAPI spec
export interface AuthenticationResult {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  username: string;
  attributes: Record<string, string>;
}

export interface UserSignupResponse {
  user_id: string;
}

export interface ConfirmSignupResponse {
  success: boolean;
}

export interface CodeDeliveryDetails {
  destination: string;
  delivery_medium: string;
  attribute_name: string;
}

export interface FederatedInitiateResponse {
  authorization_url: string;
  state: string;
}

export interface FederatedCallbackResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user_profile?: {
    provider_user_id: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
    attributes?: Record<string, string>;
  };
}

// Add token interceptor for authenticated requests
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  
  // Add client_id to auth requests that need it (but not for /auth/me endpoints)
  if (config.url?.includes('/auth/') && clientId && !config.url.includes('/auth/signup') && !config.url.includes('/auth/me')) {
    if (config.method === 'get') {
      // For GET requests, add client_id as query parameter
      config.params = {
        ...config.params,
        client_id: clientId
      };
    } else if (config.data) {
      // For POST requests, add client_id to body
      config.data = {
        ...config.data,
        client_id: clientId
      };
    }
  }
  
  // Add Bearer token to authenticated endpoints
  if (token && (config.url?.includes('/auth/me') || !config.url?.includes('/auth/'))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging for /auth/me/api-keys
  if (config.url?.includes('/auth/me/api-keys')) {
    console.log('API Keys Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
      headers: config.headers
    });
  }
  
  return config;
});

// Response interceptor for automatic token refresh on auth client too
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url?.includes('/auth/me')) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await authClient.post('/auth/refresh', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access_token);
          if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
          }
          if (response.data.id_token) {
            localStorage.setItem('id_token', response.data.id_token);
          }
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return authClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('id_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  // User Authentication
  login: async (username: string, password: string): Promise<AuthenticationResult> => {
    const response = await authClient.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  signup: async (email: string, password: string, attributes?: Record<string, string>): Promise<UserSignupResponse> => {
    const response = await authClient.post('/auth/signup', {
      email,
      password,
      attributes,
    });
    return response.data;
  },

  confirmSignup: async (username: string, confirmation_code: string): Promise<ConfirmSignupResponse> => {
    const response = await authClient.post('/auth/signup/confirm', {
      username,
      confirmation_code,
    });
    return response.data;
  },

  resendConfirmationCode: async (username: string): Promise<CodeDeliveryDetails> => {
    const response = await authClient.post('/auth/signup/resend', {
      username,
    });
    return response.data;
  },

  resendConfirmation: async (email: string): Promise<CodeDeliveryDetails> => {
    const response = await authClient.post('/auth/resend-confirmation', {
      email,
    });
    return response.data;
  },

  refreshToken: async (refresh_token: string): Promise<AuthenticationResult> => {
    const response = await authClient.post('/auth/refresh', {
      grant_type: 'refresh_token',
      refresh_token,
    });
    return response.data;
  },

  logout: async (access_token: string): Promise<void> => {
    await authClient.post('/auth/logout', {
      access_token,
    });
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await authClient.get('/auth/me');
    return response.data;
  },

  // Password Reset
  requestPasswordReset: async (email: string): Promise<CodeDeliveryDetails> => {
    const response = await authClient.post('/auth/password/reset', {
      email,
    });
    return response.data;
  },

  confirmPasswordReset: async (email: string, code: string, new_password: string): Promise<void> => {
    await authClient.post('/auth/password/confirm', {
      email,
      code,
      new_password,
    });
  },

  // Federated Authentication
  initiateFederatedAuth: async (provider: 'google' | 'apple' | 'microsoft', redirect_uri: string, state?: string): Promise<FederatedInitiateResponse> => {
    const response = await authClient.post('/auth/federated/initiate', {
      provider,
      redirect_uri,
      state,
    });
    return response.data;
  },

  handleFederatedCallback: async (
    provider: 'google' | 'apple' | 'microsoft',
    code: string,
    state: string,
    redirect_uri: string
  ): Promise<FederatedCallbackResponse> => {
    const response = await authClient.post('/auth/federated/callback', {
      provider,
      code,
      state,
      redirect_uri,
    });
    return response.data;
  },

  linkFederatedAccount: async (
    provider: 'google' | 'apple' | 'microsoft',
    code: string,
    state: string,
    redirect_uri: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await authClient.post('/auth/federated/link', {
      provider,
      code,
      state,
      redirect_uri,
    });
    return response.data;
  },

  // API Key Management
  createAPIKey: async (name: string, expires_in_days?: number): Promise<{
    id: string;
    key_id: string;
    api_key: string;
    name: string;
    active: boolean;
    created_at: string;
    expires_at: string;
  }> => {
    const response = await authClient.post('/auth/me/api-keys', {
      name,
      expires_in_days,
    });
    return response.data;
  },

  listAPIKeys: async (): Promise<{
    api_keys: Array<{
      id: string;
      key_id: string;
      name: string;
      active: boolean;
      created_at: string;
      last_used_at?: string;
      expires_at: string;
    }>;
  }> => {
    const response = await authClient.get('/auth/me/api-keys');
    return response.data;
  },

  updateAPIKey: async (keyId: string, updates: { name?: string; active?: boolean }): Promise<{
    id: string;
    key_id: string;
    name: string;
    active: boolean;
    created_at: string;
    last_used_at?: string;
    expires_at: string;
  }> => {
    const response = await authClient.patch(`/auth/me/api-keys/${keyId}`, updates);
    return response.data;
  },

  deleteAPIKey: async (keyId: string): Promise<void> => {
    await authClient.delete(`/auth/me/api-keys/${keyId}`);
  },
};

export default authApi;