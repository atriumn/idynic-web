'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Database, Users, Target, Layers, HelpCircle } from 'lucide-react';

function VectorStatsContent() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['vector-stats'],
    queryFn: api.identity.getVectorStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load vector statistics. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Defensive data extraction with defaults
  const userVectorCount = stats?.user?.vector_count || 0;
  const totalVectors = stats?.global?.total_vectors || 0;
  const totalUsers = stats?.global?.total_users || 0;
  const embeddingDim = stats?.global?.embedding_dim || 1536;
  const indexName = stats?.global?.index_name || 'Unknown';
  const userId = stats?.user?.user_id || stats?.filtered_for || 'Unknown';

  const userPercentage = (totalVectors > 0 && userVectorCount >= 0)
    ? ((userVectorCount / totalVectors) * 100).toFixed(1)
    : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vector Statistics</h1>
        <p className="text-gray-600">
          Your embedding vectors and global statistics for the AI knowledge base.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* User Vector Count */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium text-blue-800">Your Vectors</CardTitle>
              <HelpCircle 
                className="h-3 w-3 text-blue-500 cursor-help" 
                title="Think of this as your digital fingerprint count. Each piece of your professional experience (skills, jobs, achievements) gets converted into a mathematical 'vector' that AI can understand and compare. More vectors = richer profile for better job matching!"
              />
            </div>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{userVectorCount.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">
              {userPercentage}% of total vectors
            </p>
            <p className="text-xs text-blue-500 mt-2 italic">
              Your unique professional data points
            </p>
          </CardContent>
        </Card>

        {/* Total Vectors */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Vectors</CardTitle>
              <HelpCircle 
                className="h-3 w-3 text-green-500 cursor-help" 
                title="This is the size of our entire AI knowledge base - all professional experiences from every user combined. Like a massive library of career data that helps the AI understand what skills and experiences exist in the job market."
              />
            </div>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalVectors.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">
              Across all users
            </p>
            <p className="text-xs text-green-500 mt-2 italic">
              The collective knowledge base size
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium text-purple-800">Active Users</CardTitle>
              <HelpCircle 
                className="h-3 w-3 text-purple-500 cursor-help" 
                title="These are the number of people who have shared their professional data with our AI system. More users means better job matching because the AI learns from a more diverse pool of career experiences and can make smarter recommendations."
              />
            </div>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totalUsers}</div>
            <p className="text-xs text-purple-600 mt-1">
              Contributing vectors
            </p>
            <p className="text-xs text-purple-500 mt-2 italic">
              Our community of professionals
            </p>
          </CardContent>
        </Card>

        {/* Embedding Dimensions */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium text-orange-800">Dimensions</CardTitle>
              <HelpCircle 
                className="h-3 w-3 text-orange-500 cursor-help" 
                title="Think of this like the 'resolution' of our AI's understanding. Each vector has 1,536 numbers that capture different aspects of your professional identity. Higher dimensions = more nuanced understanding of your skills and experiences. It's like having HD vision for career matching!"
              />
            </div>
            <Layers className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{embeddingDim}</div>
            <p className="text-xs text-orange-600 mt-1">
              Vector dimensions
            </p>
            <p className="text-xs text-orange-500 mt-2 italic">
              AI's "resolution" for understanding you
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Your Contribution
            </CardTitle>
            <CardDescription>
              Your vectors in the AI knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User ID</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {userId}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vector Count</span>
              <span className="text-lg font-semibold">{userVectorCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Share of Total</span>
              <span className="text-lg font-semibold text-blue-600">{userPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(Math.max(parseFloat(userPercentage) || 0, 0), 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              System Information
            </CardTitle>
            <CardDescription>
              AI knowledge base configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Index Name</span>
              <Badge variant="outline" className="font-mono text-xs">
                {indexName}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Embedding Model</span>
              <span className="text-sm text-gray-600">OpenAI Ada v2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vector Dimensions</span>
              <span className="text-lg font-semibold">{embeddingDim}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Vectors</span>
              <span className="text-lg font-semibold">{totalVectors.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-lg font-semibold">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mt-6 space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-3">What Are Vector Embeddings? 🤔</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Simple explanation:</strong> Imagine if your entire professional identity could be described by {embeddingDim} numbers, 
                    like coordinates on a super-detailed map. Each number captures a different aspect of who you are professionally - 
                    your skills, experiences, personality traits, and career goals.
                  </p>
                  <p>
                    <strong>Why this matters:</strong> When you submit a resume or describe your experience, our AI converts that information 
                    into these mathematical "vectors." This lets the AI compare you to job opportunities in ways that go far beyond 
                    keyword matching - it understands the deeper meaning and relationships in your career data.
                  </p>
                  <p>
                    <strong>The magic:</strong> Similar professionals end up with similar vector patterns, even if they use different words 
                    to describe their experience. This means better job matching, more relevant opportunities, and AI that truly "gets" 
                    your professional identity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-green-900 mb-3">Why These Numbers Matter for Your Career 🎯</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Better Job Matching</h5>
                    <p>More vectors from your profile = more data points for the AI to find jobs that truly fit your unique combination of skills and experience.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Smarter Recommendations</h5>
                    <p>The larger our database (total vectors), the better the AI becomes at understanding career patterns and suggesting relevant opportunities.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Community Learning</h5>
                    <p>Each user's data helps improve matching for everyone - it's like a collective intelligence that gets smarter over time.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Precision Matching</h5>
                    <p>Those {embeddingDim} dimensions allow for incredibly nuanced understanding - catching subtle connections that traditional job search misses.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VectorStatsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <VectorStatsContent />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}