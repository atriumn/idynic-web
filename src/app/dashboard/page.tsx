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
  const traits = Array.isArray(identity?.traits) ? identity.traits : [];
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
      <div className="min-h-screen">
        <Header />

        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Top Skills */}
              <div className="space-y-6">
                
                {/* Top Skills */}
                {traits.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Top Skills</h2>
                      <Link href="/identity" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all →
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {traits
                        .sort((a, b) => b.weight - a.weight)
                        .slice(0, 8)
                        .map((trait) => (
                          <div key={trait.trait} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className={`w-3 h-3 rounded-full ${
                              trait.weight >= 0.8 ? 'bg-emerald-500' :
                              trait.weight >= 0.6 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                            <span className="font-medium text-sm text-gray-900 flex-1">{trait.name}</span>
                            <span className="text-xs text-gray-500 font-mono">{Math.round(trait.weight * 100)}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column - Quick Actions */}
              <div className="space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => setFeedEvidenceOpen(true)}
                      className="w-full p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-left hover:from-blue-100 hover:to-purple-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Add Experience</div>
                          <div className="text-xs text-gray-500">Build your skill profile</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setAnalyzeOpportunityOpen(true)}
                      className="w-full p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg text-left hover:from-emerald-100 hover:to-green-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Add Opportunity</div>
                          <div className="text-xs text-gray-500">Track new opportunities</div>
                        </div>
                      </div>
                    </button>
                    
                    <Link 
                      href="/identity"
                      className="block w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-left hover:from-purple-100 hover:to-pink-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">View Identity Graph</div>
                          <div className="text-xs text-gray-500">Explore your skills</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Empty State */}
            {traits.length === 0 && !identityLoading && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <div className="text-6xl mb-6">🌱</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Your Profile</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Add your first experience to start identifying your unique skills and strengths.
                  </p>
                  <button 
                    onClick={() => setFeedEvidenceOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <Upload className="h-5 w-5 mr-2 inline" />
                    Add Your First Experience
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {identityLoading && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto mb-6">
                    <svg className="w-16 h-16 animate-spin" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="45" stroke="url(#loadingGradient)" strokeWidth="8" fill="none" strokeDasharray="70 210" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Profile</h2>
                  <p className="text-gray-600">Discovering your skills and strengths...</p>
                </div>
              </div>
            )}
        </main>

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