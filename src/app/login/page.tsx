'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/auth-api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { FederatedAuthButtons } from '@/components/federated-auth-buttons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setShowResendButton(false);
      
      // Handle unconfirmed user case
      if (err.response?.data?.error === 'UserNotConfirmedException' || 
          err.response?.data?.message?.includes('User is not confirmed')) {
        setError('Please confirm your account first. Check your email or request a new confirmation code.');
        setShowResendButton(true);
      } else if (err.response?.status === 401) {
        setError('Invalid credentials.');
      } else if (err.response?.data?.error_description) {
        setError(err.response.data.error_description);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setLoading(true);
      await authApi.resendConfirmation(email);
      setError('If you have an account, a confirmation code has been sent to your email.');
      setShowResendButton(false);
      // Redirect to confirmation page
      setTimeout(() => {
        router.push(`/confirm-signup?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError('If you have an account, a confirmation code has been sent to your email.');
      setShowResendButton(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Idynic
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your strategic identity platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FederatedAuthButtons />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{error}</p>
                {showResendButton && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendConfirmation}
                    disabled={loading}
                  >
                    Resend Confirmation Code
                  </Button>
                )}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}