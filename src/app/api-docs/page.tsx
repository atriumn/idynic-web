import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, Code, Key, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function APIDocsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Idynic API
              </CardTitle>
              <CardDescription>
                Programmatic access to identity analysis and solution generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    {process.env.NEXT_PUBLIC_API_BASE_URL || 'https://u8ryhgkdri.execute-api.us-east-1.amazonaws.com'}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Authentication
                  </h3>
                  <p className="text-gray-700 mb-3">
                    All API requests require an API key in the Authorization header:
                  </p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    Authorization: Bearer ak_xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <Link href="/api-keys" className="text-blue-600 hover:text-blue-500">
                      Manage your API keys
                    </Link> in the dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">POST</Badge>
                    <code className="text-sm">/identity/evidence</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Submit evidence to build identity</p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <pre>{`{
  "type": "resume" | "story" | "certification" | "education",
  "content": "string",
  "metadata": {
    "title": "string",
    "description": "string"
  }
}`}</pre>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/identity/graph</code>
                  </div>
                  <p className="text-sm text-gray-600">Retrieve current identity graph and traits</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">POST</Badge>
                    <code className="text-sm">/opportunities/analyze</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Analyze opportunity alignment</p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <pre>{`{
  "source": "url" | "text",
  "content": "string"
}`}</pre>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">POST</Badge>
                    <code className="text-sm">/solutions/generate</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Generate solution for opportunity</p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <pre>{`{
  "opportunityId": "string",
  "type": "cover_letter" | "resume" | "linkedin_post"
}`}</pre>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">POST</Badge>
                    <code className="text-sm">/solutions/{solutionId}/refine</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Refine existing solution</p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <pre>{`{
  "instruction": "string",
  "stream": boolean
}`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rate Limits & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Rate Limits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 100 requests per minute per API key</li>
                    <li>• 1000 requests per hour per API key</li>
                    <li>• Evidence uploads limited to 10MB per request</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Security</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All requests must use HTTPS</li>
                    <li>• API keys expire after 90 days by default</li>
                    <li>• Failed authentication attempts are logged</li>
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