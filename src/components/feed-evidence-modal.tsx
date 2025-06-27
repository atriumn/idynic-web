'use client';

import { useState } from 'react';
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
import { FileText, Briefcase, Award, GraduationCap } from 'lucide-react';

interface FeedEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const evidenceTypes = [
  {
    id: 'resume',
    title: 'Resume/CV',
    description: 'Upload your resume or CV to extract skills and experience',
    icon: FileText,
    fields: [
      { key: 'resume_text', label: 'Resume Content', type: 'textarea', placeholder: 'Paste your resume content here...' }
    ]
  },
  {
    id: 'job_experience',
    title: 'Job Experience',
    description: 'Add specific work experience and achievements',
    icon: Briefcase,
    fields: [
      { key: 'job_title', label: 'Job Title', type: 'text', placeholder: 'Senior Software Engineer' },
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Company Name' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: '2020-2023' },
      { key: 'achievements', label: 'Key Achievements', type: 'textarea', placeholder: 'Describe your key achievements...' }
    ]
  },
  {
    id: 'certification',
    title: 'Certification',
    description: 'Add professional certifications and qualifications',
    icon: Award,
    fields: [
      { key: 'certification_name', label: 'Certification Name', type: 'text', placeholder: 'AWS Certified Solutions Architect' },
      { key: 'issuing_organization', label: 'Issuing Organization', type: 'text', placeholder: 'Amazon Web Services' },
      { key: 'issue_date', label: 'Issue Date', type: 'text', placeholder: '2023-01' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe what this certification demonstrates...' }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Add educational background and academic achievements',
    icon: GraduationCap,
    fields: [
      { key: 'degree', label: 'Degree', type: 'text', placeholder: 'Bachelor of Science in Computer Science' },
      { key: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' },
      { key: 'graduation_year', label: 'Graduation Year', type: 'text', placeholder: '2020' },
      { key: 'achievements', label: 'Notable Achievements', type: 'textarea', placeholder: 'Dean\'s list, relevant coursework, projects...' }
    ]
  }
];

export function FeedEvidenceModal({ open, onOpenChange }: FeedEvidenceModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const submitEvidenceMutation = useMutation({
    mutationFn: (data: { evidence_type: string; evidence_data: Record<string, any> }) =>
      api.identity.submitEvidence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity'] });
      onOpenChange(false);
      setSelectedType(null);
      setFormData({});
    },
  });

  const handleSubmit = () => {
    if (!selectedType) return;
    
    submitEvidenceMutation.mutate({
      evidence_type: selectedType,
      evidence_data: formData,
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectedEvidenceType = evidenceTypes.find(type => type.id === selectedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Feed Your Identity</DialogTitle>
          <DialogDescription>
            Add evidence to strengthen your strategic identity profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedType ? (
            // Evidence type selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader className="text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
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
                  className="flex-1"
                >
                  {submitEvidenceMutation.isPending ? 'Submitting...' : 'Submit Evidence'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}