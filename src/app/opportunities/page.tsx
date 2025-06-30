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
import { Footer } from '@/components/footer';

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
      <div className="min-h-screen">
        <Header />
        
        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total - stats.applied}</div>
                    <div className="text-sm text-gray-600">Interested</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">👀</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.applied}</div>
                    <div className="text-sm text-gray-600">Applied</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Archived</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">📁</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
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
            </div>

            {/* Opportunities List */}
            {filteredOpportunities.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-6">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {opportunities?.length === 0 ? 'No opportunities yet' : 'No opportunities match your filter'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {opportunities?.length === 0 
                    ? 'Start tracking opportunities that interest you'
                    : 'Try adjusting your filter to see more opportunities'
                  }
                </p>
                {opportunities?.length === 0 && (
                  <Button onClick={() => setShowAnalyzeModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Opportunity
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredOpportunities.map((item) => {
                    // Handle nested structure
                    const opportunity = item.opportunity || item;
                    const analysisData = opportunity.analysisData;
                    
                    return (
                      <Link key={opportunity.opportunityId} href={`/opportunities/${opportunity.opportunityId}`}>
                        <div className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-lg">
                                {analysisData?.basic_info?.job_title || 'Job Title Not Available'}
                              </div>
                              <div className="text-gray-600 mt-1">
                                {analysisData?.basic_info?.company_name || 'Company Not Available'}
                                {analysisData?.basic_info?.location && (
                                  <span className="text-gray-400"> • {analysisData.basic_info.location}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Add Opportunity Modal */}
      <AnalyzeOpportunityModal 
        open={showAnalyzeModal} 
        onOpenChange={setShowAnalyzeModal} 
      />
    </ProtectedRoute>
  );
}