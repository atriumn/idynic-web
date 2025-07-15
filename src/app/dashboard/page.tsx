'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Upload, Search, Sparkles } from 'lucide-react';
import { CustomIcon } from '@/components/ui/custom-icon';
import { useState } from 'react';
import { FeedEvidenceModal } from '@/components/feed-evidence-modal';
import { AnalyzeOpportunityModal } from '@/components/analyze-opportunity-modal';
import { ChordDiagram } from '@/components/charts/ChordDiagram';
import { ForceGraph } from '@/components/charts/ForceGraph';
import { RadialTree } from '@/components/charts/RadialTree';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function DashboardPage() {
  const [feedEvidenceOpen, setFeedEvidenceOpen] = useState(false);
  const [analyzeOpportunityOpen, setAnalyzeOpportunityOpen] = useState(false);

  const { data: identity, isLoading: identityLoading } = useQuery({
    queryKey: ['identity'],
    queryFn: api.identity.getIdentityGraph,
  });

  // Get real trait data
  const traits = Array.isArray(identity?.traits) ? identity.traits : [];
  const evidenceCount = identity?.evidenceCount || 0;
  
  // Get opportunities count
  const { data: opportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: api.opportunities.getUserOpportunities,
  });
  const opportunitiesCount = opportunities?.length || 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Personal Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="group relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl p-6 text-center border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#137dc5] to-[#0f6ba3] bg-clip-text text-transparent mb-2">{traits.length}</div>
                  <div className="text-sm font-medium text-gray-600">Traits Identified</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-3 opacity-60"></div>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-xl p-6 text-center border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{evidenceCount}</div>
                  <div className="text-sm font-medium text-gray-600">Experiences Added</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto mt-3 opacity-60"></div>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl p-6 text-center border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{opportunitiesCount}</div>
                  <div className="text-sm font-medium text-gray-600">Opportunities Analyzed</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-3 opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Share Your Story - EXPLOSIVE VISUAL */}
              <div className="group relative rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-700 hover:-translate-y-3 hover:rotate-1">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#137dc5] via-[#1e7bd4] to-[#0f6ba3]">
                  <div className="absolute inset-0 opacity-20 bg-white/5 bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 group-hover:rotate-45 transition-all duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300/30 rounded-full blur-xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 delay-150"></div>
                </div>
                
                <div className="relative p-8 text-white">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">Share Your Story</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">Transform experiences into professional identity. Upload resumes, achievements, or stories that define you.</p>
                  </div>
                  <button 
                    onClick={() => setFeedEvidenceOpen(true)}
                    className="group/btn bg-white text-[#137dc5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu flex items-center gap-3"
                  >
                    <Upload className="h-6 w-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Add Experience
                    <div className="w-2 h-2 bg-[#137dc5] rounded-full group-hover/btn:scale-150 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
              
              {/* Use Our Tools - VIOLET GRADIENT */}
              <div className="group relative rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-700 hover:-translate-y-3 hover:rotate-1">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
                  <div className="absolute inset-0 opacity-20 bg-white/5 bg-[radial-gradient(circle_at_15px_15px,white_1px,transparent_1px)] bg-[length:25px_25px]"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 group-hover:rotate-45 transition-all duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-300/30 rounded-full blur-xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 delay-150"></div>
                </div>
                
                <div className="relative p-8 text-white">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">Use Our Tools</h2>
                    <p className="text-violet-100 text-lg leading-relaxed">Access AI-powered tools for career optimization, skill analysis, and professional development.</p>
                  </div>
                  <Link href="/tools">
                    <button className="group/btn bg-white text-violet-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-50 transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu flex items-center gap-3">
                      <Sparkles className="h-6 w-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                      Explore Tools
                      <div className="w-2 h-2 bg-violet-600 rounded-full group-hover/btn:scale-150 transition-transform duration-300"></div>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Find Your Fit - DARK ENERGY */}
              <div className="group relative rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-700 hover:-translate-y-3 hover:-rotate-1">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                  <div className="absolute inset-0 opacity-30 bg-white/5 bg-[radial-gradient(circle_at_10px_10px,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl group-hover:scale-150 group-hover:-rotate-45 transition-all duration-1000"></div>
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 delay-200"></div>
                </div>
                
                <div className="relative p-8 text-white">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 border border-white/20">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">Find Your Fit</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">AI-powered opportunity analysis. Generate solutions that showcase your unique value for any role.</p>
                  </div>
                  <button 
                    onClick={() => setAnalyzeOpportunityOpen(true)}
                    className="group/btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu flex items-center gap-3"
                  >
                    <Search className="h-6 w-6 group-hover/btn:scale-125 transition-transform duration-300" />
                    Analyze Opportunity
                    <div className="w-2 h-2 bg-white rounded-full group-hover/btn:scale-150 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Visualizations */}
            {traits.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">AI-Powered Identity Analysis</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                    <RadialTree traits={traits} width={300} height={300} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                    <ChordDiagram traits={traits} width={280} height={280} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                    <ForceGraph traits={traits} width={350} height={280} />
                  </div>
                </div>
                
              </div>
            )}
          </div>

            {/* Empty State */}
            {traits.length === 0 && !identityLoading && (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Idynic</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start building your professional identity by adding your first experience.
                </p>
                <button 
                  onClick={() => setFeedEvidenceOpen(true)}
                  className="px-8 py-4 bg-[#137dc5] text-white font-medium rounded-lg hover:bg-[#0f6ba3] transition-colors"
                >
                  <Upload className="h-5 w-5 mr-2 inline" />
                  Get Started
                </button>
              </div>
            )}

            {/* Loading State */}
            {identityLoading && (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-6 border-4 border-[#137dc5] border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Profile</h2>
                <p className="text-gray-600">Discovering your skills and strengths...</p>
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