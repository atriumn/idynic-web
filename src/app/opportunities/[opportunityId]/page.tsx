'use client';

import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Target, 
  Zap, 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  Users,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Header } from '@/components/header';

interface OpportunityPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityPage({ params }: OpportunityPageProps) {
  const router = useRouter();
  const { opportunityId } = React.use(params);

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
            <p className="text-gray-600 mb-4">The opportunity you&apos;re looking for doesn&apos;t exist.</p>
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
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Navigation */}
            <div className="flex items-center gap-4 mb-6">
              <Link href="/opportunities">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Opportunities
                </Button>
              </Link>
              {opportunity.opportunityUrl && (
                <a 
                  href={opportunity.opportunityUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original Posting
                </a>
              )}
            </div>

            {/* Job Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {analysisData.basic_info.job_title}
                  </h1>
                  <Badge variant="outline" className="text-sm">
                    {analysisData.summary.seniority_level}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span className="text-lg font-medium">{analysisData.basic_info.company_name}</span>
                  </div>
                  {analysisData.basic_info.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{analysisData.basic_info.location}</span>
                    </div>
                  )}
                  {analysisData.basic_info.employment_type && (
                    <Badge variant="secondary">{analysisData.basic_info.employment_type}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Added {formatDistanceToNow(new Date(opportunity.createdAt))} ago</span>
                  </div>
                  {analysisData.basic_info.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{analysisData.basic_info.salary_range}</span>
                    </div>
                  )}
                  {analysisData.basic_info.application_deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {analysisData.basic_info.application_deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Button 
                  onClick={handleGenerateSolution}
                  disabled={generateSolutionMutation.isPending}
                  className="flex items-center gap-2 px-6"
                  size="lg"
                >
                  <Zap className="h-4 w-4" />
                  {generateSolutionMutation.isPending ? 'Generating...' : 'Generate Solution'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Three-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Opportunity Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Role Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-6 w-6 text-blue-600" />
                    Role Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Responsibilities */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {analysisData.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-blue-600 mt-1 font-bold text-lg">•</span>
                          <span className="text-gray-700 leading-relaxed">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  {analysisData.benefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisData.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                            <span className="text-yellow-600">★</span>
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills & Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                    Skills & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Required Skills */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Required Skills</h3>
                    <div className="space-y-3">
                      {analysisData.required_skills.filter(skill => skill.requirement_level === 'Required').map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                          <div>
                            <span className="font-medium text-gray-900">{skill.skill_name}</span>
                            <p className="text-sm text-gray-600">{skill.category}</p>
                            {skill.context && (
                              <p className="text-xs text-gray-500 mt-1">{skill.context}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {skill.years_required && (
                              <Badge variant="outline" className="bg-white">
                                {skill.years_required}+ years
                              </Badge>
                            )}
                            {skill.proficiency_level && (
                              <Badge variant="secondary" className="text-xs">
                                {skill.proficiency_level}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  {analysisData.required_skills.filter(skill => skill.requirement_level === 'Preferred').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Preferred Skills</h3>
                      <div className="space-y-3">
                        {analysisData.required_skills.filter(skill => skill.requirement_level === 'Preferred').map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                              <span className="font-medium text-gray-900">{skill.skill_name}</span>
                              <p className="text-sm text-gray-600">{skill.category}</p>
                              {skill.context && (
                                <p className="text-xs text-gray-500 mt-1">{skill.context}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {skill.years_required && (
                                <Badge variant="outline" className="bg-white">
                                  {skill.years_required}+ years
                                </Badge>
                              )}
                              {skill.proficiency_level && (
                                <Badge variant="secondary" className="text-xs">
                                  {skill.proficiency_level}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Qualifications */}
                  {(analysisData.qualifications.education || analysisData.qualifications.certifications || analysisData.qualifications.experience) && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Qualifications</h3>
                      <div className="space-y-4">
                        {analysisData.qualifications.education && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                            {analysisData.qualifications.education.map((edu, index) => (
                              <div key={index} className="text-sm text-gray-700">
                                {edu.level} {edu.field && `in ${edu.field}`} ({edu.requirement_level})
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {analysisData.qualifications.experience && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                            <div className="text-sm text-gray-700 space-y-1">
                              {analysisData.qualifications.experience.years_total && (
                                <div>{analysisData.qualifications.experience.years_total}+ years total experience</div>
                              )}
                              {analysisData.qualifications.experience.years_relevant && (
                                <div>{analysisData.qualifications.experience.years_relevant}+ years relevant experience</div>
                              )}
                              {analysisData.qualifications.experience.industries && (
                                <div>Industries: {analysisData.qualifications.experience.industries.join(', ')}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {analysisData.qualifications.certifications && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                            {analysisData.qualifications.certifications.map((cert, index) => (
                              <div key={index} className="text-sm text-gray-700">
                                {cert.certification_name} ({cert.requirement_level})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Culture */}
              {analysisData.company_culture && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-6 w-6 text-green-600" />
                      Company Culture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisData.company_culture.values && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Values</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisData.company_culture.values.map((value, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisData.company_culture.work_environment && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Work Environment</h4>
                        <p className="text-gray-700">{analysisData.company_culture.work_environment}</p>
                      </div>
                    )}
                    {analysisData.company_culture.team_size && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Team Size</h4>
                        <p className="text-gray-700">{analysisData.company_culture.team_size}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-6">
              {/* Action Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleGenerateSolution}
                    disabled={generateSolutionMutation.isPending}
                    className="w-full h-12 text-lg flex items-center gap-3"
                    size="lg"
                  >
                    <Zap className="h-5 w-5" />
                    {generateSolutionMutation.isPending ? 'Generating Solution...' : 'Generate Solution'}
                  </Button>
                  
                  {opportunity.opportunityUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <a href={opportunity.opportunityUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Directly
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Key Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.summary.key_technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}