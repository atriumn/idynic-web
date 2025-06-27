import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types based on backend models
export interface Identity {
  userId: string;
  data: Record<string, any>;
  updatedAt: string;
}

export interface BasicInfo {
  job_title: string;
  company_name: string;
  location?: string;
  employment_type?: string;
  department?: string;
  salary_range?: string;
  posted_date?: string;
  application_deadline?: string;
}

export interface SkillRequirement {
  skill_name: string;
  category: string;
  requirement_level: string;
  years_required?: number;
  proficiency_level?: string;
  context?: string;
}

export interface SoftRequirement {
  trait_name: string;
  category: string;
  requirement_level: string;
  context?: string;
}

export interface EducationRequirement {
  level: string;
  field?: string;
  requirement_level: string;
}

export interface CertificationRequirement {
  certification_name: string;
  requirement_level: string;
}

export interface ExperienceRequirement {
  years_total?: number;
  years_relevant?: number;
  industries?: string[];
  roles?: string[];
}

export interface Qualifications {
  education?: EducationRequirement[];
  certifications?: CertificationRequirement[];
  experience?: ExperienceRequirement;
}

export interface CompanyCulture {
  values?: string[];
  work_environment?: string;
  team_size?: string;
  growth_opportunities?: string[];
}

export interface OpportunitySummary {
  total_required_skills: number;
  total_preferred_skills: number;
  seniority_level: string;
  primary_focus_areas: string[];
  key_technologies: string[];
}

export interface OpportunityAnalysis {
  basic_info: BasicInfo;
  required_skills: SkillRequirement[];
  soft_requirements: SoftRequirement[];
  responsibilities: string[];
  qualifications: Qualifications;
  benefits: string[];
  company_culture: CompanyCulture;
  summary: OpportunitySummary;
}

export interface Opportunity {
  opportunityId: string;
  opportunityUrl?: string;
  contentHash: string;
  contentKey?: string;
  analysisData: OpportunityAnalysis;
  analysisStatus: string;
  createdAt: string;
  lastAnalyzed: string;
}

export interface UserOpportunityInterest {
  userId: string;
  opportunityId: string;
  interestedAt: string;
  status: string;
  isAutoInferred: boolean;
  notes?: string;
}

export interface Solution {
  solutionId: string;
  userId: string;
  opportunityId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSolution {
  solutionId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateOpportunityRequest {
  opportunity_url?: string;
  opportunity_text: string;
}

export interface CreateOpportunityResponse {
  opportunityId: string;
  opportunityAnalysis: OpportunityAnalysis;
  userInterest: UserOpportunityInterest;
  isNewOpportunity: boolean;
}

export interface CreateSolutionRequest {
  opportunityId: string;
  valueProposition: string;
  impactHistory: string;
  title?: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateSolutionRequest {
  valueProposition?: string;
  impactHistory?: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface GenerateSolutionRequest {
  opportunityId: string;
}

export interface RefineSolutionRequest {
  solutionId: string;
  refinementInstruction: string;
}

export interface FormatSolutionRequest {
  solutionId: string;
}

export interface FormatSolutionResponse {
  solutionId: string;
  formatType: string;
  formattedContent: string;
  generatedAt: string;
}

export interface EvidenceSubmissionRequest {
  evidence_type: string;
  evidence_data: Record<string, any>;
}

// API Functions
export const api = {

  // Identity Management
  identity: {
    getIdentityGraph: async (): Promise<Identity> => {
      const response = await apiClient.get('/v1/user/identity-graph');
      return response.data;
    },
    submitEvidence: async (evidence: EvidenceSubmissionRequest): Promise<void> => {
      await apiClient.post('/v1/evidence', evidence);
    },
  },

  // Opportunity Management
  opportunities: {
    analyzeOpportunity: async (data: CreateOpportunityRequest): Promise<CreateOpportunityResponse> => {
      const response = await apiClient.post('/v1/opportunities', data);
      return response.data;
    },
    getOpportunity: async (opportunityId: string): Promise<Opportunity> => {
      const response = await apiClient.get(`/v1/opportunities/${opportunityId}`);
      return response.data;
    },
    getUserOpportunities: async (): Promise<Opportunity[]> => {
      const response = await apiClient.get('/v1/user/opportunities');
      return response.data;
    },
  },

  // Solution Management
  solutions: {
    generateSolution: async (data: GenerateSolutionRequest): Promise<Solution> => {
      const response = await apiClient.post('/v1/solutions/generate', data);
      return response.data;
    },
    getSolution: async (solutionId: string): Promise<Solution> => {
      const response = await apiClient.get(`/v1/solutions/${solutionId}`);
      return response.data;
    },
    updateSolution: async (solutionId: string, data: UpdateSolutionRequest): Promise<Solution> => {
      const response = await apiClient.put(`/v1/solutions/${solutionId}`, data);
      return response.data;
    },
    getUserSolutions: async (): Promise<Solution[]> => {
      const response = await apiClient.get('/v1/user/solutions');
      return response.data;
    },
    getPublicSolution: async (solutionId: string): Promise<PublicSolution> => {
      const response = await apiClient.get(`/v1/solutions/${solutionId}/public`);
      return response.data;
    },
    formatSolution: async (solutionId: string, formatType: string): Promise<FormatSolutionResponse> => {
      const response = await apiClient.post(`/v1/solutions/${solutionId}/format`, { format_type: formatType });
      return response.data;
    },
    refineSolution: async (data: RefineSolutionRequest): Promise<void> => {
      await apiClient.post('/v1/solutions/refine', data);
    },
  },

  // MCP Tools (for the Generate, Review, Refine flow)
  mcp: {
    analyzeOpportunity: async (opportunityText: string): Promise<any> => {
      const response = await apiClient.post('/mcp/tools/analyze_opportunity', {
        tool_name: 'analyze_opportunity',
        arguments: { opportunity_text: opportunityText }
      });
      return response.data;
    },
    generateSolution: async (opportunityId: string): Promise<any> => {
      const response = await apiClient.post('/mcp/tools/generate_solution', {
        tool_name: 'generate_solution',
        arguments: { opportunity_id: opportunityId }
      });
      return response.data;
    },
    refineSolution: async (solutionId: string, refinementInstruction: string): Promise<any> => {
      const response = await apiClient.post('/mcp/tools/refine_solution', {
        tool_name: 'refine_solution',
        arguments: { 
          solution_id: solutionId,
          refinement_instruction: refinementInstruction 
        }
      });
      return response.data;
    },
    formatAsCoverLetter: async (solutionId: string): Promise<FormatSolutionResponse> => {
      const response = await apiClient.post('/mcp/tools/format_as_cover_letter', {
        tool_name: 'format_as_cover_letter',
        arguments: { solution_id: solutionId }
      });
      return response.data;
    },
    formatAsResume: async (solutionId: string): Promise<FormatSolutionResponse> => {
      const response = await apiClient.post('/mcp/tools/format_as_resume', {
        tool_name: 'format_as_resume',
        arguments: { solution_id: solutionId }
      });
      return response.data;
    },
    formatAsLinkedInPost: async (solutionId: string): Promise<FormatSolutionResponse> => {
      const response = await apiClient.post('/mcp/tools/format_as_linkedin_post', {
        tool_name: 'format_as_linkedin_post',
        arguments: { solution_id: solutionId }
      });
      return response.data;
    },
  },
};

export default api;