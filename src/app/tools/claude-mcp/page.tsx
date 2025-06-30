'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { 
  Download,
  ExternalLink,
  Copy,
  CheckCircle,
  ArrowLeft,
  Github,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ClaudeMCPPage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const configJson = `{
  "mcpServers": {
    "idynic": {
      "command": "npx",
      "args": ["@idynic/mcp-server"],
      "env": {
        "IDYNIC_API_KEY": "your_api_key_here"
      }
    }
  }
}`;

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="relative bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Back Button */}
            <Link href="/tools" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Claude Desktop MCP Integration</h1>
                  <p className="text-gray-600">Connect your Idynic profile to Claude Desktop</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">What you'll get</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Access your skills and opportunities directly in Claude</li>
                      <li>• Generate tailored resumes and cover letters</li>
                      <li>• Analyze job postings with your personal profile</li>
                      <li>• Get AI-powered career advice based on your data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <span className="text-gray-700">Claude Desktop app installed</span>
                  <a 
                    href="https://claude.ai/download" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    Download <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <span className="text-gray-700">Node.js 18+ installed</span>
                  <a 
                    href="https://nodejs.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    Download <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <span className="text-gray-700">Idynic API key</span>
                  <Link 
                    href="/api-keys"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    Generate key
                  </Link>
                </div>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Installation Steps</h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <h3 className="font-semibold text-gray-900">Install the Idynic MCP Server</h3>
                  </div>
                  <p className="text-gray-600 mb-3">Install the MCP server package globally using npm:</p>
                  <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                    <code className="text-green-400 font-mono text-sm">npm install -g @idynic/mcp-server</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('npm install -g @idynic/mcp-server', 1)}
                      className="ml-2"
                    >
                      {copiedStep === 1 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <h3 className="font-semibold text-gray-900">Configure Claude Desktop</h3>
                  </div>
                  <p className="text-gray-600 mb-3">Add the following configuration to your Claude Desktop config file:</p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>macOS:</strong> <code className="bg-gray-100 px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Windows:</strong> <code className="bg-gray-100 px-1 rounded">%APPDATA%/Claude/claude_desktop_config.json</code>
                    </p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <pre className="text-green-400 font-mono text-sm overflow-x-auto flex-1">
                        <code>{configJson}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(configJson, 2)}
                        className="ml-2 flex-shrink-0"
                      >
                        {copiedStep === 2 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Replace <code>your_api_key_here</code> with your actual Idynic API key.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    <h3 className="font-semibold text-gray-900">Restart Claude Desktop</h3>
                  </div>
                  <p className="text-gray-600">Close and restart Claude Desktop to load the new configuration.</p>
                </div>

                {/* Step 4 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                    <h3 className="font-semibold text-gray-900">Test the Integration</h3>
                  </div>
                  <p className="text-gray-600 mb-3">Try asking Claude about your profile:</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 font-mono text-sm">
                      "What are my top skills according to my Idynic profile?"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">MCP server not found</h3>
                  <p className="text-sm text-gray-600">
                    Ensure Node.js is in your PATH and the package was installed globally. Try running <code className="bg-gray-100 px-1 rounded">which idynic-mcp</code> to verify installation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Authentication errors</h3>
                  <p className="text-sm text-gray-600">
                    Double-check your API key is correct and has the necessary permissions. You can test it directly in the API Keys page.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Claude doesn't recognize the integration</h3>
                  <p className="text-sm text-gray-600">
                    Make sure you've restarted Claude Desktop after adding the configuration. Check that the JSON syntax is valid.
                  </p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="https://github.com/idynic/mcp-server" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Github className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">GitHub Repository</div>
                    <div className="text-sm text-gray-600">Source code and advanced configuration</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                
                <a 
                  href="https://www.youtube.com/watch?v=example" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Play className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Video Tutorial</div>
                    <div className="text-sm text-gray-600">Step-by-step installation guide</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}