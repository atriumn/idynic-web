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
  const getTraitsByStrength = (traits: Trait[]) => {
    const strong = traits.filter(t => t.weight >= 0.8);
    const moderate = traits.filter(t => t.weight >= 0.6 && t.weight < 0.8);
    const emerging = traits.filter(t => t.weight < 0.6);
    return { strong, moderate, emerging };
  };

  // Get top skills for constellation view
  const getTopTraits = (traits: Trait[], count: number = 10) => {
    return [...traits]
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

  const { identity = {}, traits = [], evidenceCount = 0 } = identityGraph;
  const { strong, moderate, emerging } = getTraitsByStrength(traits);
  const topTraits = getTopTraits(traits);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Identity Constellation</h1>
            <p className="text-gray-600">Your complete professional identity and skill profile</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{traits.length}</div>
              <div className="text-sm text-gray-600">Total Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{strong.length}</div>
              <div className="text-sm text-gray-600">Strong Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{moderate.length}</div>
              <div className="text-sm text-gray-600">Moderate Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{evidenceCount}</div>
              <div className="text-sm text-gray-600">Evidence Pieces</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Identity Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle>Professional Identity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {identity.name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{identity.name}</span>
                </div>
              )}
              {identity.title && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{identity.title}</span>
                </div>
              )}
              {identity.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{identity.location}</span>
                </div>
              )}
              {identity.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{identity.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skill Strength Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Skill Strength
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'emerging' ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'emerging' ? null : 'emerging')}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Mentioned Skills</span>
                  <Badge className="bg-gray-100 text-gray-800">{emerging.length}</Badge>
                </div>
                <div className="text-sm text-gray-600">Below 60% confidence</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Skill Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Skills Constellation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Top Skills Constellation
              </CardTitle>
              <CardDescription>
                Your strongest skills visualized by confidence level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topTraits.map((trait, index) => (
                  <div
                    key={trait.trait}
                    className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border hover:shadow-md transition-shadow"
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                        trait.weight >= 0.8 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        trait.weight >= 0.6 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}
                      style={{
                        transform: `scale(${0.8 + (trait.weight * 0.4)})` // Size based on weight
                      }}
                    >
                      {Math.round(trait.weight * 100)}
                    </div>
                    <h4 className="font-medium text-center text-sm leading-tight">{trait.name}</h4>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Skills List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {selectedCategory ? 
                  `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Skills` : 
                  'All Skills'
                }
              </CardTitle>
              <CardDescription>
                {selectedCategory ? 
                  `Viewing ${selectedCategory} skills only. Click a category above to filter.` :
                  'All skills extracted from your evidence. Click a category above to filter.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(selectedCategory ? 
                  selectedCategory === 'strong' ? strong :
                  selectedCategory === 'moderate' ? moderate : emerging
                  : traits.sort((a, b) => b.weight - a.weight)
                ).map((trait) => (
                  <div key={trait.trait} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium">{trait.name}</h4>
                      <p className="text-sm text-gray-600">{trait.evidence}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        trait.weight >= 0.8 ? 'bg-green-100 text-green-800' :
                        trait.weight >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.round(trait.weight * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function IdentityGraphPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <IdentityGraphPageContent />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}