'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useChat } from 'ai/react';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  Share, 
  Send, 
  FileText, 
  Users, 
  Linkedin,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SolutionPageProps {
  params: {
    solutionId: string;
  };
}

export default function SolutionPage({ params }: SolutionPageProps) {
  const router = useRouter();
  const { solutionId } = params;
  const [copied, setCopied] = useState(false);

  const { data: solution, isLoading } = useQuery({
    queryKey: ['solution', solutionId],
    queryFn: () => api.solutions.getSolution(solutionId),
  });

  const publishMutation = useMutation({
    mutationFn: (isPublic: boolean) =>
      api.solutions.updateSolution(solutionId, { isPublic }),
    onSuccess: () => {
      // Refresh the solution data
      window.location.reload();
    },
  });

  const formatMutation = useMutation({
    mutationFn: (formatType: string) =>
      api.mcp.formatAsCoverLetter(solutionId), // This would be dynamic based on formatType
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading: isRefining } = useChat({
    api: `/api/refine/${solutionId}`,
    initialMessages: [],
  });

  const handlePublish = () => {
    publishMutation.mutate(true);
  };

  const handleExport = async (formatType: string) => {
    try {
      let response;
      switch (formatType) {
        case 'cover_letter':
          response = await api.mcp.formatAsCoverLetter(solutionId);
          break;
        case 'resume':
          response = await api.mcp.formatAsResume(solutionId);
          break;
        case 'linkedin':
          response = await api.mcp.formatAsLinkedInPost(solutionId);
          break;
        default:
          return;
      }
      
      // Create and download the file
      const blob = new Blob([response.formattedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formatType}_${solutionId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const copyPublicLink = async () => {
    if (solution?.isPublic) {
      const publicUrl = `${window.location.origin}/s/${solutionId}`;
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading solution...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!solution) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h1>
            <p className="text-gray-600 mb-4">The solution you're looking for doesn't exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {solution.title || 'Solution Review'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={solution.isPublic ? 'default' : 'secondary'}>
                      {solution.isPublic ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Created {new Date(solution.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Export Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('cover_letter')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Cover Letter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('resume')}>
                      <Users className="h-4 w-4 mr-2" />
                      Resume Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('linkedin')}>
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Publish/Share Button */}
                {solution.isPublic ? (
                  <Button onClick={copyPublicLink} className="flex items-center gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePublish}
                    disabled={publishMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    {publishMutation.isPending ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Solution Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Value Proposition</CardTitle>
                  <CardDescription>
                    Your unique value for this opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-900">
                      {solution.valueProposition}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact History</CardTitle>
                  <CardDescription>
                    Relevant achievements and experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-900">
                      {solution.impactHistory}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refinement Chat */}
              <Card>
                <CardHeader>
                  <CardTitle>Refine Your Solution</CardTitle>
                  <CardDescription>
                    Use AI to improve and customize your solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    {messages.length > 0 && (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-sm px-4 py-2 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="How would you like to refine this solution?"
                        disabled={isRefining}
                      />
                      <Button type="submit" disabled={isRefining || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>

                    {messages.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Ask for refinements like:</p>
                        <ul className="mt-2 text-sm space-y-1">
                          <li>"Make it more technical"</li>
                          <li>"Add more specific examples"</li>
                          <li>"Make it shorter and more concise"</li>
                          <li>"Emphasize leadership experience"</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Solution Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Solution Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge variant={solution.isPublic ? 'default' : 'secondary'}>
                        {solution.isPublic ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(solution.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(solution.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExport('cover_letter')}
                  >
                    Export as Cover Letter
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExport('resume')}
                  >
                    Export as Resume
                  </Button>
                  {!solution.isPublic && (
                    <Button 
                      onClick={handlePublish}
                      disabled={publishMutation.isPending}
                      className="w-full"
                    >
                      {publishMutation.isPending ? 'Publishing...' : 'Publish Solution'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}