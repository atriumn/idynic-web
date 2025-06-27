import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share, Eye } from 'lucide-react';
import Link from 'next/link';

// This would normally fetch from your API
async function getPublicSolution(solutionId: string) {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${process.env.API_BASE_URL}/v1/solutions/${solutionId}/public`, {
    //   cache: 'no-store' // or appropriate caching strategy
    // });
    // return response.json();
    
    // For now, return mock data
    return {
      solutionId,
      valueProposition: `As a seasoned software engineer with 8+ years of experience in full-stack development, I bring a unique combination of technical expertise and leadership capabilities that align perfectly with your senior developer role.

My proven track record includes:
- Leading cross-functional teams of 5+ developers in agile environments
- Architecting scalable microservices handling 10M+ daily requests
- Reducing deployment times by 75% through CI/CD optimization
- Mentoring junior developers and establishing best practices

I'm particularly excited about this opportunity because it combines my passion for technical innovation with my desire to drive meaningful business impact through technology.`,
      impactHistory: `Key Achievements & Impact:

🚀 Technical Leadership
- Led the migration of a monolithic application to microservices architecture, improving system reliability by 99.9% uptime
- Implemented automated testing strategies that reduced bug reports by 60%
- Designed and built a real-time analytics platform processing 2M+ events/hour

💡 Innovation & Problem Solving
- Developed a machine learning pipeline that improved recommendation accuracy by 35%
- Created a developer productivity tool that reduced onboarding time from 2 weeks to 3 days
- Optimized database queries resulting in 45% performance improvement

👥 Team & Process Improvement
- Established code review practices that improved code quality scores by 40%
- Mentored 12+ junior developers, with 80% receiving promotions within 18 months
- Implemented agile practices that increased team velocity by 30%`,
      title: 'Senior Full-Stack Developer Solution',
      description: 'A comprehensive solution highlighting technical leadership and innovation',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { solutionId: string } }
): Promise<Metadata> {
  const solution = await getPublicSolution(params.solutionId);
  
  if (!solution) {
    return {
      title: 'Solution Not Found - Idynic',
      description: 'The solution you are looking for could not be found.',
    };
  }

  return {
    title: `${solution.title || 'Professional Solution'} - Idynic`,
    description: solution.description || 'A strategic professional solution powered by Idynic',
    openGraph: {
      title: solution.title || 'Professional Solution',
      description: solution.description || 'A strategic professional solution',
      type: 'article',
      publishedTime: solution.createdAt,
      modifiedTime: solution.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: solution.title || 'Professional Solution',
      description: solution.description || 'A strategic professional solution',
    },
  };
}

interface PublicSolutionPageProps {
  params: {
    solutionId: string;
  };
}

export default async function PublicSolutionPage({ params }: PublicSolutionPageProps) {
  const solution = await getPublicSolution(params.solutionId);

  if (!solution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h1>
          <p className="text-gray-600 mb-6">
            The solution you're looking for doesn't exist or is no longer available.
          </p>
          <Link href="/">
            <Button>Go to Idynic</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Idynic
              </Link>
              <p className="text-sm text-gray-600 mt-1">Strategic Identity & Solution Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Public Solution
              </Badge>
              <Link href="/">
                <Button variant="outline">
                  Create Your Own
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {solution.title}
            </h1>
            {solution.description && (
              <p className="text-xl text-gray-600 mb-6">
                {solution.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Created {new Date(solution.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Powered by Idynic</span>
            </div>
          </div>

          {/* Value Proposition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Value Proposition</CardTitle>
              <CardDescription>
                Unique value and strategic positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {solution.valueProposition}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Impact & Achievements</CardTitle>
              <CardDescription>
                Proven track record and key accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {solution.impactHistory}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your Own Strategic Solution
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Build your unique identity, analyze opportunities, and generate compelling solutions 
                powered by AI on the Idynic platform.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8">
                  <Share className="h-4 w-4 mr-2" />
                  Share This Solution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Idynic
            </Link>
            <p className="text-gray-600 mt-2">
              Strategic Identity & Solution Platform
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Build your professional identity and generate compelling solutions with AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}