import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/auth'
import { authApi } from '@/lib/auth-api'

// Mock the auth API
jest.mock('@/lib/auth-api', () => ({
  authApi: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getUserProfile: jest.fn(),
    refreshToken: jest.fn(),
  },
}))

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>

// Test component that uses auth
function TestComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span data-testid="user-email">{user?.username}</span>
          <button onClick={() => logout()} data-testid="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => login('test@example.com', 'password')} 
            data-testid="login-btn"
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}

describe('Auth System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should render login button when not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('login-btn')).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const mockUser = { username: 'test@example.com', attributes: { email: 'test@example.com' } }
    mockedAuthApi.login.mockResolvedValueOnce({
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      token_type: 'Bearer',
      expires_in: 3600,
    })
    mockedAuthApi.getUserProfile.mockResolvedValueOnce(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    fireEvent.click(loginBtn)

    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith('test@example.com', 'password')
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })

  it('should handle login failure', async () => {
    mockedAuthApi.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    fireEvent.click(loginBtn)

    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith('test@example.com', 'password')
    })

    // Should still show login button after failed login
    expect(screen.getByTestId('login-btn')).toBeInTheDocument()
  })

  it('should handle logout', async () => {
    const mockUser = { username: 'test@example.com', attributes: { email: 'test@example.com' } }
    
    // Set up authenticated state
    localStorage.setItem('access_token', 'mock-token')
    localStorage.setItem('refresh_token', 'mock-refresh')
    mockedAuthApi.getUserProfile.mockResolvedValueOnce(mockUser)
    mockedAuthApi.logout.mockResolvedValueOnce()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })

    const logoutBtn = screen.getByTestId('logout-btn')
    fireEvent.click(logoutBtn)

    await waitFor(() => {
      expect(mockedAuthApi.logout).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByTestId('login-btn')).toBeInTheDocument()
    })
  })

  it('should restore authentication from localStorage on mount', async () => {
    const mockUser = { username: 'test@example.com', attributes: { email: 'test@example.com' } }
    
    localStorage.setItem('access_token', 'mock-token')
    localStorage.setItem('refresh_token', 'mock-refresh')
    mockedAuthApi.getUserProfile.mockResolvedValueOnce(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })
})