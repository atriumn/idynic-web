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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, FileText } from 'lucide-react';

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
    mutationFn: (data: { opportunity_url?: string; opportunity_text: string }) =>
      api.opportunities.analyzeOpportunity(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onOpenChange(false);
      router.push(`/opportunities/${response.opportunityId}`);
      // Reset form
      setInputMethod(null);
      setOpportunityUrl('');
      setOpportunityText('');
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
        <DialogHeader>
          <DialogTitle>Analyze an Opportunity</DialogTitle>
          <DialogDescription>
            Add a job posting or opportunity to see how it aligns with your profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!inputMethod ? (
            // Input method selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setInputMethod('url')}
              >
                <CardHeader className="text-center">
                  <Link2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">From URL</CardTitle>
                  <CardDescription className="text-sm">
                    Paste a job posting URL and we'll extract the details
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setInputMethod('text')}
              >
                <CardHeader className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">Paste Text</CardTitle>
                  <CardDescription className="text-sm">
                    Copy and paste the job description directly
                  </CardDescription>
                </CardHeader>
              </Card>
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
                <div className="text-sm text-red-600">
                  Failed to analyze opportunity. Please try again.
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
                  className="flex-1"
                >
                  {analyzeOpportunityMutation.isPending ? 'Analyzing...' : 'Analyze Opportunity'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}