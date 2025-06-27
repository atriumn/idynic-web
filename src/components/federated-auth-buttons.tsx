'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { useAuth } from '@/lib/auth';

export function FederatedAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFederatedAuth = async (provider: 'google' | 'apple' | 'microsoft') => {
    setLoading(provider);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const state = Math.random().toString(36).substring(2, 15);
      
      // Store state for CSRF protection
      sessionStorage.setItem('auth_state', state);
      sessionStorage.setItem('auth_provider', provider);
      
      const response = await authApi.initiateFederatedAuth(provider, redirectUri, state);
      
      // Redirect to provider's auth page
      window.location.href = response.authorization_url;
    } catch (error) {
      console.error(`${provider} auth failed:`, error);
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="outline"
        onClick={() => handleFederatedAuth('google')}
        disabled={loading !== null}
        className="w-full flex items-center gap-2"
      >
        <GoogleIcon />
        {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleFederatedAuth('microsoft')}
        disabled={loading !== null}
        className="w-full flex items-center gap-2"
      >
        <MicrosoftIcon />
        {loading === 'microsoft' ? 'Connecting...' : 'Continue with Microsoft'}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleFederatedAuth('apple')}
        disabled={loading !== null}
        className="w-full flex items-center gap-2"
      >
        <AppleIcon />
        {loading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01691 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 0H0V8.5H8.5V0Z" fill="#F25022"/>
      <path d="M18 0H9.5V8.5H18V0Z" fill="#7FBA00"/>
      <path d="M8.5 9.5H0V18H8.5V9.5Z" fill="#00A4EF"/>
      <path d="M18 9.5H9.5V18H18V9.5Z" fill="#FFB900"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2 4.5C13.95 3.6 14.4 2.4 14.25 1.2C13.2 1.25 11.95 1.9 11.15 2.8C10.4 3.65 9.85 4.9 10.05 6.1C11.2 6.15 12.4 5.45 13.2 4.5ZM14.2 6.55C12.7 6.45 11.45 7.35 10.7 7.35C9.95 7.35 8.9 6.6 7.7 6.6C5.9 6.65 4.2 7.75 3.35 9.45C1.6 12.85 2.9 18 4.65 20.6C5.45 21.8 6.4 23.15 7.65 23.1C8.8 23.05 9.25 22.35 10.7 22.35C12.15 22.35 12.55 23.1 13.8 23.05C15.1 23 15.9 21.85 16.7 20.6C17.6 19.15 18 17.75 18.05 17.7C18 17.65 15.4 16.6 15.35 13.5C15.3 10.95 17.3 9.75 17.4 9.7C16.25 8.05 14.5 7.85 14.2 6.55Z" fill="currentColor"/>
    </svg>
  );
}