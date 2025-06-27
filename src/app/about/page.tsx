import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">What is Idynic?</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Identity & Solution Platform</CardTitle>
              <CardDescription>
                Idynic helps you build, track, and leverage your professional identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">The Generate, Review, Refine Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🌱</div>
                    <h4 className="font-medium mb-2">Generate</h4>
                    <p className="text-sm text-gray-600">
                      Build your identity by feeding evidence: resumes, stories, certifications, and experiences
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-medium mb-2">Review</h4>
                    <p className="text-sm text-gray-600">
                      Analyze opportunities and see how your identity aligns with specific roles or challenges
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">✨</div>
                    <h4 className="font-medium mb-2">Refine</h4>
                    <p className="text-sm text-gray-600">
                      Generate targeted solutions and refine them through AI-powered conversations
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Identity Dashboard:</strong> Track your professional identity development</li>
                  <li>• <strong>Evidence Collection:</strong> Upload and organize your professional artifacts</li>
                  <li>• <strong>Opportunity Analysis:</strong> Match your profile against job postings and challenges</li>
                  <li>• <strong>Solution Generation:</strong> Create targeted cover letters, proposals, and presentations</li>
                  <li>• <strong>AI Refinement:</strong> Iteratively improve your solutions through conversation</li>
                  <li>• <strong>Export & Share:</strong> Generate professional documents and shareable links</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}