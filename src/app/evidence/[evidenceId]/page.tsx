'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api, type EvidenceRecord, type Trait } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Calendar, ArrowLeft, TrendingUp, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';

function EvidenceDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const evidenceId = params.evidenceId as string;

  const { data: evidenceRecords, isLoading: evidenceLoading } = useQuery({
    queryKey: ['evidence'],
    queryFn: api.identity.getEvidence,
  });

  const { data: traits, isLoading: traitsLoading } = useQuery({
    queryKey: ['traits'],
    queryFn: api.identity.getTraits,
    onSuccess: (data) => {
      console.log('Traits data received:', data);
      console.log('Number of traits:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('First trait structure:', data[0]);
        console.log('All trait keys:', Object.keys(data[0] || {}));
      }
    },
    onError: (error) => {
      console.error('Error fetching traits:', error);
    },
  });

  const evidence = evidenceRecords?.find((record: EvidenceRecord) => record.evidenceId === evidenceId);

  const getEvidenceIcon = (source: string) => {
    switch (source) {
      case 'resume':
        return FileText;
      case 'story':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getEvidenceTitle = (record: EvidenceRecord) => {
    if (record.source === 'resume') {
      return 'Resume/CV';
    }
    if (record.source === 'story') {
      return 'Professional Story';
    }
    return `${record.source.charAt(0).toUpperCase() + record.source.slice(1)} Evidence`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'text-green-600';
    if (weight >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getWeightLabel = (weight: number) => {
    if (weight >= 0.8) return 'Strong';
    if (weight >= 0.6) return 'Moderate';
    return 'Emerging';
  };

  // Filter traits that were observed around the time this evidence was created
  // Since we don't have direct evidence-to-trait linking, we'll show traits observed 
  // within a reasonable time window of the evidence creation
  const getRelatedTraits = () => {
    if (!evidence || !traits) {
      console.log('getRelatedTraits: missing evidence or traits', { evidence: !!evidence, traits: !!traits });
      return [];
    }
    
    const evidenceTime = new Date(evidence.createdAt).getTime() / 1000;
    const timeWindow = 86400; // 24 hours in seconds
    
    console.log('Evidence time:', evidenceTime, 'Evidence created:', evidence.createdAt);
    console.log('All traits:', traits.map(t => ({ 
      fullTrait: t,
      name: t.name, 
      lastObserved: t.lastObserved, 
      timeDiff: Math.abs(t.lastObserved - evidenceTime),
      weight: t.weight 
    })));
    
    const filtered = traits.filter((trait: Trait) => {
      const timeDiff = Math.abs(trait.lastObserved - evidenceTime);
      const isWithinWindow = timeDiff <= timeWindow;
      console.log(`Trait ${trait.name}: timeDiff=${timeDiff}, withinWindow=${isWithinWindow}`);
      return isWithinWindow;
    }).sort((a: Trait, b: Trait) => b.weight - a.weight);
    
    console.log('Filtered related traits:', filtered.map(t => ({ name: t.name, weight: t.weight })));
    return filtered;
  };

  if (evidenceLoading || traitsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Evidence record not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = getEvidenceIcon(evidence.source);
  const relatedTraits = getRelatedTraits();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Evidence
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Icon className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl">{getEvidenceTitle(evidence)}</CardTitle>
              </div>
              <Badge className={getStatusColor(evidence.traitStatus)}>
                {evidence.traitStatus}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Submitted: {format(new Date(evidence.createdAt), 'MMM d, yyyy')}</span>
              </div>
              
              {evidence.completedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Processed: {format(new Date(evidence.completedAt), 'MMM d, yyyy')}</span>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Processing Status</h4>
                {evidence.traitStatus === 'COMPLETE' && (
                  <p className="text-sm text-green-600">
                    ✓ Trait extraction completed successfully
                  </p>
                )}
                {evidence.traitStatus === 'PROCESSING' && (
                  <p className="text-sm text-yellow-600">
                    ⏳ Currently extracting traits from this evidence
                  </p>
                )}
                {evidence.traitStatus === 'PENDING' && (
                  <p className="text-sm text-blue-600">
                    📋 Queued for trait extraction
                  </p>
                )}
                {evidence.traitStatus === 'ERROR' && (
                  <p className="text-sm text-red-600">
                    ❌ Error occurred during trait extraction
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Traits */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>Extracted Traits</CardTitle>
              </div>
              <CardDescription>
                Skills and competencies identified from this evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evidence.traitStatus !== 'COMPLETE' ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    {evidence.traitStatus === 'PROCESSING' ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Processing evidence to extract traits...</p>
                      </>
                    ) : evidence.traitStatus === 'PENDING' ? (
                      <>
                        <Clock className="h-8 w-8 mx-auto mb-4" />
                        <p>Evidence is queued for processing</p>
                      </>
                    ) : (
                      <>
                        <div className="h-8 w-8 mx-auto mb-4 text-red-400">❌</div>
                        <p>Error occurred during trait extraction</p>
                      </>
                    )}
                  </div>
                </div>
              ) : relatedTraits.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Traits Extracted</h3>
                  <p className="text-gray-500">
                    No specific traits were identified from this evidence, or they may be linked to other evidence.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relatedTraits.map((trait: Trait, index: number) => (
                    <div
                      key={`${trait.trait}-${index}`}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 text-lg">{trait.name}</h4>
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          trait.weight >= 0.8 ? 'bg-green-100 text-green-800' :
                          trait.weight >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {Math.round(trait.weight * 100)}% - {trait.weight >= 0.8 ? 'Clear' : trait.weight >= 0.6 ? 'Likely' : 'Mentioned'}
                        </div>
                      </div>

                      {/* Evidence Snippets */}
                      {trait.evidenceSnippets && trait.evidenceSnippets.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">📝 Evidence from your resume:</h5>
                          <div className="space-y-1">
                            {trait.evidenceSnippets.map((snippet, snippetIndex) => (
                              <div
                                key={snippetIndex}
                                className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded border-l-2 border-blue-300"
                              >
                                "{snippet}"
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                    </div>
                  ))}
                  
                  {/* Debug section - remove this later */}
                  {traits && traits.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900 mb-2">
                        🔍 Debug: Raw Trait Data (first trait)
                      </h4>
                      <pre className="text-xs text-yellow-800 overflow-auto">
                        {JSON.stringify(traits[0], null, 2)}
                      </pre>
                    </div>
                  )}

                  {relatedTraits.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        💡 About Trait Extraction
                      </h4>
                      <p className="text-sm text-blue-800">
                        Traits shown were likely extracted from this evidence based on timing. 
                        The confidence level indicates how strongly the trait was demonstrated in your submitted content.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EvidenceDetailPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <EvidenceDetailPageContent />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}