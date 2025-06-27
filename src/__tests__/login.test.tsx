import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'
import { AuthProvider } from '@/lib/auth'
import { authApi } from '@/lib/auth-api'

// Mock the auth API
jest.mock('@/lib/auth-api', () => ({
  authApi: {
    login: jest.fn(),
    resendConfirmation: jest.fn(),
    getUserProfile: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
}))

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>

// Mock the FederatedAuthButtons component
jest.mock('@/components/federated-auth-buttons', () => ({
  FederatedAuthButtons: () => <div data-testid="federated-auth">Federated Auth</div>,
}))

function renderLoginPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    renderLoginPage()

    expect(screen.getByText('Welcome to Idynic')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByTestId('federated-auth')).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    mockedAuthApi.login.mockResolvedValueOnce({
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      token_type: 'Bearer',
      expires_in: 3600,
    })

    renderLoginPage()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup()
    mockedAuthApi.login.mockRejectedValueOnce({
      response: { status: 401, data: { error_description: 'Invalid credentials' } }
    })

    renderLoginPage()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument()
    })
  })

  it('should show resend confirmation for unconfirmed user', async () => {
    const user = userEvent.setup()
    mockedAuthApi.login.mockRejectedValueOnce({
      response: { 
        data: { error: 'UserNotConfirmedException' }
      }
    })
    mockedAuthApi.resendConfirmation.mockResolvedValueOnce({
      destination: 'test@example.com',
      delivery_medium: 'EMAIL',
      attribute_name: 'email'
    })

    renderLoginPage()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Please confirm your account first/)).toBeInTheDocument()
    })

    const resendButton = screen.getByRole('button', { name: 'Resend Confirmation Code' })
    expect(resendButton).toBeInTheDocument()

    await user.click(resendButton)

    await waitFor(() => {
      expect(mockedAuthApi.resendConfirmation).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('should disable submit button when form is incomplete', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    expect(submitButton).toBeDisabled()

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')
    expect(submitButton).toBeDisabled()

    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')
    expect(submitButton).not.toBeDisabled()
  })

  it('should show loading state during login', async () => {
    const user = userEvent.setup()
    mockedAuthApi.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderLoginPage()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
  })
})