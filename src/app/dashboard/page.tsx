'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Upload, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { FeedEvidenceModal } from '@/components/feed-evidence-modal';
import { AnalyzeOpportunityModal } from '@/components/analyze-opportunity-modal';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function DashboardPage() {
  const [feedEvidenceOpen, setFeedEvidenceOpen] = useState(false);
  const [analyzeOpportunityOpen, setAnalyzeOpportunityOpen] = useState(false);

  const { data: identity, isLoading: identityLoading } = useQuery({
    queryKey: ['identity'],
    queryFn: api.identity.getIdentityGraph,
  });

  // Get real trait data and categorize by strength
  const traits = identity?.traits || [];
  const evidenceCount = identity?.evidenceCount || 0;
  
  // Categorize traits by confidence level
  const strongTraits = traits.filter(t => t.weight >= 0.8);
  const moderateTraits = traits.filter(t => t.weight >= 0.6 && t.weight < 0.8);
  const emergingTraits = traits.filter(t => t.weight < 0.6);
  
  const traitCategories = [
    { name: 'Strong Skills', count: strongTraits.length, color: 'from-green-500 to-emerald-600', bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600' },
    { name: 'Moderate Skills', count: moderateTraits.length, color: 'from-yellow-500 to-amber-600', bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-600' },
    { name: 'Mentioned Skills', count: emergingTraits.length, color: 'from-gray-500 to-slate-600', bgColor: 'bg-gradient-to-br from-gray-500 to-slate-600' },
    { name: 'Total Skills', count: traits.length, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  ];
  
  // Identity development stages
  const getIdentityDepth = (count: number) => {
    if (count === 0) return { label: 'Foundation', description: 'The beginning of something significant', icon: '🌰' };
    if (count <= 2) return { label: 'Emerging', description: 'Patterns starting to crystallize', icon: '🌱' };
    if (count <= 5) return { label: 'Developing', description: 'Distinct characteristics taking shape', icon: '🌸' };
    if (count <= 10) return { label: 'Established', description: 'Strong, defined professional identity', icon: '🌳' };
    return { label: 'Mastery', description: 'Deep, interconnected expertise', icon: '🌲' };
  };
  
  const identityDepth = getIdentityDepth(evidenceCount);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Progress & Actions */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Progress Indicator */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{identityDepth.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{identityDepth.label}</h3>
                    <p className="text-sm text-gray-600">{identityDepth.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {evidenceCount > 0 ? `${evidenceCount} contributions` : 'Ready to begin'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative">
                      <Upload className="h-8 w-8 text-emerald-600" />
                      <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900">Grow Your Identity</h3>
                      <p className="text-sm text-gray-600 mb-4">Share your experiences to cultivate your unique profile</p>
                      <Button 
                        onClick={() => setFeedEvidenceOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                      >
                        Add Your Story
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <Search className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900">Analyze Opportunities</h3>
                      <p className="text-sm text-gray-600 mb-4">Evaluate job postings and discover strategic advantages</p>
                      <Button 
                        onClick={() => setAnalyzeOpportunityOpen(true)}
                        size="sm"
                        variant="outline"
                      >
                        Explore Match
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Skills Preview */}
              {traits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Skills</CardTitle>
                    <CardDescription>Your strongest identified capabilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {traits
                        .sort((a, b) => b.weight - a.weight)
                        .slice(0, 5)
                        .map((trait, index) => (
                          <div key={trait.trait} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${
                              trait.weight >= 0.8 ? 'bg-green-500' :
                              trait.weight >= 0.6 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                            <span className="text-sm font-medium flex-1 truncate">{trait.name}</span>
                            <span className="text-xs text-gray-500">{Math.round(trait.weight * 100)}%</span>
                          </div>
                        ))}
                    </div>
                    {traits.length > 5 && (
                      <div className="mt-3 text-center">
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link href="/identity">View All {traits.length} Skills →</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side - Recent Activity & Overview */}
            <div className="col-span-12 lg:col-span-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Identity Overview</CardTitle>
                  <CardDescription>
                    Your professional profile and skill development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {identityLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-4">Loading your profile...</p>
                    </div>
                  ) : traits.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🌱</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Build Your Identity</h3>
                      <p className="text-gray-600 mb-6">Submit your first evidence to start discovering your unique professional traits</p>
                      <Button onClick={() => setFeedEvidenceOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Evidence
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Skills Summary */}
                      <div className="grid grid-cols-4 gap-4">
                        {traitCategories.map((category) => (
                          <div key={category.name} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${category.bgColor} flex items-center justify-center text-white font-bold`}>
                              {category.count}
                            </div>
                            <h4 className="font-medium text-sm text-gray-900">{category.name}</h4>
                          </div>
                        ))}
                      </div>

                      {/* Recent Skills Added */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Recently Identified Skills</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {traits
                            .sort((a, b) => b.lastObserved - a.lastObserved)
                            .slice(0, 6)
                            .map((trait) => (
                              <div key={trait.trait} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${
                                  trait.weight >= 0.8 ? 'bg-green-500' :
                                  trait.weight >= 0.6 ? 'bg-yellow-500' : 'bg-gray-400'
                                }`} />
                                <span className="font-medium text-sm flex-1">{trait.name}</span>
                                <span className="text-xs text-gray-500">{Math.round(trait.weight * 100)}%</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button asChild className="flex-1">
                          <Link href="/identity">
                            <Sparkles className="h-4 w-4 mr-2" />
                            View Full Identity Graph
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={() => setFeedEvidenceOpen(true)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Add Evidence
                        </Button>
                      </div>
                    </div>
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
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}