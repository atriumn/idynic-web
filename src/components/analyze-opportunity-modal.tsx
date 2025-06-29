'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, FileText, Target, Zap } from 'lucide-react';

interface AnalyzeOpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalyzeOpportunityModal({ open, onOpenChange }: AnalyzeOpportunityModalProps) {
  const [inputMethod, setInputMethod] = useState<'url' | 'text' | null>(null);
  const [opportunityUrl, setOpportunityUrl] = useState('');
  const [opportunityText, setOpportunityText] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const analyzeOpportunityMutation = useMutation({
    mutationFn: async (data: { opportunity_url?: string; opportunity_text: string }) => {
      console.log('🚀 Starting MCP analyze_job_posting call with data:', data);
      
      try {
        // Call MCP analyze_job_posting tool which creates persistent opportunity
        const mcpResponse = await api.mcp.analyzeJobPosting(data.opportunity_text, data.opportunity_url);
        console.log('✅ MCP Response received:', mcpResponse);
        
        // Extract opportunity ID from MCP response text
        // Response format: "Job posting analyzed! Opportunity ID: {opportunityId}"
        let opportunityId = null;
        if (mcpResponse?.content?.[0]?.text) {
          console.log('📝 MCP Response text:', mcpResponse.content[0].text);
          const match = mcpResponse.content[0].text.match(/Opportunity ID: (\S+)/);
          opportunityId = match ? match[1] : null;
          console.log('🔍 Extracted opportunity ID:', opportunityId);
        } else {
          console.log('❌ No content found in MCP response');
        }
        
        return { mcpResponse, opportunityId };
      } catch (error) {
        console.error('💥 MCP API call failed:', error);
        throw error;
      }
    },
    onSuccess: ({ opportunityId, mcpResponse }) => {
      console.log('🎉 Mutation success with opportunityId:', opportunityId);
      console.log('📊 Full MCP response:', mcpResponse);
      
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onOpenChange(false);
      
      // Navigate to the created opportunity
      if (opportunityId && opportunityId !== 'unknown') {
        console.log('🧭 Navigating to opportunity:', `/opportunities/${opportunityId}`);
        router.push(`/opportunities/${opportunityId}`);
      } else {
        console.log('🧭 Fallback navigation to opportunities list');
        router.push('/opportunities');
      }
      
      // Reset form
      setInputMethod(null);
      setOpportunityUrl('');
      setOpportunityText('');
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    },
  });

  const handleSubmit = () => {
    if (!opportunityText && !opportunityUrl) return;
    
    analyzeOpportunityMutation.mutate({
      opportunity_url: opportunityUrl || undefined,
      opportunity_text: opportunityText,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Discover Your Opportunity Match
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            Analyze how this opportunity aligns with your unique constellation of traits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!inputMethod ? (
            // Input method selection with different styling
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to add this opportunity?</h3>
                <p className="text-sm text-gray-600">Choose the method that works best for you</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className="group p-4 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                      <Link2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-500">Smart URL Analysis (Coming Soon)</h4>
                      <p className="text-sm text-gray-400">Paste a job posting URL and we&apos;ll extract all the details automatically</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="group cursor-pointer p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
                  onClick={() => setInputMethod('text')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-700">Direct Text Input</h4>
                      <p className="text-sm text-gray-600">Copy and paste the job description text directly for analysis</p>
                    </div>
                    <Zap className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Input form
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {inputMethod === 'url' ? (
                  <>
                    <Link2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Add from URL</h3>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Paste Job Description</h3>
                  </>
                )}
              </div>

              {inputMethod === 'url' && (
                <div className="space-y-2">
                  <Label htmlFor="url">Job Posting URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://company.com/jobs/position"
                    value={opportunityUrl}
                    onChange={(e) => setOpportunityUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-600">
                    We'll fetch and analyze the job posting automatically
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="text">
                  {inputMethod === 'url' ? 'Or paste the job description' : 'Job Description'}
                </Label>
                <textarea
                  id="text"
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste the full job description here..."
                  value={opportunityText}
                  onChange={(e) => setOpportunityText(e.target.value)}
                />
              </div>

              {analyzeOpportunityMutation.error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    Failed to analyze opportunity
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your connection and try again. If the problem persists, verify the job posting format.
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setInputMethod(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={analyzeOpportunityMutation.isPending || (!opportunityText && !opportunityUrl)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {analyzeOpportunityMutation.isPending ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing opportunity...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Analyze & Add Opportunity
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}