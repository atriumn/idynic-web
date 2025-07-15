import { MCPClient } from '@idynic/mcp-client';

// MCP Client configuration that integrates with our existing auth system
const MCP_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

// Create a singleton MCP client that uses JWT tokens from localStorage
class IdynicMCPClient {
  private client: MCPClient;

  constructor() {
    this.client = new MCPClient(`${MCP_BASE_URL}/v1/mcp`, {
      // The token will be dynamically retrieved from localStorage
      token: this.getToken()
    });
  }

  private getToken(): string | undefined {
    // In browser environment, get JWT token from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || undefined;
    }
    return undefined;
  }

  // Update the client's auth token (useful after token refresh)
  updateAuth() {
    this.client.setAuth({
      type: 'jwt',
      token: this.getToken() || ''
    });
  }

  // Clear authentication
  clearAuth() {
    this.client.clearAuth();
  }

  // Wrapper methods for all MCP tools
  async analyzeResume(resumeText: string) {
    this.updateAuth(); // Ensure we have the latest token
    return await this.client.callTool('analyze_resume', {
      resume_text: resumeText
    });
  }

  async extractStoryTraits(storyText: string) {
    this.updateAuth();
    return await this.client.callTool('extract_story_traits', {
      story_text: storyText
    });
  }

  async analyzeJobPosting(jobPostingText: string, jobUrl?: string) {
    this.updateAuth();
    return await this.client.callTool('analyze_job_posting', {
      job_posting_text: jobPostingText,
      job_url: jobUrl || ''
    });
  }

  async generateSolution(opportunityId: string) {
    this.updateAuth();
    return await this.client.callTool('generate_solution', {
      opportunity_id: opportunityId
    });
  }

  async refineSolution(solutionId: string, refinementInstruction: string) {
    this.updateAuth();
    return await this.client.callTool('refine_solution', {
      solution_id: solutionId,
      refinement_instruction: refinementInstruction
    });
  }

  async formatAsResume(solutionId: string) {
    this.updateAuth();
    return await this.client.callTool('format_as_resume', {
      solution_id: solutionId
    });
  }

  async formatAsCoverLetter(solutionId: string) {
    this.updateAuth();
    return await this.client.callTool('format_as_cover_letter', {
      solution_id: solutionId
    });
  }

  // NEW: Resume Structure Tools
  async getLatestResumeStructure() {
    this.updateAuth();
    return await this.client.callTool('get_latest_resume_structure');
  }

  async listResumeStructures() {
    this.updateAuth();
    return await this.client.callTool('list_resume_structures');
  }

  async getResumeStructure(evidenceId: string) {
    this.updateAuth();
    return await this.client.callTool('get_resume_structure', {
      evidence_id: evidenceId
    });
  }

  // Advanced: Generate resume plan
  async generateResumePlan(opportunityId: string, userTraits?: any[]) {
    this.updateAuth();
    return await this.client.callTool('generate_resume_plan', {
      opportunity_id: opportunityId,
      user_traits: userTraits || []
    });
  }

  // Advanced: Match opportunities to experience
  async matchOpportunitiesToExperience(opportunityId: string, userId: string) {
    this.updateAuth();
    return await this.client.callTool('match_opportunities_to_experience', {
      opportunity_id: opportunityId,
      user_id: userId
    });
  }

  // Advanced: Full resume tailoring orchestration
  async tailorFullResumeForOpportunity(baseResume: string, opportunityId: string) {
    this.updateAuth();
    return await this.client.callTool('tailor_full_resume_for_opportunity', {
      base_resume: baseResume,
      opportunity_id: opportunityId
    });
  }

  // Generic tool caller for any future tools
  async callTool(toolName: string, args: Record<string, any> = {}) {
    this.updateAuth();
    return await this.client.callTool(toolName, args);
  }

  // Utility methods
  async getManifest() {
    this.updateAuth();
    return await this.client.getManifest();
  }

  async listTools() {
    this.updateAuth();
    return await this.client.listTools();
  }

  async getJobStatus(jobId: string) {
    this.updateAuth();
    return await this.client.getJobStatus(jobId);
  }

  async waitForResult(jobId: string, pollInterval: number = 1000) {
    this.updateAuth();
    return await this.client.waitForResult(jobId, pollInterval);
  }
}

// Create singleton instance
export const mcpClient = new IdynicMCPClient();

// Export types for TypeScript support
export interface ResumeStructure {
  professional_summary: string;
  work_experiences: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  certifications: Certification[];
  projects: Project[];
}

export interface WorkExperience {
  company: string;
  job_title: string;
  start_date: string;
  end_date: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation_year: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  duration: string;
}

export interface ResumeStructureResult {
  evidence_id: string;
  structure: ResumeStructure;
  extracted_at?: string;
  metadata?: {
    companies: string[];
    job_titles: string[];
    top_skills: string[];
    experience_years: number;
    education_count: number;
    certification_count: number;
    project_count: number;
  };
  source: 'hybrid' | 'legacy';
}