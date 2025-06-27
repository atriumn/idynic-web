import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from '@/app/dashboard/page'
import { AuthProvider, useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    identity: {
      getIdentityGraph: jest.fn(),
    },
    opportunities: {
      getUserOpportunities: jest.fn(),
    },
    solutions: {
      getUserSolutions: jest.fn(),
    },
  },
}))

const mockedApi = api as jest.Mocked<typeof api>

// Mock auth hook to return authenticated user
jest.mock('@/lib/auth', () => ({
  ...jest.requireActual('@/lib/auth'),
  useAuth: jest.fn(),
}))

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock the modals
jest.mock('@/components/feed-evidence-modal', () => ({
  FeedEvidenceModal: ({ open, onOpenChange }: any) => 
    open ? <div data-testid="feed-evidence-modal">Feed Evidence Modal</div> : null,
}))

jest.mock('@/components/analyze-opportunity-modal', () => ({
  AnalyzeOpportunityModal: ({ open, onOpenChange }: any) => 
    open ? <div data-testid="analyze-opportunity-modal">Analyze Opportunity Modal</div> : null,
}))

jest.mock('@/components/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}))

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock authenticated user
    mockedUseAuth.mockReturnValue({
      user: { 
        username: 'test-user',
        attributes: { email: 'test@example.com' }
      },
      isAuthenticated: true,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    })

    // Mock API responses
    mockedApi.identity.getIdentityGraph.mockResolvedValue({
      evidence_count: 5,
      data: { traits: ['leadership', 'technical'] }
    })
    
    mockedApi.opportunities.getUserOpportunities.mockResolvedValue([
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
    ])
    
    mockedApi.solutions.getUserSolutions.mockResolvedValue([
      {
        solutionId: 'sol1',
        title: 'Cover Letter for Tech Corp',
        createdAt: '2025-01-01'
      }
    ])
  })

  it('should render dashboard with user email', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Idynic Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Signed in as test@example.com')).toBeInTheDocument()
    })
  })

  it('should display identity depth based on evidence count', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Growing')).toBeInTheDocument()
      expect(screen.getByText('Your story is expanding')).toBeInTheDocument()
      expect(screen.getByText('5 pieces of evidence')).toBeInTheDocument()
    })
  })

  it('should show "Building Identity" for zero evidence', async () => {
    mockedApi.identity.getIdentityGraph.mockResolvedValue({
      evidence_count: 0,
      data: {}
    })

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Building Identity')).toBeInTheDocument()
      expect(screen.getByText('Emerging')).toBeInTheDocument()
      expect(screen.getByText('Ready to add your first evidence')).toBeInTheDocument()
    })
  })

  it('should open feed evidence modal when clicking feed identity', async () => {
    renderDashboard()

    await waitFor(() => {
      const feedButton = screen.getByText('Feed Identity')
      fireEvent.click(feedButton)
    })

    expect(screen.getByTestId('feed-evidence-modal')).toBeInTheDocument()
  })

  it('should open analyze opportunity modal when clicking analyze opportunity', async () => {
    renderDashboard()

    await waitFor(() => {
      const analyzeButton = screen.getByText('Analyze Opportunity')
      fireEvent.click(analyzeButton)
    })

    expect(screen.getByTestId('analyze-opportunity-modal')).toBeInTheDocument()
  })

  it('should display recent opportunities', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(screen.getByText('COMPLETE')).toBeInTheDocument()
    })
  })

  it('should display solutions summary', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Cover Letter for Tech Corp')).toBeInTheDocument()
    })
  })

  it('should show empty state when no opportunities', async () => {
    mockedApi.opportunities.getUserOpportunities.mockResolvedValue([])

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('No opportunities yet. Analyze your first opportunity!')).toBeInTheDocument()
    })
  })

  it('should show empty state when no solutions', async () => {
    mockedApi.solutions.getUserSolutions.mockResolvedValue([])

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('No solutions yet.')).toBeInTheDocument()
    })
  })

  it('should display navigation links', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('What is Idynic?')).toBeInTheDocument()
      expect(screen.getByText('Docs')).toBeInTheDocument()
      expect(screen.getByText('API')).toBeInTheDocument()
    })
  })

  it('should have logout functionality', async () => {
    const mockLogout = jest.fn()
    mockedUseAuth.mockReturnValue({
      user: { 
        username: 'test-user',
        attributes: { email: 'test@example.com' }
      },
      isAuthenticated: true,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: mockLogout,
      refreshToken: jest.fn(),
    })

    renderDashboard()

    await waitFor(() => {
      const logoutButton = screen.getByText('Sign Out')
      fireEvent.click(logoutButton)
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  it('should render footer', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })
})