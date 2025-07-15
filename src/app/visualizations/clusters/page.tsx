'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChordDiagram } from '@/components/charts/ChordDiagram';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import { FeedEvidenceModal } from '@/components/feed-evidence-modal';
import Link from 'next/link';

export default function ClustersPage() {
  const [feedEvidenceOpen, setFeedEvidenceOpen] = useState(false);

  const { data: identityGraph, isLoading, error } = useQuery({
    queryKey: ['identity-graph'],
    queryFn: api.identity.getIdentityGraph,
  });

  const traits = Array.isArray(identityGraph?.traits) ? identityGraph.traits : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  🎯 Semantic Skill Clusters
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  AI analyzes your traits to discover hidden themes and skill groupings. 
                  Each colored segment represents a cluster of related competencies.
                </p>
              </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
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
                <p className="text-gray-600">Running semantic clustering analysis...</p>
              </div>
            ) : error || traits.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-6">🌱</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Your Profile First</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add your experiences to see AI-powered skill clustering.
                </p>
                <Button onClick={() => setFeedEvidenceOpen(true)} size="lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Visualization */}
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex justify-center">
                    <ChordDiagram traits={traits} width={600} height={600} />
                  </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Your Clusters</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span><strong>Arc size:</strong> Number of traits in each semantic cluster</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span><strong>Color grouping:</strong> AI-identified skill themes based on meaning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span><strong>Clustering algorithm:</strong> Uses semantic embeddings, not just categories</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span><strong>Hover for details:</strong> See which traits belong to each cluster</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Insights</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">1.</span>
                        <span><strong>Identify core themes:</strong> Large clusters show your primary expertise areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">2.</span>
                        <span><strong>Spot specializations:</strong> Smaller clusters may be unique differentiators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">3.</span>
                        <span><strong>Portfolio balance:</strong> Consider developing underrepresented themes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">4.</span>
                        <span><strong>Career positioning:</strong> Use themes to craft your professional narrative</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <FeedEvidenceModal 
          open={feedEvidenceOpen} 
          onOpenChange={setFeedEvidenceOpen} 
        />
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}