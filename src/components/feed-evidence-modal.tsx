'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { FileText, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

interface FeedEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const evidenceTypes = [
  {
    id: 'resume',
    title: 'Resume/CV',
    description: 'Share your professional journey and achievements',
    icon: FileText,
    fields: [
      { key: 'resume_text', label: 'Resume Content', type: 'textarea', placeholder: 'Paste your resume content here...' }
    ]
  },
  {
    id: 'story',
    title: 'Share Your Story',
    description: 'Tell personal or professional experiences that reflect who you are',
    icon: BookOpen,
    fields: [
      { key: 'story_title', label: 'Story Title', type: 'text', placeholder: 'A meaningful moment, challenge overcome, or achievement...' },
      { key: 'story_content', label: 'Your Story', type: 'textarea', placeholder: 'Share the experience that shaped you - what happened, how you responded, what you learned, and how it reflects your character and capabilities...' }
    ]
  }
];

const exampleStories = [
  "Last year, our release process was consistently delayed due to manual testing bottlenecks and lack of visibility into quality metrics. I took the initiative to design and implement a lightweight CI pipeline with automated test coverage, error tracking, and Slack notifications. Within two sprints, we cut our regression testing time by over 50% and started shipping weekly instead of bi-weekly. More importantly, it shifted our culture—engineers began owning quality earlier in the cycle, and product started trusting our release timelines again.",
  
  "When our team inherited a legacy system with mounting bug reports and no documentation, I volunteered to lead a stabilization effort. I started by mapping out the architecture through code walkthroughs and setting up basic observability with logs and health checks. Then I organized a bug triage rotation and wrote scripts to reproduce the top issues. Within six weeks, we resolved over 40% of the backlog, reduced incoming bug volume by half, and laid the groundwork for a proper rewrite with confidence and stakeholder buy-in.",
  
  "We were struggling to get alignment between engineering and sales on customer pain points. I proposed a lightweight 'voice of the customer' initiative where I joined a few sales calls each week and summarized technical insights in a shared doc. Over time, this evolved into a monthly cross-functional sync where we prioritized roadmap items based on real feedback. One of the features that emerged from this process ended up driving a 20% increase in renewals the following quarter."
];

export function FeedEvidenceModal({ open, onOpenChange }: FeedEvidenceModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryExamples, setShowStoryExamples] = useState(false);
  const queryClient = useQueryClient();

  // Rotate through example stories every 4 seconds in the story examples modal
  useEffect(() => {
    if (!showStoryExamples) return;
    
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % exampleStories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showStoryExamples]);

  const submitEvidenceMutation = useMutation({
    mutationFn: async (data: { source: string; text: string }) => {
      if (data.source === 'resume') {
        // Send resume text directly to MCP API for trait extraction
        return await api.mcp.extractResumeTraits(data.text);
      } else {
        // For other evidence types, use the traditional backend API
        return await api.identity.submitEvidence(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity'] });
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      onOpenChange(false);
      setSelectedType(null);
      setFormData({});
    },
  });

  const handleSubmit = () => {
    if (!selectedType) return;
    
    let text = '';
    if (selectedType === 'resume') {
      text = formData.resume_text || '';
    } else if (selectedType === 'story') {
      text = `${formData.story_title || ''}\n\n${formData.story_content || ''}`.trim();
    }
    
    submitEvidenceMutation.mutate({
      source: selectedType,
      text: text,
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectedEvidenceType = evidenceTypes.find(type => type.id === selectedType);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grow Your Identity</DialogTitle>
          <DialogDescription>
            Share your experiences and achievements to cultivate your unique identity constellation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedType ? (
            <>
              {/* Story Examples Link */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 group"
                onClick={() => setShowStoryExamples(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Lightbulb className="h-8 w-8 text-amber-600 group-hover:text-amber-700" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-amber-800">Need Inspiration?</h4>
                        <p className="text-sm text-gray-600">View example stories to spark your creativity</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Evidence type selection */}
              <div className="grid grid-cols-1 gap-4">
              {evidenceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id} 
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-200 border-2 hover:border-emerald-200"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <Icon className="h-10 w-10 mr-4 text-emerald-600" />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{type.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
              </div>
            </>
          ) : (
            // Evidence form
            <div>
              <div className="flex items-center gap-2 mb-4">
                {selectedEvidenceType && (
                  <>
                    <selectedEvidenceType.icon className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">{selectedEvidenceType.title}</h3>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                {selectedEvidenceType?.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.key}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedType(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={submitEvidenceMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitEvidenceMutation.isPending ? 'Adding to your identity graph...' : 'Add to Your Identity Graph'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Story Examples Modal */}
    <Dialog open={showStoryExamples} onOpenChange={setShowStoryExamples}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Story Examples Gallery
          </DialogTitle>
          <DialogDescription className="text-base">
            Discover how professionals tell their stories to build compelling identities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rotating Story Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Professional Story Example</h3>
              <div className="flex space-x-1">
                {exampleStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoryIndex(index)}
                    className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                      index === currentStoryIndex ? 'bg-blue-600' : 'bg-blue-300 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="relative min-h-[200px]">
              <p className="text-blue-800 leading-relaxed text-sm lg:text-base transition-all duration-500">
                {exampleStories[currentStoryIndex]}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStoryIndex((prev) => (prev - 1 + exampleStories.length) % exampleStories.length)}
              className="flex items-center gap-2"
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStoryIndex((prev) => (prev + 1) % exampleStories.length)}
              className="flex items-center gap-2"
            >
              Next →
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 mb-2">💡 Story Writing Tips:</h4>
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>• Focus on specific situations and your actions</li>
              <li>• Include measurable outcomes when possible</li>
              <li>• Show growth, learning, or impact</li>
              <li>• Write in first person with confidence</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setShowStoryExamples(false)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Start Writing My Story
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}