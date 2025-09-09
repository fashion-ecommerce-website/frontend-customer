import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../../../../../components/RegisterForm';

describe('RegisterForm', () => {
  const mockProps = {
    username: '',
    email: '',
    password: '',
    phone: '',
    onUsernameChange: jest.fn(),
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onPhoneChange: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
  };

  const renderComponent = (props = mockProps) => {
    return render(<RegisterForm {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('calls onUsernameChange when username input changes', () => {
    renderComponent();

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(mockProps.onUsernameChange).toHaveBeenCalledWith('testuser');
  });

  it('calls onEmailChange when email input changes', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockProps.onEmailChange).toHaveBeenCalledWith('test@example.com');
  });

  it('calls onPasswordChange when password input changes', () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockProps.onPasswordChange).toHaveBeenCalledWith('password123');
  });

  it('calls onPhoneChange when phone input changes', () => {
    renderComponent();

    const phoneInput = screen.getByPlaceholderText('Phone');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(mockProps.onPhoneChange).toHaveBeenCalledWith('1234567890');
  });

  it('calls onSubmit when form is submitted', () => {
    const props = {
      ...mockProps,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
    };
    renderComponent(props);

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('disables submit button when form is invalid', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'Register' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
    const props = {
      ...mockProps,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
    };
    renderComponent(props);

    const submitButton = screen.getByRole('button', { name: 'Register' });
    expect(submitButton).toBeEnabled();
  });

  it('shows loading state when isLoading is true', () => {
    const props = {
      ...mockProps,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      isLoading: true,
    };
    renderComponent(props);

    expect(screen.getByText('Registering...')).toBeInTheDocument();
  });

  it('disables inputs when loading', () => {
    const props = {
      ...mockProps,
      isLoading: true,
    };
    renderComponent(props);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const phoneInput = screen.getByPlaceholderText('Phone');

    expect(usernameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(phoneInput).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    const props = {
      ...mockProps,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      isLoading: true,
    };
    renderComponent(props);

    const submitButton = screen.getByRole('button', { name: 'Registering...' });
    expect(submitButton).toBeDisabled();
  });
});
