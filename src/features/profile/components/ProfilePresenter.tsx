'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfilePresenterProps, UpdateProfileRequest } from '../types/profile.types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useFormValidation } from '../hooks/useValidation';
import { 
  PageLoadingSpinner, 
  ErrorMessage, 
  Breadcrumb 
} from '../../../components';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileFormSection } from './ProfileFormSection';
import { PasswordChangeModal } from './PasswordChangeModal';
import { UpdateInfoModal } from './UpdateInfoModal';
import { RecentlyViewed } from './RecentlyViewed';
import { WishlistContainer } from '../containers/WishlistContainer';
import { AccountOverview } from './AccountOverview';
import { AddressContainer } from '../containers/AddressContainer';
import { OrderHistoryContainer } from '../containers/OrderHistoryContainer';
import { ReviewContainer } from '../containers/ReviewContainer';
import { VoucherContainer } from '../containers/VoucherContainer';
import { RefundContainer } from '../containers/RefundContainer';
import MembershipInfo from './MembershipInfo';
import OrderDetailPresenter from '../components/OrderDetailPresenter';
import { Order } from '@/features/order/types';
import OrderApi from '@/services/api/orderApi';
import { OrderTrackingContainer } from '../containers/OrderTrackingContainer';
import PaymentApi from '@/services/api/paymentApi';
import { RefundModal } from '@/components/modals/RefundModal';
import { RefundApi } from '@/services/api/refundApi';
import { useLanguage } from '@/hooks/useLanguage';

export const ProfilePresenter: React.FC<ProfilePresenterProps> = ({
  initialSection = 'account',
  user,
  isLoading,
  isUpdating,
  isChangingPassword,
  error,
  updateError,
  passwordError,
  updateSuccess,
  passwordChangeSuccess,
  profileFormData,
  passwordFormData,
  onProfileFormDataChange,
  onPasswordFormDataChange,
  onUpdateProfile,
  onChangePassword,
  onClearError,
  onClearPasswordError,
  onClearSuccess,
}) => {
  const { translations } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  // Default to account overview or use initialSection
  const [activeSidebarSection, setActiveSidebarSection] = useState(initialSection);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrderFromQuery, setIsLoadingOrderFromQuery] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // Sync with query-driven initialSection changes (e.g., /profile?section=order-info)
  useEffect(() => {
    if (initialSection && initialSection !== activeSidebarSection) {
      setActiveSidebarSection(initialSection);
    }
    if (!initialSection && !activeSidebarSection) {
      setActiveSidebarSection('account');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSection]);
  const router = useRouter();
  const { logout } = useAuth();
  
  const {
    validationErrors,
    clearAllErrors,
    clearFieldError,
    validateAndSetErrors,
  } = useFormValidation();

  // Close update info modal on successful update
  useEffect(() => {
    if (updateSuccess && showUpdateInfoModal) {
      setShowUpdateInfoModal(false);
    }
  }, [updateSuccess, showUpdateInfoModal]);

  // Handle profile form submission
  const handleProfileSubmit = (formData: typeof profileFormData) => {
    if (validateAndSetErrors(formData, 'profile')) {
      onUpdateProfile(formData);
      // Close the modal after successful submission
      setShowUpdateInfoModal(false);
    }
  };

  // If arriving with ?orderId= in query, load that order and jump to detail view inside profile
  useEffect(() => {
    const orderIdParam = searchParams?.get('orderId');
    if (!orderIdParam) return;
    const id = parseInt(orderIdParam, 10);
    if (!id || Number.isNaN(id)) return;
    setIsLoadingOrderFromQuery(true);
    OrderApi.getOrderById(id)
      .then((res) => {
        if (res.success && res.data) {
          setSelectedOrder(res.data);
          setActiveSidebarSection('order-detail');
        } else {
          // Fallback to order list if not found
          setActiveSidebarSection('order-info');
        }
      })
      .catch(() => {
        setActiveSidebarSection('order-info');
      })
      .finally(() => setIsLoadingOrderFromQuery(false));
  }, [searchParams]);

  // Handle modal form submission with API format
  const handleModalSubmit = (data: UpdateProfileRequest) => {
    // Validate the form data before submitting
    if (validateAndSetErrors(profileFormData, 'profile')) {
      // Pass the API payload directly to the unified update function
      onUpdateProfile(data);
      setShowUpdateInfoModal(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = (formData: typeof passwordFormData) => {
    if (validateAndSetErrors(formData, 'password')) {
      onChangePassword(formData);
    }
  };

  // Handle password modal close
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    onClearPasswordError();
    onClearSuccess(); // Clear passwordChangeSuccess to prevent toast loop
    clearAllErrors();
    // Reset password form fields
    onPasswordFormDataChange({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Handle password modal open
  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  // Handle update info modal open
  const handleUpdateInfoModalOpen = () => {
    clearAllErrors(); // Clear any previous validation errors
    setShowUpdateInfoModal(true);
  };

  // Handle update info modal close
  const handleUpdateInfoModalClose = () => {
    setShowUpdateInfoModal(false);
    clearAllErrors();
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Handle sidebar section change
  const handleSidebarSectionChange = (section: string) => {
    if (section === 'logout') {
      logout();
      router.push('/auth/login');
      return;
    }
    setActiveSidebarSection(section);
    // Here you can add logic to show different content based on section
  };

  // Handle pay again functionality
  const handlePayAgain = async (paymentId: number, orderId?: number) => {
    if (!paymentId) {
      console.log('Payment ID is not available for this order');
      return;
    }
    
    try {
      const response = await PaymentApi.createCheckout({
        paymentId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}${orderId ? `&orderId=${orderId}` : ''}`,
        cancelUrl: `${window.location.origin}/profile?section=order-info`
      });
      
      if (response.success && response.data?.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error('Failed to create checkout session:', response.message);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle refund functionality
  const handleRefundClick = (order: Order) => {
    setSelectedOrderForRefund(order);
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async (orderId: number, reason: string, refundAmount: number, imageUrls?: string[]) => {
    setRefundLoading(true);
    try {
      const response = await RefundApi.createRefund({
        orderId,
        reason,
        refundAmount,
        imageUrls,
      });
      
      if (response.success) {
        // Close modal on success
        setIsRefundModalOpen(false);
        setSelectedOrderForRefund(null);
      } else {
        throw new Error(response.message || 'Failed to submit refund request');
      }
    } finally {
      setRefundLoading(false);
    }
  };

  // Breadcrumb items with dynamic section label
  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'account':
        return translations.profile.account;
      case 'wishlist':
        return translations.profile.wishlist.toUpperCase();
      case 'recently-viewed':
        return translations.profile.recentlyViewed.toUpperCase();
      case 'order-info':
        return translations.profile.orderInfo.toUpperCase();
      case 'order-tracking':
        return translations.profile.orderTracking.toUpperCase();
      case 'my-info':
        return translations.profile.myInfo.toUpperCase();
      case 'shipping-address':
        return translations.profile.shippingAddress.toUpperCase();
      case 'my-reviews':
        return translations.profile.myReviews.toUpperCase();
      case 'my-vouchers':
        return translations.profile.vouchers.toUpperCase();
      // Add other cases as needed
      default:
        return '';
    }
  };
  const breadcrumbItems = (() => {
    if (activeSidebarSection === 'account') {
      return [
        { label: 'HOME', href: '/' },
        { label: 'ACCOUNT', onClick: () => handleSidebarSectionChange('account') },
      ];
    }
    if (activeSidebarSection === 'order-detail' && selectedOrder) {
      return [
        { label: 'HOME', href: '/' },
        { label: 'ACCOUNT', onClick: () => handleSidebarSectionChange('account') },
        { label: 'ORDER INFORMATION', onClick: () => setActiveSidebarSection('order-info') },
        { label: `V${selectedOrder.id}`, isActive: true },
      ];
    }
    return [
      { label: 'HOME', href: '/' },
      { label: 'ACCOUNT', onClick: () => handleSidebarSectionChange('account') },
      { label: getSectionLabel(activeSidebarSection), isActive: true },
    ];
  })();

  // Loading state
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  // No user data
  if (!user) {
    return (
      <div className="px-35 py-15 bg-white">
        <div className="flex items-center justify-center p-8">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex gap-4 sm:gap-6 lg:gap-6 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-72 lg:flex-shrink-0">
            <ProfileSidebar 
              user={user}
              activeSection={activeSidebarSection}
              onSectionChange={handleSidebarSectionChange}
            />
          </div>

          {/* Main Content */}
          <main className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex-1 min-w-0 p-6 sm:p-8 lg:max-w-none">

          {/* Global Error */}
          {error && (
            <ErrorMessage 
              message={error.message}
              className="mb-4"
            />
          )}

          {/* Update Error */}
          {updateError && (
            <ErrorMessage 
              message={updateError.message}
              className="mb-4"
            />
          )}

          {/* Render content based on active section */}
          {activeSidebarSection === 'account' && (
            <AccountOverview user={user} />
          )}
          {activeSidebarSection === 'wishlist' && <WishlistContainer />}
          {activeSidebarSection === 'recently-viewed' && <RecentlyViewed />}
          {activeSidebarSection === 'my-vouchers' && <VoucherContainer />}
          {activeSidebarSection === 'shipping-address' && (
            <AddressContainer />
          )}
          {activeSidebarSection === 'order-info' && (
            <OrderHistoryContainer 
              onOpenDetail={(order) => { setSelectedOrder(order); setActiveSidebarSection('order-detail'); }}
              onTrack={(order) => { setSelectedOrder(order); setActiveSidebarSection('order-tracking'); }}
              onPayAgain={(paymentId: number, orderId: number) => handlePayAgain(paymentId, orderId)}
            />
          )}
          {activeSidebarSection === 'order-detail' && (
            <div className="mt-6">
              {isLoadingOrderFromQuery && (
                <div className="px-4 py-10 text-gray-600">Loading order...</div>
              )}
              {!isLoadingOrderFromQuery && selectedOrder && (
                <OrderDetailPresenter 
                  order={selectedOrder}
                  onBack={() => {
                    setActiveSidebarSection('order-info');
                    // keep selected order or clear depending on UX; clear to avoid stale breadcrumb
                    setSelectedOrder(null);
                  }}
                  onRefund={handleRefundClick}
                />
              )}
            </div>
          )}
          {activeSidebarSection === 'order-tracking' && selectedOrder && (
            <div className="mt-6">
              <OrderTrackingContainer 
                order={selectedOrder}
                onBack={() => {
                  setActiveSidebarSection('order-info');
                }}
                onOrderUpdate={(updatedOrder) => {
                  setSelectedOrder(updatedOrder);
                }}
              />
            </div>
          )}
          {activeSidebarSection === 'my-info' && (
            <ProfileFormSection
              user={user}
              profileFormData={profileFormData}
              isUpdating={isUpdating}
              validationErrors={validationErrors}
              onProfileFormDataChange={onProfileFormDataChange}
              onSubmit={handleProfileSubmit}
              onInputFocus={handleInputFocus}
              onShowPasswordModal={handlePasswordModalOpen}
              onShowUpdateInfoModal={handleUpdateInfoModalOpen}
              isChangingPassword={isChangingPassword}
            />
          )}
          {activeSidebarSection === 'my-reviews' && (
            <ReviewContainer />
          )}
          {activeSidebarSection === 'my-refund' && (
            <RefundContainer />
          )}
          {activeSidebarSection === 'membership-info' && (
            <MembershipInfo user={user} />
          )}
          {/* TODO: add other sections (membership-info, order-info, etc) */}
          </main>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        passwordFormData={passwordFormData}
        isChangingPassword={isChangingPassword}
        passwordError={passwordError}
        passwordChangeSuccess={passwordChangeSuccess}
        validationErrors={validationErrors}
        onPasswordFormDataChange={onPasswordFormDataChange}
        onChangePassword={handlePasswordSubmit}
        onClose={handlePasswordModalClose}
        onClearPasswordError={onClearPasswordError}
        onClearFieldError={clearFieldError}
      />

      {/* Update Info Modal */}
      <UpdateInfoModal
        isOpen={showUpdateInfoModal}
        profileFormData={profileFormData}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
        onClose={handleUpdateInfoModalClose}
        onProfileFormDataChange={onProfileFormDataChange}
        onSubmit={handleModalSubmit}
      />

      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedOrderForRefund(null);
        }}
        order={selectedOrderForRefund}
        onConfirm={handleRefundConfirm}
        loading={refundLoading}
      />
    </div>
  );
};
