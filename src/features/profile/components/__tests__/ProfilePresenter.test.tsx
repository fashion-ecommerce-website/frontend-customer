import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfilePresenter } from '../ProfilePresenter';
import { ProfilePresenterProps, User, ProfileFormData, ChangePasswordFormData, ApiError } from '../../types/profile.types';

// Mock the useFormValidation hook
jest.mock('../../hooks/useValidation', () => ({
  useFormValidation: () => ({
    validationErrors: {},
    clearAllErrors: jest.fn(),
    validateAndSetErrors: jest.fn(() => true),
    handleInputChange: jest.fn(),
  }),
}));

// Mock components
jest.mock('../../../../components', () => ({
  PageLoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div data-testid="error-message">{message}</div>,
  SuccessMessage: ({ message }: { message: string }) => <div data-testid="success-message">{message}</div>,
  Breadcrumb: ({ items }: { items: any[] }) => <div data-testid="breadcrumb">{items.map(item => item.label).join(' > ')}</div>,
}));

// Mock sub-components
jest.mock('../ProfileSidebar', () => ({
  ProfileSidebar: ({ activeSection, onSectionChange }: any) => (
    <div data-testid="profile-sidebar">
      <button onClick={() => onSectionChange('profile')}>Profile</button>
    </div>
  ),
}));

jest.mock('../ProfileFormSection', () => ({
  ProfileFormSection: ({ onShowPasswordModal }: any) => (
    <div data-testid="profile-form-section">
      <button onClick={onShowPasswordModal} data-testid="show-password-modal">Change Password</button>
    </div>
  ),
}));

jest.mock('../PasswordChangeModal', () => ({
  PasswordChangeModal: ({ isOpen, onClose }: any) => (
    isOpen ? (
      <div data-testid="password-modal">
        <button onClick={onClose} data-testid="close-password-modal">Close</button>
      </div>
    ) : null
  ),
}));

describe('ProfilePresenter', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    phone: '1234567890',
    avatarUrl: null,
    reason: null,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    lastLoginAt: '2023-01-01',
    emailVerified: true,
    phoneVerified: true,
    roles: ['customer'],
    active: true,
  };

  const mockProfileFormData: ProfileFormData = {
    username: 'testuser',
    email: 'test@example.com',
    phone: '1234567890',
  };

  const mockPasswordFormData: ChangePasswordFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const mockProps: ProfilePresenterProps = {
    user: mockUser,
    isLoading: false,
    isUpdating: false,
    isChangingPassword: false,
    error: null,
    updateError: null,
    passwordError: null,
    updateSuccess: false,
    passwordChangeSuccess: false,
    profileFormData: mockProfileFormData,
    passwordFormData: mockPasswordFormData,
    onProfileFormDataChange: jest.fn(),
    onPasswordFormDataChange: jest.fn(),
    onUpdateProfile: jest.fn(),
    onChangePassword: jest.fn(),
    onClearError: jest.fn(),
    onClearUpdateError: jest.fn(),
    onClearPasswordError: jest.fn(),
    onClearSuccess: jest.fn(),
  };

  const renderComponent = (props = mockProps) => {
    return render(<ProfilePresenter {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderComponent({ ...mockProps, isLoading: true });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows no profile data message when user is null', () => {
    renderComponent({ ...mockProps, user: null });

    expect(screen.getByText('No profile data available')).toBeInTheDocument();
  });

  it('renders profile components when user data is available', () => {
    renderComponent();

    expect(screen.getByTestId('profile-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('profile-form-section')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const error: ApiError = { message: 'Profile update failed' };
    renderComponent({ ...mockProps, error });

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Profile update failed')).toBeInTheDocument();
  });

  it('displays update error message when updateError prop is provided', () => {
    const updateError: ApiError = { message: 'Update failed' };
    renderComponent({ ...mockProps, updateError });

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });

  it('displays success message when updateSuccess is true', () => {
    renderComponent({ ...mockProps, updateSuccess: true });

    expect(screen.getByTestId('success-message')).toBeInTheDocument();
    expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
  });

  it('opens password modal when show password modal button is clicked', async () => {
    renderComponent();

    const showPasswordButton = screen.getByTestId('show-password-modal');
    fireEvent.click(showPasswordButton);

    await waitFor(() => {
      expect(screen.getByTestId('password-modal')).toBeInTheDocument();
    });
  });

  it('closes password modal when close button is clicked', async () => {
    renderComponent();

    // Open modal first
    const showPasswordButton = screen.getByTestId('show-password-modal');
    fireEvent.click(showPasswordButton);

    await waitFor(() => {
      expect(screen.getByTestId('password-modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('close-password-modal');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('password-modal')).not.toBeInTheDocument();
    });
  });

  it('renders breadcrumb with correct items', () => {
    renderComponent();

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toHaveTextContent('HOME > ACCOUNT > INFORMATION');
  });

  it('does not render password modal initially', () => {
    renderComponent();

    expect(screen.queryByTestId('password-modal')).not.toBeInTheDocument();
  });
});
