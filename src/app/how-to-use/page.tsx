import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">How to Use Idynic</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Get up and running with Idynic in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Step 1: Build Your Identity Foundation</h3>
                  <p className="text-gray-700 mb-3">
                    Start by clicking "Feed Identity" and upload your professional artifacts:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ Upload your current resume</li>
                    <li>✓ Add 2-3 compelling work stories</li>
                    <li>✓ Include key certifications</li>
                    <li>✓ Document major achievements</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">
                    Watch your identity depth grow from "Emerging" to "Developing" and beyond.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Step 2: Find Your First Opportunity</h3>
                  <p className="text-gray-700 mb-3">
                    Click "Analyze Opportunity" and paste a job posting you're interested in:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ Copy/paste the job description</li>
                    <li>✓ Or provide the job posting URL</li>
                    <li>✓ Review your alignment score</li>
                    <li>✓ Identify your strengths and gaps</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Step 3: Generate Your Solution</h3>
                  <p className="text-gray-700 mb-3">
                    Create a targeted cover letter or resume for the opportunity:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ Choose solution type (cover letter, resume, etc.)</li>
                    <li>✓ Review the AI-generated content</li>
                    <li>✓ Use chat to refine and improve</li>
                    <li>✓ Export when you're satisfied</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Step 4: Refine and Perfect</h3>
                  <p className="text-gray-700 mb-3">
                    Use the AI chat to iteratively improve your solution:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ "Make this more technical"</li>
                    <li>✓ "Focus on leadership experience"</li>
                    <li>✓ "Adjust tone to be more formal"</li>
                    <li>✓ "Add specific metrics"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Identity Building</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Add evidence regularly, not all at once</li>
                    <li>• Include diverse types: technical, leadership, creative</li>
                    <li>• Use specific, quantifiable examples</li>
                    <li>• Update as you gain new experiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Solution Quality</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Be specific in refinement requests</li>
                    <li>• Ask for multiple versions to compare</li>
                    <li>• Test different tones and approaches</li>
                    <li>• Export and save multiple variants</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}