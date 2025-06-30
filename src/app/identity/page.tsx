'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MapPin, Briefcase, Mail, Target, TrendingUp, FileText, Brain, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Identity {
  name?: string;
  email?: string;
  location?: string;
  title?: string;
}

interface Trait {
  trait: string;
  evidence: string;
  confidence: number;
  name: string;
  weight: number;
  lastObserved: number;
  evidenceSnippets?: string[];
  reasoning?: string[];
}

interface IdentityGraph {
  identity: Identity;
  traits: Trait[];
  evidenceCount: number;
}

function IdentityGraphPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: identityGraph, isLoading, error } = useQuery({
    queryKey: ['identity-graph'],
    queryFn: api.identity.getIdentityGraph,
  });

  // Group traits by weight ranges for visualization
  const getTraitsByStrength = (traits: Trait[] | null | undefined) => {
    const validTraits = Array.isArray(traits) ? traits : [];
    const strong = validTraits.filter(t => t.weight >= 0.8);
    const moderate = validTraits.filter(t => t.weight >= 0.6 && t.weight < 0.8);
    const emerging = validTraits.filter(t => t.weight < 0.6);
    return { strong, moderate, emerging };
  };

  // Get top skills for constellation view
  const getTopTraits = (traits: Trait[] | null | undefined, count: number = 10) => {
    const validTraits = Array.isArray(traits) ? traits : [];
    return [...validTraits]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, count);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !identityGraph) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load identity graph. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { identity = {}, traits: rawTraits, evidenceCount = 0 } = identityGraph;
  // Ensure traits is always an array, even if the API returns null
  const traits = Array.isArray(rawTraits) ? rawTraits : [];
  const { strong, moderate, emerging } = getTraitsByStrength(traits);
  const topTraits = getTopTraits(traits);

  return (
    <div>
      <main className="relative bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{traits.length}</div>
                  <div className="text-sm text-gray-600">Total Skills</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{strong.length}</div>
                  <div className="text-sm text-gray-600">Strong Skills</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">💪</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{moderate.length}</div>
                  <div className="text-sm text-gray-600">Moderate Skills</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⚡</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{emerging.length}</div>
                  <div className="text-sm text-gray-600">Emerging Skills</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🌱</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Skill Categories */}
            <div className="space-y-6">
              {/* Skill Strength Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Categories</h3>
                
                <div className="space-y-3">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCategory === 'strong' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === 'strong' ? null : 'strong')}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-800">Strong Skills</span>
                      <Badge className="bg-green-100 text-green-800">{strong.length}</Badge>
                    </div>
                    <div className="text-sm text-green-600">80%+ confidence</div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCategory === 'moderate' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === 'moderate' ? null : 'moderate')}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-yellow-800">Moderate Skills</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{moderate.length}</Badge>
                    </div>
                    <div className="text-sm text-yellow-600">60-79% confidence</div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCategory === 'emerging' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === 'emerging' ? null : 'emerging')}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-purple-800">Emerging Skills</span>
                      <Badge className="bg-purple-100 text-purple-800">{emerging.length}</Badge>
                    </div>
                    <div className="text-sm text-purple-600">Below 60% confidence</div>
                  </div>
                </div>
              </div>

              {/* Top Skills Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
                <div className="grid grid-cols-2 gap-3">
                  {topTraits.slice(0, 6).map((trait) => (
                    <div
                      key={trait.trait}
                      className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border"
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mb-2 ${
                          trait.weight >= 0.8 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          trait.weight >= 0.6 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}
                      >
                        {Math.round(trait.weight * 100)}
                      </div>
                      <h4 className="font-medium text-center text-xs leading-tight">{trait.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Skills List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedCategory ? 
                      `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Skills` : 
                      'All Skills'
                    }
                  </h2>
                  <div className="text-sm text-gray-500">
                    {selectedCategory ? 
                      `${selectedCategory === 'strong' ? strong.length : selectedCategory === 'moderate' ? moderate.length : emerging.length} skills` :
                      `${traits.length} total skills`
                    }
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(selectedCategory ? 
                    selectedCategory === 'strong' ? strong :
                    selectedCategory === 'moderate' ? moderate : emerging
                    : traits.sort((a, b) => b.weight - a.weight)
                  ).map((trait) => (
                    <div key={trait.trait} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{trait.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{trait.evidence}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          trait.weight >= 0.8 ? 'bg-green-100 text-green-800' :
                          trait.weight >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {Math.round(trait.weight * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function IdentityGraphPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <IdentityGraphPageContent />
      </div>
    </ProtectedRoute>
  );
}