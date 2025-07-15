'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { 
  Wrench,
  Download,
  Terminal,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { ClaudeIcon, ChromeIcon, LinkedInIcon, GitHubIcon } from '@/components/brand-icons';
import Link from 'next/link';

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tools & Integrations</h1>
                  <p className="text-gray-600">Extend Idynic with powerful integrations and tools</p>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Claude Desktop MCP */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                      <ClaudeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Claude Desktop MCP</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Connect your Idynic profile directly to Claude Desktop for seamless AI-powered career assistance.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Access your traits and opportunities in Claude
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Generate tailored resumes and cover letters
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Analyze job postings with your profile
                  </div>
                </div>
                
                <Link href="/tools/claude-mcp">
                  <Button className="w-full">
                    <ClaudeIcon className="h-4 w-4 mr-2" />
                    Setup Guide
                  </Button>
                </Link>
              </div>

              {/* Chrome Extension */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                      <ChromeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Chrome Extension</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Analyze job postings directly from LinkedIn, Indeed, and other job boards with one click.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    One-click job analysis from any job board
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Save opportunities directly to Idynic
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Real-time trait gap analysis
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" disabled>
                  <ChromeIcon className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>

              {/* CLI Tool */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Terminal className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">CLI Tool</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Command-line interface for developers to integrate Idynic into their workflow and automation.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Bulk upload experiences and projects
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Export traits and opportunities as JSON
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Automate resume generation
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" disabled>
                  <Terminal className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>

              {/* LinkedIn Integration */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <LinkedInIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">LinkedIn Integration</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Auto-sync your LinkedIn profile data and analyze your professional network for opportunities.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Sync work history and education
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Import trait endorsements and recommendations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Network analysis for referral opportunities
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" disabled>
                  <LinkedInIcon className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>

              {/* GitHub Integration */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <GitHubIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">GitHub Integration</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Automatically extract technical traits from your repositories and contribution history.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    Parse languages, frameworks, and tools
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    Analyze contribution patterns and ownership
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    Extract documentation and communication traits
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" disabled>
                  <GitHubIcon className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>

              {/* Company Research */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Company Research</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Auto-populate detailed company intelligence when analyzing opportunities.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Funding status, size, and growth metrics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Key stakeholders and decision makers
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Recent news and pain points
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </div>

            {/* Developer Resources */}
            <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Developer Resources</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Build your own integrations and tools using the Idynic API.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/docs" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">API Documentation</div>
                  <div className="text-sm text-gray-600">Complete API reference and guides</div>
                </Link>
                
                <a href="https://github.com/idynic" target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                    <GitHubIcon className="h-4 w-4" />
                    GitHub Repository
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <div className="text-sm text-gray-600">Open source tools and examples</div>
                </a>
                
                <Link href="/api-keys" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">API Keys</div>
                  <div className="text-sm text-gray-600">Generate keys for your integrations</div>
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}