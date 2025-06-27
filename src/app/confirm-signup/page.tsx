'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

function ConfirmSignupContent() {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { confirmSignup, resendConfirmation } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignup(email, confirmationCode);
      
      // Show success message and redirect to login
      router.push('/login?message=Account confirmed successfully. Please sign in.');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Invalid confirmation code. Please check and try again.');
      } else if (err.response?.status === 410) {
        setError('Confirmation code has expired. Please request a new one.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Confirmation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      await resendConfirmation(email);
      setResendMessage('Confirmation code sent successfully!');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to resend confirmation code. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect to signup
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Confirm Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter the confirmation code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                We sent a confirmation code to
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationCode">Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              
              {resendMessage && (
                <p className="text-sm text-green-600">{resendMessage}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || confirmationCode.length !== 6}
              >
                {loading ? 'Confirming...' : 'Confirm Account'}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            </div>

            <div className="text-center">
              <Link 
                href="/signup" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmSignupContent />
    </Suspense>
  );
}