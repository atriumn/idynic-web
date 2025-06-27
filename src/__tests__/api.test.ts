// Mock the entire API module
jest.mock('@/lib/api', () => ({
  api: {
    identity: {
      getIdentityGraph: jest.fn(),
      submitEvidence: jest.fn(),
    },
    opportunities: {
      getUserOpportunities: jest.fn(),
      analyzeOpportunity: jest.fn(),
      getOpportunity: jest.fn(),
    },
    solutions: {
      getUserSolutions: jest.fn(),
      generateSolution: jest.fn(),
      getSolution: jest.fn(),
      publishSolution: jest.fn(),
      exportSolution: jest.fn(),
    },
  },
}))

import { api } from '@/lib/api'
const mockedApi = api as jest.Mocked<typeof api>

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Identity API', () => {
    it('should get identity graph', async () => {
      const mockIdentity = {
        evidence_count: 5,
        data: { traits: ['leadership', 'technical'] }
      }
      mockedApi.identity.getIdentityGraph.mockResolvedValueOnce(mockIdentity)

      const result = await api.identity.getIdentityGraph()

      expect(mockedApi.identity.getIdentityGraph).toHaveBeenCalled()
      expect(result).toEqual(mockIdentity)
    })

    it('should submit evidence', async () => {
      const evidenceData = {
        type: 'resume' as const,
        content: 'Resume content',
        metadata: { title: 'My Resume' }
      }
      const mockResponse = { evidence_id: 'ev123' }
      mockedApi.identity.submitEvidence.mockResolvedValueOnce(mockResponse)

      const result = await api.identity.submitEvidence(evidenceData)

      expect(mockedApi.identity.submitEvidence).toHaveBeenCalledWith(evidenceData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Opportunities API', () => {
    it('should get user opportunities', async () => {
      const mockOpportunities = [
        {
          opportunityId: 'opp1',
          analysisData: {
            basic_info: {
              job_title: 'Software Engineer',
              company_name: 'Tech Corp'
            }
          },
          analysisStatus: 'COMPLETE'
        }
      ]
      mockedApi.opportunities.getUserOpportunities.mockResolvedValueOnce(mockOpportunities)

      const result = await api.opportunities.getUserOpportunities()

      expect(mockedApi.opportunities.getUserOpportunities).toHaveBeenCalled()
      expect(result).toEqual(mockOpportunities)
    })

    it('should analyze opportunity', async () => {
      const opportunityData = {
        source: 'url' as const,
        content: 'https://example.com/job'
      }
      const mockResponse = { opportunity_id: 'opp123', analysis_status: 'PENDING' }
      mockedApi.opportunities.analyzeOpportunity.mockResolvedValueOnce(mockResponse)

      const result = await api.opportunities.analyzeOpportunity(opportunityData)

      expect(mockedApi.opportunities.analyzeOpportunity).toHaveBeenCalledWith(opportunityData)
      expect(result).toEqual(mockResponse)
    })

    it('should get opportunity by id', async () => {
      const mockOpportunity = {
        opportunityId: 'opp123',
        analysisData: { basic_info: { job_title: 'Engineer' } }
      }
      mockedApi.opportunities.getOpportunity.mockResolvedValueOnce(mockOpportunity)

      const result = await api.opportunities.getOpportunity('opp123')

      expect(mockedApi.opportunities.getOpportunity).toHaveBeenCalledWith('opp123')
      expect(result).toEqual(mockOpportunity)
    })
  })

  describe('Solutions API', () => {
    it('should get user solutions', async () => {
      const mockSolutions = [
        {
          solutionId: 'sol1',
          title: 'Cover Letter',
          createdAt: '2025-01-01'
        }
      ]
      mockedApi.solutions.getUserSolutions.mockResolvedValueOnce(mockSolutions)

      const result = await api.solutions.getUserSolutions()

      expect(mockedApi.solutions.getUserSolutions).toHaveBeenCalled()
      expect(result).toEqual(mockSolutions)
    })

    it('should generate solution', async () => {
      const solutionData = {
        opportunityId: 'opp123',
        type: 'cover_letter' as const
      }
      const mockResponse = { solution_id: 'sol123', status: 'GENERATING' }
      mockedApi.solutions.generateSolution.mockResolvedValueOnce(mockResponse)

      const result = await api.solutions.generateSolution(solutionData)

      expect(mockedApi.solutions.generateSolution).toHaveBeenCalledWith(solutionData)
      expect(result).toEqual(mockResponse)
    })

    it('should get solution by id', async () => {
      const mockSolution = {
        solutionId: 'sol123',
        content: 'Solution content',
        title: 'My Solution'
      }
      mockedApi.solutions.getSolution.mockResolvedValueOnce(mockSolution)

      const result = await api.solutions.getSolution('sol123')

      expect(mockedApi.solutions.getSolution).toHaveBeenCalledWith('sol123')
      expect(result).toEqual(mockSolution)
    })

    it('should publish solution', async () => {
      const mockResponse = { public_url: 'https://example.com/s/sol123' }
      mockedApi.solutions.publishSolution.mockResolvedValueOnce(mockResponse)

      const result = await api.solutions.publishSolution('sol123')

      expect(mockedApi.solutions.publishSolution).toHaveBeenCalledWith('sol123')
      expect(result).toEqual(mockResponse)
    })

    it('should export solution', async () => {
      const mockBlob = new Blob(['content'], { type: 'application/pdf' })
      mockedApi.solutions.exportSolution.mockResolvedValueOnce(mockBlob)

      const result = await api.solutions.exportSolution('sol123', 'pdf')

      expect(mockedApi.solutions.exportSolution).toHaveBeenCalledWith('sol123', 'pdf')
      expect(result).toEqual(mockBlob)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockedApi.identity.getIdentityGraph.mockRejectedValueOnce(new Error('Network Error'))

      await expect(api.identity.getIdentityGraph()).rejects.toThrow('Network Error')
    })

    it('should handle API errors', async () => {
      const apiError = {
        response: {
          status: 404,
          data: { error: 'Not Found' }
        }
      }
      mockedApi.opportunities.getOpportunity.mockRejectedValueOnce(apiError)

      await expect(api.opportunities.getOpportunity('invalid')).rejects.toEqual(apiError)
    })

    it('should handle authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' }
        }
      }
      mockedApi.identity.getIdentityGraph.mockRejectedValueOnce(authError)

      await expect(api.identity.getIdentityGraph()).rejects.toEqual(authError)
    })
  })
})