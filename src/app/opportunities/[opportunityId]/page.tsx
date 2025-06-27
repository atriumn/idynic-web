'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Building, MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';

interface OpportunityPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityPage({ params }: OpportunityPageProps) {
  const router = useRouter();
  const { opportunityId } = params;

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: () => api.opportunities.getOpportunity(opportunityId),
  });

  const { data: identity } = useQuery({
    queryKey: ['identity'],
    queryFn: api.identity.getIdentityGraph,
  });

  const generateSolutionMutation = useMutation({
    mutationFn: (data: { opportunityId: string }) =>
      api.mcp.generateSolution(data.opportunityId),
    onSuccess: (response) => {
      // Navigate to the new solution page
      if (response.solution_id) {
        router.push(`/solutions/${response.solution_id}`);
      }
    },
  });

  const handleGenerateSolution = () => {
    generateSolutionMutation.mutate({ opportunityId });
  };

  // Calculate match percentage (mock calculation)
  const calculateMatchPercentage = () => {
    if (!opportunity || !identity) return 0;
    
    const requiredSkills = opportunity.analysisData.required_skills.length;
    const matchedSkills = Math.floor(requiredSkills * 0.7); // Mock 70% match
    return Math.min(100, Math.round((matchedSkills / requiredSkills) * 100));
  };

  const matchPercentage = calculateMatchPercentage();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading opportunity...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!opportunity) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h1>
            <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const { analysisData } = opportunity;

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
                    {analysisData.basic_info.job_title}
                  </h1>
                  <p className="text-gray-600">{analysisData.basic_info.company_name}</p>
                </div>
              </div>
              <Button 
                onClick={handleGenerateSolution}
                disabled={generateSolutionMutation.isPending}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {generateSolutionMutation.isPending ? 'Generating...' : 'Generate Solution'}
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Job Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{analysisData.basic_info.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{analysisData.basic_info.employment_type || 'Full-time'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{analysisData.basic_info.salary_range || 'Salary not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {analysisData.summary.seniority_level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                  <CardDescription>
                    Skills and competencies needed for this role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData.required_skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{skill.skill_name}</h4>
                          <p className="text-sm text-gray-600">{skill.category}</p>
                          {skill.context && (
                            <p className="text-xs text-gray-500 mt-1">{skill.context}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={skill.requirement_level === 'Required' ? 'default' : 'secondary'}
                          >
                            {skill.requirement_level}
                          </Badge>
                          {skill.years_required && (
                            <p className="text-xs text-gray-500 mt-1">
                              {skill.years_required}+ years
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Company Culture */}
              {analysisData.company_culture && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Culture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisData.company_culture.values && analysisData.company_culture.values.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Values</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisData.company_culture.values.map((value, index) => (
                              <Badge key={index} variant="outline">{value}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisData.company_culture.work_environment && (
                        <div>
                          <h4 className="font-medium mb-2">Work Environment</h4>
                          <p className="text-sm text-gray-600">{analysisData.company_culture.work_environment}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Match Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Match</CardTitle>
                  <CardDescription>
                    How well you align with this opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {matchPercentage}%
                    </div>
                    <Progress value={matchPercentage} className="w-full" />
                    <p className="text-sm text-gray-600">
                      Based on your skills and experience
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.summary.key_technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
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
                    onClick={handleGenerateSolution}
                    disabled={generateSolutionMutation.isPending}
                    className="w-full flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {generateSolutionMutation.isPending ? 'Generating...' : 'Generate Solution'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}