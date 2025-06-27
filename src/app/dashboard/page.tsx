'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { Plus, Upload, Search, User, LogOut, Key } from 'lucide-react';
import { useState } from 'react';
import { FeedEvidenceModal } from '@/components/feed-evidence-modal';
import { AnalyzeOpportunityModal } from '@/components/analyze-opportunity-modal';
import Link from 'next/link';

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [feedEvidenceOpen, setFeedEvidenceOpen] = useState(false);
  const [analyzeOpportunityOpen, setAnalyzeOpportunityOpen] = useState(false);

  const { data: identity, isLoading: identityLoading } = useQuery({
    queryKey: ['identity'],
    queryFn: api.identity.getIdentityGraph,
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: api.opportunities.getUserOpportunities,
  });

  const { data: solutions, isLoading: solutionsLoading } = useQuery({
    queryKey: ['solutions'],
    queryFn: api.solutions.getUserSolutions,
  });

  // Mock trait constellation data - replace with actual data from identity
  const traitCategories = [
    { name: 'Technical Skills', count: 12, color: 'bg-blue-500' },
    { name: 'Leadership', count: 8, color: 'bg-green-500' },
    { name: 'Communication', count: 6, color: 'bg-purple-500' },
    { name: 'Problem Solving', count: 10, color: 'bg-orange-500' },
    { name: 'Domain Expertise', count: 15, color: 'bg-red-500' },
  ];

  const completionPercentage = identity?.data ? Math.min(100, Object.keys(identity.data).length * 10) : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Identity Dashboard</h1>
                <p className="text-gray-600">Track your strategic identity and opportunities</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Profile {completionPercentage}% Complete
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.attributes?.given_name || user?.username || 'User'}
                  </span>
                  <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Identity Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Identity Strength
                  </CardTitle>
                  <CardDescription>
                    Build a stronger profile by adding more evidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completion</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="w-full" />
                    <Button 
                      onClick={() => setFeedEvidenceOpen(true)}
                      className="w-full flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Feed Your Identity
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trait Constellation */}
              <Card>
                <CardHeader>
                  <CardTitle>Trait Constellation</CardTitle>
                  <CardDescription>
                    Your unique combination of skills and attributes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {identityLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading identity data...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {traitCategories.map((category) => (
                        <div key={category.name} className="text-center p-4 rounded-lg border">
                          <div className={`w-16 h-16 mx-auto rounded-full ${category.color} flex items-center justify-center text-white font-bold text-lg mb-2`}>
                            {category.count}
                          </div>
                          <h3 className="font-medium text-sm text-gray-900">{category.name}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest opportunities and solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {opportunitiesLoading ? (
                      <p className="text-gray-600">Loading opportunities...</p>
                    ) : opportunities && opportunities.length > 0 ? (
                      opportunities.slice(0, 3).map((opportunity) => (
                        <div key={opportunity.opportunityId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{opportunity.analysisData.basic_info.job_title}</h4>
                            <p className="text-sm text-gray-600">{opportunity.analysisData.basic_info.company_name}</p>
                          </div>
                          <Badge variant={opportunity.analysisStatus === 'COMPLETE' ? 'default' : 'secondary'}>
                            {opportunity.analysisStatus}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No opportunities yet. Analyze your first opportunity!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setAnalyzeOpportunityOpen(true)}
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <Search className="h-4 w-4" />
                    Analyze Opportunity
                  </Button>
                  <Button 
                    onClick={() => setFeedEvidenceOpen(true)}
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    Add Evidence
                  </Button>
                  <Link href="/api-keys">
                    <Button 
                      className="w-full flex items-center gap-2"
                      variant="outline"
                    >
                      <Key className="h-4 w-4" />
                      Manage API Keys
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Solutions Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Solutions</CardTitle>
                  <CardDescription>
                    Generated solutions and exports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {solutionsLoading ? (
                    <p className="text-gray-600">Loading solutions...</p>
                  ) : solutions && solutions.length > 0 ? (
                    <div className="space-y-3">
                      {solutions.slice(0, 3).map((solution) => (
                        <div key={solution.solutionId} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">
                            {solution.title || 'Untitled Solution'}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(solution.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        View All Solutions
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No solutions yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <FeedEvidenceModal 
          open={feedEvidenceOpen} 
          onOpenChange={setFeedEvidenceOpen} 
        />
        <AnalyzeOpportunityModal 
          open={analyzeOpportunityOpen} 
          onOpenChange={setAnalyzeOpportunityOpen} 
        />
      </div>
    </ProtectedRoute>
  );
}