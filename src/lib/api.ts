import axios, { AxiosResponse } from 'axios';
import { mcpClient } from './mcp';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor to apiClient
const authInterceptor = (config: any) => {
  const token = localStorage.getItem('access_token');
  
  // Decode token to see what's in it (for debugging)
  let tokenClaims = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      tokenClaims = {
        iss: payload.iss,
        aud: payload.aud,
        client_id: payload.client_id,
        scope: payload.scope
      };
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }
  
  console.log('API Request Auth Debug:', {
    url: config.url,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
    tokenClaims
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for automatic token refresh
const responseInterceptor = async (response: any) => {
  return response;
};

const responseErrorInterceptor = async (error: any) => {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        // Import authApi dynamically to avoid circular imports
        const { authApi } = await import('./auth-api');
        const response = await authApi.refreshToken(refreshToken);
        
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        if (response.id_token) {
          localStorage.setItem('id_token', response.id_token);
        }
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
        return axios(originalRequest);
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
};

apiClient.interceptors.request.use(authInterceptor);

apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// Types based on backend models
export interface Identity {
  userId: string;
  data: Record<string, any>;
  updatedAt: string;
}

export interface BasicInfo {
  job_title: string;
  company_name: string;
  location?: string;
  employment_type?: string;
  department?: string;
  salary_range?: string;
  posted_date?: string;
  application_deadline?: string;
}

export interface SkillRequirement {
  skill_name: string;
  category: string;
  requirement_level: string;
  years_required?: number;
  proficiency_level?: string;
  context?: string;
}

export interface SoftRequirement {
  trait_name: string;
  category: string;
  requirement_level: string;
  context?: string;
}

export interface EducationRequirement {
  level: string;
  field?: string;
  requirement_level: string;
}

export interface CertificationRequirement {
  certification_name: string;
  requirement_level: string;
}

export interface ExperienceRequirement {
  years_total?: number;
  years_relevant?: number;
  industries?: string[];
  roles?: string[];
}

export interface Qualifications {
  education?: EducationRequirement[];
  certifications?: CertificationRequirement[];
  experience?: ExperienceRequirement;
}

export interface CompanyCulture {
  values?: string[];
  work_environment?: string;
  team_size?: string;
  growth_opportunities?: string[];
}

export interface OpportunitySummary {
  total_required_skills: number;
  total_preferred_skills: number;
  seniority_level: string;
  primary_focus_areas: string[];
  key_technologies: string[];
}

export interface OpportunityAnalysis {
  basic_info: BasicInfo;
  required_skills: SkillRequirement[];
  soft_requirements: SoftRequirement[];
  responsibilities: string[];
  qualifications: Qualifications;
  benefits: string[];
  company_culture: CompanyCulture;
  summary: OpportunitySummary;
}

export interface Opportunity {
  opportunityId: string;
  opportunityUrl?: string;
  contentHash: string;
  contentKey?: string;
  analysisData: OpportunityAnalysis;
  analysisStatus: string;
  createdAt: string;
  lastAnalyzed: string;
}

export interface UserOpportunityInterest {
  userId: string;
  opportunityId: string;
  interestedAt: string;
  status: string;
  isAutoInferred: boolean;
  notes?: string;
}

export interface Solution {
  solutionId: string;
  userId: string;
  opportunityId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSolution {
  solutionId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateOpportunityRequest {
  opportunity_url?: string;
  opportunity_text: string;
}

export interface CreateOpportunityResponse {
  opportunityId: string;
  opportunityAnalysis: OpportunityAnalysis;
  userInterest: UserOpportunityInterest;
  isNewOpportunity: boolean;
}

export interface CreateSolutionRequest {
  opportunityId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateSolutionRequest {
  valueProposition?: string;
  impactHistory?: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface GenerateSolutionRequest {
  opportunityId: string;
}

export interface RefineSolutionRequest {
  solutionId: string;
  refinementInstruction: string;
}

export interface FormatSolutionRequest {
  solutionId: string;
}

export interface FormatSolutionResponse {
  solutionId: string;
  formatType: string;
  formattedContent: string;
  generatedAt: string;
}

export interface EvidenceSubmissionRequest {
  source: string;
  text: string;
}

export interface EvidenceRecord {
  evidenceId: string;
  source: string;
  traitStatus: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'ERROR';
  createdAt: string;
  completedAt?: string;
}

export interface Trait {
  trait: string;
  evidence: string;
  confidence: number;
  name: string;
  weight: number;
  lastObserved: number;
  evidenceSnippets?: string[];
  reasoning?: string[];
}

// API Functions
export const api = {

  // Identity Management
  identity: {
    getIdentityGraph: async (): Promise<Identity> => {
      // TODO: Implement identity graph endpoint or replace with traits endpoint
      // For now, return empty identity to prevent 500 errors
      return {
        userId: 'current-user',
        traits: [],
        retrievedAt: new Date().toISOString(),
        totalTraits: 0,
        evidence_count: 0,
        data: {}
      };
    },
    submitEvidence: async (evidence: EvidenceSubmissionRequest): Promise<{ evidenceId: string }> => {
      const response = await apiClient.post('/v1/evidence', evidence);
      return response.data;
    },
    getEvidence: async (): Promise<EvidenceRecord[]> => {
      const response = await apiClient.get('/v1/evidence');
      return response.data;
    },
    getTraits: async (): Promise<Trait[]> => {
      const response = await apiClient.get('/v1/traits');
      return response.data;
    },
    getTrait: async (traitCode: string): Promise<Trait> => {
      const response = await apiClient.get(`/v1/traits/${encodeURIComponent(traitCode)}`);
      return response.data;
    },
  },

  // Opportunity Management
  opportunities: {
    analyzeOpportunity: async (data: CreateOpportunityRequest): Promise<CreateOpportunityResponse> => {
      const response = await apiClient.post('/v1/opportunities/analyze', data);
      return response.data;
    },
    getOpportunity: async (opportunityId: string): Promise<Opportunity> => {
      const response = await apiClient.get(`/v1/opportunities/${opportunityId}`);
      return response.data;
    },
    getUserOpportunities: async (): Promise<Opportunity[]> => {
      const response = await apiClient.get('/v1/user/opportunities');
      return response.data;
    },
  },

  // Solution Management
  solutions: {
    generateSolution: async (data: GenerateSolutionRequest): Promise<Solution> => {
      const response = await apiClient.post('/v1/solutions/generate', data);
      return response.data;
    },
    getSolution: async (solutionId: string): Promise<Solution> => {
      const response = await apiClient.get(`/v1/solutions/${solutionId}`);
      return response.data;
    },
    updateSolution: async (solutionId: string, data: UpdateSolutionRequest): Promise<Solution> => {
      const response = await apiClient.put(`/v1/solutions/${solutionId}`, data);
      return response.data;
    },
    getUserSolutions: async (): Promise<Solution[]> => {
      const response = await apiClient.get('/v1/user/solutions');
      return response.data;
    },
    getPublicSolution: async (solutionId: string): Promise<PublicSolution> => {
      const response = await apiClient.get(`/v1/solutions/${solutionId}/public`);
      return response.data;
    },
    formatSolution: async (solutionId: string, formatType: string): Promise<FormatSolutionResponse> => {
      const response = await apiClient.post(`/v1/solutions/${solutionId}/format`, { format_type: formatType });
      return response.data;
    },
    refineSolution: async (data: RefineSolutionRequest): Promise<void> => {
      await apiClient.post('/v1/solutions/refine', data);
    },
  },

  // MCP Tools - using proper MCP client
  mcp: {
    // Resume Analysis (Async)
    analyzeResume: async (resumeText: string): Promise<any> => {
      return await mcpClient.analyzeResume(resumeText);
    },
    
    // Extract traits from story/narrative text (Async)
    extractStoryTraits: async (storyText: string): Promise<any> => {
      return await mcpClient.extractStoryTraits(storyText);
    },
    
    // Analyze job posting text and extract requirements (Async)
    analyzeJobPosting: async (jobPostingText: string, jobUrl?: string): Promise<any> => {
      console.log('🌐 MCP API: Calling analyze_job_posting with:', {
        job_posting_text: jobPostingText.substring(0, 100) + '...',
        job_url: jobUrl || ""
      });
      
      try {
        const result = await mcpClient.analyzeJobPosting(jobPostingText, jobUrl);
        console.log('🌐 MCP API: Response:', result);
        return result;
      } catch (error) {
        console.error('🌐 MCP API: Request failed:', error);
        throw error;
      }
    },
    
    // Generate a tailored solution for a specific opportunity (Sync)
    generateSolution: async (opportunityId: string): Promise<any> => {
      return await mcpClient.generateSolution(opportunityId);
    },
    
    // Refine an existing solution based on feedback (Sync)
    refineSolution: async (solutionId: string, refinementInstruction: string): Promise<any> => {
      return await mcpClient.refineSolution(solutionId, refinementInstruction);
    },
    
    // Format solution as a resume (Sync)
    formatAsResume: async (solutionId: string): Promise<any> => {
      return await mcpClient.formatAsResume(solutionId);
    },
    
    // Format solution as a cover letter (Sync)
    formatAsCoverLetter: async (solutionId: string): Promise<any> => {
      return await mcpClient.formatAsCoverLetter(solutionId);
    },

    // NEW: Resume Structure Tools (Sync)
    getLatestResumeStructure: async (): Promise<any> => {
      return await mcpClient.getLatestResumeStructure();
    },

    listResumeStructures: async (): Promise<any> => {
      return await mcpClient.listResumeStructures();
    },

    getResumeStructure: async (evidenceId: string): Promise<any> => {
      return await mcpClient.getResumeStructure(evidenceId);
    },

    // Advanced Tools (Sync)
    generateResumePlan: async (opportunityId: string, userTraits?: any[]): Promise<any> => {
      return await mcpClient.generateResumePlan(opportunityId, userTraits);
    },

    matchOpportunitiesToExperience: async (opportunityId: string, userId: string): Promise<any> => {
      return await mcpClient.matchOpportunitiesToExperience(opportunityId, userId);
    },

    // Orchestration Tools
    tailorFullResumeForOpportunity: async (baseResume: string, opportunityId: string): Promise<any> => {
      return await mcpClient.tailorFullResumeForOpportunity(baseResume, opportunityId);
    },

    // Utility methods
    getJobStatus: async (jobId: string): Promise<any> => {
      return await mcpClient.getJobStatus(jobId);
    },

    waitForResult: async (jobId: string, pollInterval?: number): Promise<any> => {
      return await mcpClient.waitForResult(jobId, pollInterval);
    },

    listTools: async (): Promise<string[]> => {
      return await mcpClient.listTools();
    },

    // Generic tool caller
    callTool: async (toolName: string, args: Record<string, any> = {}): Promise<any> => {
      return await mcpClient.callTool(toolName, args);
    },
  },
};

export default api;