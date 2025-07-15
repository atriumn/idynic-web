import { useState, useCallback } from 'react';
import { mcpClient, ResumeStructureResult } from '@/lib/mcp';

export interface UseResumeStructureReturn {
  // State
  latestStructure: ResumeStructureResult | null;
  allStructures: Partial<ResumeStructureResult>[] | null;
  currentStructure: ResumeStructureResult | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadLatestStructure: () => Promise<void>;
  loadAllStructures: () => Promise<void>;
  loadStructureById: (evidenceId: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

export const useResumeStructure = (): UseResumeStructureReturn => {
  const [latestStructure, setLatestStructure] = useState<ResumeStructureResult | null>(null);
  const [allStructures, setAllStructures] = useState<Partial<ResumeStructureResult>[] | null>(null);
  const [currentStructure, setCurrentStructure] = useState<ResumeStructureResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearData = useCallback(() => {
    setLatestStructure(null);
    setAllStructures(null);
    setCurrentStructure(null);
    setError(null);
  }, []);

  const loadLatestStructure = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mcpClient.getLatestResumeStructure();
      
      if (result.success) {
        setLatestStructure(result.data);
        setCurrentStructure(result.data); // Also set as current
      } else {
        setError(result.error || 'Failed to load latest resume structure');
      }
    } catch (err) {
      console.error('Error loading latest resume structure:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllStructures = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mcpClient.listResumeStructures();
      
      if (result.success) {
        setAllStructures(result.data);
      } else {
        setError(result.error || 'Failed to load resume structures');
      }
    } catch (err) {
      console.error('Error loading all resume structures:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStructureById = useCallback(async (evidenceId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mcpClient.getResumeStructure(evidenceId);
      
      if (result.success) {
        setCurrentStructure(result.data);
      } else {
        setError(result.error || 'Failed to load resume structure');
      }
    } catch (err) {
      console.error('Error loading resume structure by ID:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    latestStructure,
    allStructures,
    currentStructure,
    loading,
    error,
    loadLatestStructure,
    loadAllStructures,
    loadStructureById,
    clearError,
    clearData
  };
};

// Specialized hook for resume analysis workflow
export const useResumeAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = useCallback(async (resumeText: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This is an async tool, so we get a job ID back
      const result = await mcpClient.analyzeResume(resumeText);
      
      if (result.success) {
        setAnalysisResult(result);
        
        // If it's an async job, we could poll for completion
        if (result.data?.jobId) {
          console.log('Resume analysis job started:', result.data.jobId);
          // Optionally implement polling here
        }
      } else {
        setError(result.error || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const status = await mcpClient.getJobStatus(jobId);
      return status;
    } catch (err) {
      console.error('Error polling job status:', err);
      throw err;
    }
  }, []);

  const waitForCompletion = useCallback(async (jobId: string, pollInterval: number = 2000) => {
    setLoading(true);
    
    try {
      const result = await mcpClient.waitForResult(jobId, pollInterval);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      console.error('Error waiting for job completion:', err);
      setError(err instanceof Error ? err.message : 'Job completion error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysisResult,
    loading,
    error,
    analyzeResume,
    pollJobStatus,
    waitForCompletion,
    clearError: () => setError(null)
  };
};