'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Filter,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { AnalyzeOpportunityModal } from '@/components/analyze-opportunity-modal';
import { Header } from '@/components/header';

export default function OpportunitiesPage() {
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['user-opportunities'],
    queryFn: api.opportunities.getUserOpportunities,
  });


  // Note: Identity data could be used for better match calculation in the future
  // const { data: identity } = useQuery({
  //   queryKey: ['identity'],
  //   queryFn: api.identity.getIdentityGraph,
  // });

  // Remove the stupid match percentage calculation


  // Filter opportunities based on status
  const filteredOpportunities = opportunities?.filter(opp => {
    if (statusFilter === 'all') return true;
    
    // Transform COMPLETE analysis status to user tracking status
    let displayStatus = opp.interest?.status || 'interested';
    if (opp.opportunity?.analysisStatus === 'COMPLETE' && !opp.interest?.status) {
      displayStatus = 'interested';
    }
    
    // Map archived status
    if (statusFilter === 'archived' && displayStatus === 'archived') return true;
    
    return displayStatus?.toLowerCase() === statusFilter.toLowerCase();
  }) || [];


  // Stats calculation
  const stats = {
    total: opportunities?.length || 0,
    applied: opportunities?.filter(o => {
      let displayStatus = o.interest?.status || 'interested';
      if (o.opportunity?.analysisStatus === 'COMPLETE' && !o.interest?.status) {
        displayStatus = 'interested';
      }
      return displayStatus === 'applied';
    }).length || 0,
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading opportunities...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
                <p className="mt-1 text-gray-600">Manage and track your opportunities</p>
              </div>
              <Button 
                onClick={() => setShowAnalyzeModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Opportunity
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <div className="flex gap-2 flex-wrap">
                  {[
                    { status: 'all', count: stats.total },
                    { status: 'interested', count: stats.total - stats.applied },
                    { status: 'applied', count: stats.applied },
                    { status: 'archived', count: 0 }
                  ].map(({ status, count }) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize"
                    >
                      {status} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities List */}
          {filteredOpportunities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {opportunities?.length === 0 ? 'No opportunities yet' : 'No opportunities match your filter'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {opportunities?.length === 0 
                    ? 'Start by analyzing job opportunities that interest you'
                    : 'Try adjusting your filter to see more opportunities'
                  }
                </p>
                {opportunities?.length === 0 && (
                  <Button onClick={() => setShowAnalyzeModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Opportunity
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-0.5">
              {filteredOpportunities.map((item) => {
                // Handle nested structure
                const opportunity = item.opportunity || item;
                const analysisData = opportunity.analysisData;
                
                return (
                  <Link key={opportunity.opportunityId} href={`/opportunities/${opportunity.opportunityId}`}>
                    <div className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200 rounded">
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">
                              {analysisData?.basic_info?.job_title || 'Job Title Not Available'}
                            </span>
                            <span className="text-gray-600 mx-2">at</span>
                            <span className="text-gray-900">
                              {analysisData?.basic_info?.company_name || 'Company Not Available'}
                            </span>
                            {analysisData?.basic_info?.location && (
                              <>
                                <span className="text-gray-400 mx-2">•</span>
                                <span className="text-gray-600 text-sm">{analysisData.basic_info.location}</span>
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            {opportunity.createdAt 
                              ? (() => {
                                  try {
                                    return formatDistanceToNow(new Date(opportunity.createdAt)) + ' ago';
                                  } catch {
                                    return 'recently';
                                  }
                                })()
                              : 'recently'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <AnalyzeOpportunityModal 
        open={showAnalyzeModal} 
        onOpenChange={setShowAnalyzeModal} 
      />
    </ProtectedRoute>
  );
}