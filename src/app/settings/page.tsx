'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { User, Key, Bell, Shield, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();

  const getUserDisplayName = (user: { username?: string; attributes?: Record<string, string> }) => {
    if (user?.attributes?.given_name && user?.attributes?.family_name) {
      return `${user.attributes.given_name} ${user.attributes.family_name}`;
    }
    return user?.attributes?.email || user?.username || 'User';
  };

  const getUserEmail = (user: { username?: string; attributes?: Record<string, string> }) => {
    return user?.attributes?.email || user?.username || '';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{getUserDisplayName(user)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{getUserEmail(user)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-gray-500 text-sm font-mono">{user?.username}</p>
                </div>
                <Button variant="outline" disabled>
                  Edit Profile (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage API keys for programmatic access to Idynic services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create and manage API keys to integrate Idynic with your applications.
                </p>
                <Button asChild>
                  <Link href="/api-keys">Manage API Keys</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
                <CardDescription>
                  Security settings and authentication options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Last changed: Information not available
                  </p>
                  <Button variant="outline" disabled>
                    Change Password (Coming Soon)
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline" disabled>
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Notification preferences will be available in a future update.
                </p>
                <Button variant="outline" disabled>
                  Configure Notifications (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Help & Support
                </CardTitle>
                <CardDescription>
                  Get help and contact support.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-4">
                    Need help with your account or have questions about Idynic?
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline" disabled>
                      Contact Support (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      Documentation (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}