'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/auth-api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { 
  ArrowLeft, 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function APIKeysPage() {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDays, setNewKeyDays] = useState(90);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showCreatedKey, setShowCreatedKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: authApi.listAPIKeys,
  });

  const createKeyMutation = useMutation({
    mutationFn: (data: { name: string; expires_in_days: number }) =>
      authApi.createAPIKey(data.name, data.expires_in_days),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setCreatedKey(response.api_key);
      setCreateDialogOpen(false);
      setNewKeyName('');
      setNewKeyDays(90);
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (keyId: string) => authApi.deleteAPIKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: ({ keyId, updates }: { keyId: string; updates: { name?: string; active?: boolean } }) =>
      authApi.updateAPIKey(keyId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const handleCreateKey = () => {
    createKeyMutation.mutate({
      name: newKeyName,
      expires_in_days: newKeyDays,
    });
  };

  const handleCopyKey = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleToggleKey = (keyId: string, currentStatus: boolean) => {
    updateKeyMutation.mutate({
      keyId,
      updates: { active: !currentStatus },
    });
  };

  const apiKeys = apiKeysData?.api_keys || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
                  <p className="text-gray-600">Manage your API keys for accessing Idynic services</p>
                </div>
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key to access Idynic services programmatically
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">API Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="My App API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyExpiry">Expires in (days)</Label>
                      <Input
                        id="keyExpiry"
                        type="number"
                        min="1"
                        max="365"
                        value={newKeyDays}
                        onChange={(e) => setNewKeyDays(parseInt(e.target.value))}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateKey}
                      disabled={createKeyMutation.isPending || !newKeyName.trim()}
                      className="w-full"
                    >
                      {createKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Created Key Display */}
          {createdKey && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Created Successfully
                </CardTitle>
                <CardDescription className="text-green-700">
                  Copy your API key now. You won't be able to see it again!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm bg-white p-3 rounded border">
                      {showCreatedKey ? createdKey : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreatedKey(!showCreatedKey)}
                    >
                      {showCreatedKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyKey}
                      className="flex items-center gap-2"
                    >
                      {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedKey ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setCreatedKey(null)}
                    variant="outline"
                    size="sm"
                  >
                    I've copied my key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys List */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                API keys allow you to authenticate with Idynic services programmatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading API keys...</p>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't created any API keys yet. Create one to get started.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    Create Your First API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{key.name}</h4>
                          <Badge variant={key.active ? 'default' : 'secondary'}>
                            {key.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Key ID: {key.key_id}</p>
                          <p>Created: {new Date(key.created_at).toLocaleDateString()}</p>
                          <p>Expires: {new Date(key.expires_at).toLocaleDateString()}</p>
                          {key.last_used_at && (
                            <p>Last used: {new Date(key.last_used_at).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleKey(key.key_id, key.active)}
                          disabled={updateKeyMutation.isPending}
                        >
                          {key.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{key.name}"? This action cannot be undone
                                and will immediately revoke access for any applications using this key.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteKeyMutation.mutate(key.key_id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Using Your API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Include your API key in the Authorization header of your requests:
                  </p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    Authorization: Bearer ak_xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Base URL</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Make requests to the Idynic API:
                  </p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    {process.env.NEXT_PUBLIC_API_BASE_URL || 'https://u8ryhgkdri.execute-api.us-east-1.amazonaws.com'}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Rate Limits</h4>
                  <p className="text-sm text-gray-600">
                    API keys are subject to rate limiting. Contact support if you need higher limits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}