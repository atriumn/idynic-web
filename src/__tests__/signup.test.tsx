import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupPage from '@/app/signup/page'
import { AuthProvider } from '@/lib/auth'
import { authApi } from '@/lib/auth-api'

// Mock the auth API
jest.mock('@/lib/auth-api', () => ({
  authApi: {
    signup: jest.fn(),
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

function renderSignupPage() {
  return render(
    <AuthProvider>
      <SignupPage />
    </AuthProvider>
  )
}

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render signup form', () => {
    renderSignupPage()

    expect(screen.getByText('Create Your Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByTestId('federated-auth')).toBeInTheDocument()
  })

  it('should handle successful signup', async () => {
    const user = userEvent.setup()
    mockedAuthApi.signup.mockResolvedValueOnce({
      user_id: 'user-123'
    })

    renderSignupPage()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(mockedAuthApi.signup).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        { email: 'test@example.com' }
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/)).toBeInTheDocument()
    })
  })

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderSignupPage()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'different123')
    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    expect(mockedAuthApi.signup).not.toHaveBeenCalled()
  })

  it('should show error for short password', async () => {
    const user = userEvent.setup()
    renderSignupPage()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.type(screen.getByLabelText('Confirm Password'), 'short')
    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })

    expect(mockedAuthApi.signup).not.toHaveBeenCalled()
  })

  it('should handle signup error for existing user', async () => {
    const user = userEvent.setup()
    mockedAuthApi.signup.mockRejectedValueOnce({
      response: { status: 409 }
    })

    renderSignupPage()

    await user.type(screen.getByLabelText('Email'), 'existing@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(screen.getByText(/If this email isn't already registered/)).toBeInTheDocument()
    })
  })

  it('should disable submit button when form is incomplete', async () => {
    const user = userEvent.setup()
    renderSignupPage()

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Password'), 'password123')
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('First Name'), 'John')
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    expect(submitButton).not.toBeDisabled()
  })

  it('should show loading state during signup', async () => {
    const user = userEvent.setup()
    mockedAuthApi.signup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderSignupPage()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByRole('button', { name: 'Creating account...' })).toBeInTheDocument()
  })
})