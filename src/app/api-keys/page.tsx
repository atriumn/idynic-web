'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Copy, Eye, EyeOff, Trash2, Key, AlertCircle } from 'lucide-react';

interface ApiKey {
  id: string;
  key_id: string;
  name: string;
  active: boolean;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
}

interface CreateApiKeyResponse {
  api_key: string;
  key_id: string;
  name: string;
  expires_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://dev.auth.atriumn.com';

export default function ApiKeysPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('90');
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<CreateApiKeyResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiKeysData, isLoading, error } = useQuery<ApiKey[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_BASE_URL}/auth/me/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch API keys: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle different possible response structures
      if (Array.isArray(result)) {
        return result;
      } else if (result && result.api_keys !== undefined) {
        // Handle case where api_keys is null (no keys) or an array
        return Array.isArray(result.api_keys) ? result.api_keys : [];
      } else if (result && Array.isArray(result.data)) {
        return result.data;
      } else {
        // Fallback for any other response structure
        return [];
      }
    },
  });

  // Ensure apiKeys is always an array
  const apiKeys = Array.isArray(apiKeysData) ? apiKeysData : [];

  const createApiKeyMutation = useMutation({
    mutationFn: async (data: { name: string; expires_in_days: number }) => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_BASE_URL}/auth/me/api-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create API key: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      setCreatedApiKey(data);
      setIsCreateDialogOpen(false);
      setNewKeyName('');
      setNewKeyExpiry('90');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_BASE_URL}/auth/me/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete API key: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    createApiKeyMutation.mutate({
      name: newKeyName.trim(),
      expires_in_days: parseInt(newKeyExpiry),
    });
  };

  const handleCopyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600 mt-2">
              Manage your API keys for accessing Idynic services programmatically.
            </p>
          </div>

          {/* Security Notice */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> API keys provide access to your account. Keep them secure and never share them publicly. 
              Create separate keys for different applications and rotate them regularly.
            </AlertDescription>
          </Alert>

          {/* Create API Key Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-6">
                <Plus className="h-4 w-4 mr-2" />
                Create New API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Give your API key a descriptive name and set an expiration period.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateApiKey} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">API Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production App, Development Testing"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key-expiry">Expires in (days)</Label>
                  <Input
                    id="key-expiry"
                    type="number"
                    min="1"
                    max="365"
                    value={newKeyExpiry}
                    onChange={(e) => setNewKeyExpiry(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Maximum 365 days. We recommend 90 days for better security.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createApiKeyMutation.isPending}>
                    {createApiKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Show created API key */}
          {createdApiKey && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Key Created Successfully
                </CardTitle>
                <CardDescription className="text-green-700">
                  <strong>Important:</strong> This is the only time you&apos;ll see the full API key. Copy it now and store it securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-green-800">API Key Name</Label>
                    <p className="text-sm text-green-700">{createdApiKey.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-green-800">API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
                        {showSecretKey === createdApiKey.key_id ? createdApiKey.api_key : '•'.repeat(48)}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSecretKey(showSecretKey === createdApiKey.key_id ? null : createdApiKey.key_id)}
                      >
                        {showSecretKey === createdApiKey.key_id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCopyApiKey(createdApiKey.api_key)}
                        disabled={copySuccess}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-green-800">Expires</Label>
                    <p className="text-sm text-green-700">{formatDate(createdApiKey.expires_at)}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreatedApiKey(null)}
                >
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          )}

          {/* API Keys List */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                {apiKeys.length === 0 ? 'No API keys created yet.' : `${apiKeys.length} API key${apiKeys.length === 1 ? '' : 's'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="ml-4 text-gray-600">Loading API keys...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <p>Failed to load API keys</p>
                  <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : !Array.isArray(apiKeys) || apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No API keys yet</p>
                  <p className="text-sm mt-2">Create your first API key to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className={`border rounded-lg p-4 ${
                        isExpired(key.expires_at) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">{key.name}</h3>
                            <Badge variant={key.active ? 'default' : 'secondary'}>
                              {key.active ? 'Active' : 'Inactive'}
                            </Badge>
                            {isExpired(key.expires_at) && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Key ID:</span>{' '}
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{key.key_id}</code>
                            </p>
                            <p>
                              <span className="font-medium">Created:</span> {formatDate(key.created_at)}
                            </p>
                            {key.expires_at && (
                              <p>
                                <span className="font-medium">Expires:</span> {formatDate(key.expires_at)}
                              </p>
                            )}
                            {key.last_used_at && (
                              <p>
                                <span className="font-medium">Last used:</span> {formatDate(key.last_used_at)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the API key &quot;{key.name}&quot;?
                                  This action cannot be undone and will immediately revoke access for any applications using this key.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteApiKeyMutation.mutate(key.id)}
                                  disabled={deleteApiKeyMutation.isPending}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deleteApiKeyMutation.isPending ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}