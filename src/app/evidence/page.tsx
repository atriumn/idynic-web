'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface EvidenceRecord {
  evidenceId: string;
  source: string;
  traitStatus: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'ERROR';
  createdAt: string;
  completedAt?: string;
}

function EvidencePageContent() {
  const { data: evidenceRecords, isLoading, error } = useQuery({
    queryKey: ['evidence'],
    queryFn: api.identity.getEvidence,
  });

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return FileText;
      case 'story':
        return BookOpen;
      default:
        return User;
    }
  };

  const getEvidenceTitle = (record: EvidenceRecord) => {
    if (record.source === 'resume') {
      return 'Resume/CV';
    }
    if (record.source === 'story') {
      return 'Professional Story';
    }
    return `${record.source.charAt(0).toUpperCase() + record.source.slice(1)} Evidence`;
  };

  const getEvidencePreview = (record: EvidenceRecord) => {
    if (record.source === 'resume') {
      return 'Resume content submitted for trait extraction';
    }
    if (record.source === 'story') {
      return 'Professional story submitted for trait extraction';
    }
    return `${record.source} evidence submitted for processing`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Evidence Records</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Evidence Records</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load evidence records. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Records</h1>
        <p className="text-gray-600">View all the evidence you've submitted to build your identity constellation.</p>
      </div>

      {!evidenceRecords || evidenceRecords.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Records</h3>
            <p className="text-gray-500 mb-4">You haven't submitted any evidence yet. Start building your identity by sharing your experiences.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evidenceRecords.map((record: EvidenceRecord) => {
            const Icon = getEvidenceIcon(record.source);
            return (
              <Link key={record.evidenceId} href={`/evidence/${record.evidenceId}`}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {getEvidenceTitle(record)}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(record.traitStatus)}>
                          {record.traitStatus}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(record.createdAt), 'MMM d, yyyy')}
                      {record.completedAt && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Completed: {format(new Date(record.completedAt), 'MMM d, yyyy')})
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                      {getEvidencePreview(record)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EvidencePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <EvidencePageContent />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}