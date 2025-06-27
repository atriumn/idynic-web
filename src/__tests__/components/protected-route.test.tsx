import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/lib/auth'

// Mock the auth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}))

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state when auth is loading', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { username: 'test@example.com', attributes: {} },
      isAuthenticated: true,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should not render anything when redirecting', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      confirmSignup: jest.fn(),
      resendConfirmation: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    })

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(container.firstChild).toBeNull()
  })
})