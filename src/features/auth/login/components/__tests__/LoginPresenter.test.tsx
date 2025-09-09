import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPresenter } from '../LoginPresenter';
import { LoginPresenterProps, LoginFormData, ApiError } from '../../types/login.types';

// Mock the useToast hook
jest.mock('../../../../../providers/ToastProvider', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Mock GoogleAuth component
jest.mock('../../../../../components', () => ({
  GoogleAuth: ({ onSuccess, onError }: any) => (
    <div data-testid="google-auth">
      <button onClick={() => onSuccess({ name: 'Test User' })}>Google Login</button>
      <button onClick={() => onError('Google login failed')}>Google Error</button>
    </div>
  ),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe('LoginPresenter', () => {
  const mockProps: LoginPresenterProps = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    formData: {
      email: '',
      password: '',
    },
    onFormDataChange: jest.fn(),
    onSubmit: jest.fn(),
    onClearError: jest.fn(),
    onLogout: jest.fn(),
  };

  const renderComponent = (props = mockProps) => {
    return render(<LoginPresenter {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
    expect(screen.getByLabelText('EMAIL')).toBeInTheDocument();
    expect(screen.getByLabelText('PASSWORD')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LOGIN' })).toBeInTheDocument();
    expect(screen.getByTestId('google-auth')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const error: ApiError = { message: 'Invalid credentials' };
    renderComponent({ ...mockProps, error });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('calls onClearError when error close button is clicked', () => {
    const error: ApiError = { message: 'Invalid credentials' };
    renderComponent({ ...mockProps, error });

    const closeButton = screen.getByRole('button', { name: '' }); // Close button has no text
    fireEvent.click(closeButton);

    expect(mockProps.onClearError).toHaveBeenCalled();
  });

  it('updates form data when input values change', () => {
    renderComponent();

    const emailInput = screen.getByLabelText('EMAIL');
    const passwordInput = screen.getByLabelText('PASSWORD');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockProps.onFormDataChange).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockProps.onFormDataChange).toHaveBeenCalledWith({ password: 'password123' });
  });

  it('calls onSubmit with form data when form is submitted', () => {
    const formData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };
    renderComponent({ ...mockProps, formData });

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockProps.onSubmit).toHaveBeenCalledWith(formData);
  });

  it('shows loading state when isLoading is true', () => {
    renderComponent({ ...mockProps, isLoading: true });

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });

  it('disables inputs when loading', () => {
    renderComponent({ ...mockProps, isLoading: true });

    const emailInput = screen.getByLabelText('EMAIL');
    const passwordInput = screen.getByLabelText('PASSWORD');

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('clears error when input is focused and error exists', () => {
    const error: ApiError = { message: 'Invalid credentials' };
    renderComponent({ ...mockProps, error });

    const emailInput = screen.getByLabelText('EMAIL');
    fireEvent.focus(emailInput);

    expect(mockProps.onClearError).toHaveBeenCalled();
  });

  it('renders links correctly', () => {
    renderComponent();

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders Facebook login button', () => {
    renderComponent();

    expect(screen.getByText('LOGIN FACEBOOK')).toBeInTheDocument();
  });
});
