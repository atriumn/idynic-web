'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomIcon } from '@/components/ui/custom-icon';
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
  traitType: string;
  evidenceSnippets?: string[];
  reasoning?: string[];
}

interface IdentityGraph {
  identity: Identity;
  traits: Trait[];
  evidenceCount: number;
}

function IdentityGraphPageContent() {
  const [selectedTraitType, setSelectedTraitType] = useState<string | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const { data: identityGraph, isLoading, error } = useQuery({
    queryKey: ['identity-graph'],
    queryFn: api.identity.getIdentityGraph,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
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
  const traits = Array.isArray(rawTraits) ? rawTraits : [];

  // Get unique trait types
  const traitTypes = Array.from(new Set(traits.map(t => t.traitType))).sort();

  // Filter traits
  const getFilteredTraits = () => {
    let filtered = traits;
    
    if (selectedTraitType) {
      filtered = filtered.filter(t => t.traitType === selectedTraitType);
    }
    
    if (selectedConfidence === 'strong') {
      filtered = filtered.filter(t => t.weight >= 0.8);
    } else if (selectedConfidence === 'moderate') {
      filtered = filtered.filter(t => t.weight >= 0.6 && t.weight < 0.8);
    } else if (selectedConfidence === 'emerging') {
      filtered = filtered.filter(t => t.weight < 0.6);
    }
    
    return filtered.sort((a, b) => b.weight - a.weight);
  };

  const filteredTraits = getFilteredTraits();

  return (
    <div>
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Graph</h1>
            <p className="text-gray-600">
              {traits.length} traits discovered across {evidenceCount} pieces of evidence
            </p>
          </div>

          {/* Modern Filter Pills */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Pills */}
              <div 
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                  selectedTraitType === null 
                    ? 'bg-[#137dc5] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTraitType(null)}
              >
                All {traits.length}
              </div>
              {traitTypes.map((type) => {
                const count = traits.filter(t => t.traitType === type).length;
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                      selectedTraitType === type
                        ? 'bg-[#137dc5] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedTraitType(type)}
                  >
                    <CustomIcon 
                      name={
                        type === 'Skill' ? 'skill' :
                        type === 'Knowledge' ? 'knowledge' :
                        type === 'Work Activity' ? 'work-activity' :
                        type === 'Work Style' ? 'work-style' :
                        type === 'Tool' ? 'tool' : 'skill'
                      }
                      size={14}
                      className={selectedTraitType === type ? 'opacity-80' : 'opacity-60'}
                    />
                    {type} {count}
                  </div>
                );
              })}
              
              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              
              {/* Confidence Pills */}
              <div 
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                  selectedConfidence === null 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedConfidence(null)}
              >
                All Confidence
              </div>
              <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                  selectedConfidence === 'strong' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                onClick={() => setSelectedConfidence(selectedConfidence === 'strong' ? null : 'strong')}
              >
                <CustomIcon 
                  name="strong-confidence"
                  size={14}
                  className="opacity-70"
                />
                80%+
              </div>
              <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                  selectedConfidence === 'moderate' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
                onClick={() => setSelectedConfidence(selectedConfidence === 'moderate' ? null : 'moderate')}
              >
                <CustomIcon 
                  name="moderate-confidence"
                  size={14}
                  className="opacity-70"
                />
                60-79%
              </div>
              <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                  selectedConfidence === 'emerging' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedConfidence(selectedConfidence === 'emerging' ? null : 'emerging')}
              >
                <CustomIcon 
                  name="emerging-confidence"
                  size={14}
                  className="opacity-70"
                />
                &lt;60%
              </div>
            </div>
          </div>

          {/* Results Summary & View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredTraits.length} {filteredTraits.length === 1 ? 'trait' : 'traits'}
              {selectedTraitType && ` in ${selectedTraitType}`}
              {selectedConfidence && ` with ${selectedConfidence} confidence`}
            </h2>
            
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="p-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/>
                  <rect x="3" y="10" width="18" height="2" rx="1" fill="currentColor"/>
                  <rect x="3" y="14" width="18" height="2" rx="1" fill="currentColor"/>
                  <rect x="3" y="18" width="18" height="2" rx="1" fill="currentColor"/>
                </svg>
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="p-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div className="col-span-4">Trait Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-1">Confidence</div>
                  <div className="col-span-4">Evidence</div>
                  <div className="col-span-1">Sources</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredTraits.map((trait, index) => (
                  <div key={`${trait.trait}-${trait.name}-${index}`} className="px-4 py-2 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-4">
                        <h3 className="text-sm font-medium text-gray-900">{trait.name}</h3>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <CustomIcon 
                            name={
                              trait.traitType === 'Skill' ? 'skill' :
                              trait.traitType === 'Knowledge' ? 'knowledge' :
                              trait.traitType === 'Work Activity' ? 'work-activity' :
                              trait.traitType === 'Work Style' ? 'work-style' :
                              trait.traitType === 'Tool' ? 'tool' : 'skill'
                            }
                            size={16}
                            className="opacity-60"
                          />
                          <Badge variant="secondary" className="text-xs">
                            {trait.traitType}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          trait.weight >= 0.8 ? 'bg-green-100 text-green-800' :
                          trait.weight >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <CustomIcon 
                            name={
                              trait.weight >= 0.8 ? 'strong-confidence' :
                              trait.weight >= 0.6 ? 'moderate-confidence' :
                              'emerging-confidence'
                            }
                            size={12}
                            className="opacity-70"
                          />
                          {Math.round(trait.weight * 100)}%
                        </div>
                      </div>
                      <div className="col-span-4">
                        <p className="text-xs text-gray-600 line-clamp-2" title={trait.evidence}>
                          {trait.evidence}
                        </p>
                      </div>
                      <div className="col-span-1">
                        {trait.evidenceSnippets && trait.evidenceSnippets.length > 1 && (
                          <div className="text-xs text-gray-400">
                            +{trait.evidenceSnippets.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTraits.map((trait, index) => (
                <div key={`${trait.trait}-${trait.name}-${index}`} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{trait.name}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ml-3 ${
                      trait.weight >= 0.8 ? 'bg-green-100 text-green-800' :
                      trait.weight >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <CustomIcon 
                        name={
                          trait.weight >= 0.8 ? 'strong-confidence' :
                          trait.weight >= 0.6 ? 'moderate-confidence' :
                          'emerging-confidence'
                        }
                        size={12}
                        className="opacity-70"
                      />
                      {Math.round(trait.weight * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <CustomIcon 
                      name={
                        trait.traitType === 'Skill' ? 'skill' :
                        trait.traitType === 'Knowledge' ? 'knowledge' :
                        trait.traitType === 'Work Activity' ? 'work-activity' :
                        trait.traitType === 'Work Style' ? 'work-style' :
                        trait.traitType === 'Tool' ? 'tool' : 'skill'
                      }
                      size={16}
                      className="opacity-60"
                    />
                    <Badge variant="secondary" className="text-xs">
                      {trait.traitType}
                    </Badge>
                    {trait.evidenceSnippets && trait.evidenceSnippets.length > 1 && (
                      <div className="text-xs text-gray-400 ml-auto">
                        +{trait.evidenceSnippets.length - 1} sources
                      </div>
                    )}
                  </div>
                  
                  <blockquote className="text-xs text-gray-600 italic border-l-2 border-gray-200 pl-3 line-clamp-3">
                    {trait.evidence}
                  </blockquote>
                </div>
              ))}
            </div>
          )}

          {filteredTraits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No traits match the selected filters.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTraitType(null);
                  setSelectedConfidence(null);
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
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