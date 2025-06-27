import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Upload, Search, Edit, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Learn how to use Idynic effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    1. Feed Your Identity
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Start by adding evidence to build your professional identity:
                  </p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Upload your resume and CV</li>
                    <li>• Add work stories and accomplishments</li>
                    <li>• Include certifications and education</li>
                    <li>• Document project experiences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    2. Analyze Opportunities
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Submit job postings or opportunities to see how you align:
                  </p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Paste job posting URLs or text</li>
                    <li>• Review match percentage and analysis</li>
                    <li>• Identify strengths and gaps</li>
                    <li>• Generate targeted solutions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    3. Refine Solutions
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Improve your generated content through AI conversation:
                  </p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Chat with AI to refine cover letters</li>
                    <li>• Adjust tone and messaging</li>
                    <li>• Focus on specific requirements</li>
                    <li>• Iterate until perfect</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Share className="h-5 w-5" />
                    4. Export & Share
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Use your refined solutions across platforms:
                  </p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Download as cover letter or resume</li>
                    <li>• Export for LinkedIn posts</li>
                    <li>• Create shareable public links</li>
                    <li>• Generate professional presentations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Identity Building</h4>
                  <p className="text-sm text-gray-600">
                    Add diverse evidence regularly. Include quantifiable achievements, 
                    specific examples, and varied experiences to build a rich identity.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Opportunity Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Analyze multiple similar opportunities to identify patterns in 
                    requirements and optimize your positioning strategy.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Solution Refinement</h4>
                  <p className="text-sm text-gray-600">
                    Be specific in your refinement requests. Ask for tone adjustments, 
                    specific examples, or focus on particular requirements.
                  </p>
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