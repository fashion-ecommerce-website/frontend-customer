/**
 * Profile Presenter Component
 * Pure UI component for profile management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfilePresenterProps } from '../types/profile.types';
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
import { UpdateInfoModal, UpdateProfileApiPayload } from './UpdateInfoModal';
import { RecentlyViewed } from './RecentlyViewed';
import { WishlistContainer } from '../containers/WishlistContainer';
import { AccountOverview } from './AccountOverview';
import { AddressContainer } from '../containers/AddressContainer';
import { OrderHistoryContainer } from '../containers/OrderHistoryContainer';
import { ReviewContainer } from '../containers/ReviewContainer';
import { VoucherContainer } from '../containers/VoucherContainer';
import OrderDetailPresenter from '../components/OrderDetailPresenter';
import { Order } from '@/features/order/types';
import OrderApi from '@/services/api/orderApi';
import { productApi } from '@/services/api/productApi';
import { OrderTrackingContainer } from '../containers/OrderTrackingContainer';
import PaymentApi from '@/services/api/paymentApi';

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
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  // Default to account overview or use initialSection
  const [activeSidebarSection, setActiveSidebarSection] = useState(initialSection);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrderFromQuery, setIsLoadingOrderFromQuery] = useState(false);
  const [imagesByDetailId, setImagesByDetailId] = useState<Record<number, string>>({});
  const searchParams = useSearchParams();
  
  // Sync with query-driven initialSection changes (e.g., /profile?section=order-info)
  useEffect(() => {
    if (initialSection && initialSection !== activeSidebarSection) {
      setActiveSidebarSection(initialSection);
    }
    if (!initialSection && !activeSidebarSection) {
      setActiveSidebarSection('account');
    }
  }, [initialSection]);
  const router = useRouter();
  const { logout } = useAuth();
  
  const {
    validationErrors,
    clearAllErrors,
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

  useEffect(() => {
    if (!selectedOrder || !selectedOrder.orderDetails?.length) {
      setImagesByDetailId({});
      return;
    }
    const uniqueDetailIds = Array.from(new Set(selectedOrder.orderDetails.map(d => d.productDetailId)));
    let cancelled = false;
    Promise.all(uniqueDetailIds.map(detailId =>
      productApi.getProductById(String(detailId))
        .then(r => ({ id: detailId, img: r.success ? (r.data?.images?.[0] || '') : '' }))
        .catch(() => ({ id: detailId, img: '' }))
    ))
    .then(results => {
      if (cancelled) return;
      const map: Record<number, string> = {};
      results.forEach(({ id, img }) => { if (img) map[id] = img; });
      setImagesByDetailId(map);
    });
    return () => { cancelled = true; };
  }, [selectedOrder]);

  // Handle modal form submission with API format
  const handleModalSubmit = (data: UpdateProfileApiPayload) => {
    // Pass the API payload directly to the unified update function
    onUpdateProfile(data);
    setShowUpdateInfoModal(false);
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
    clearAllErrors();
  };

  // Handle password modal open
  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  // Handle update info modal open
  const handleUpdateInfoModalOpen = () => {
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

  // Breadcrumb items with dynamic section label
  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'account':
        return 'ACCOUNT';
      case 'wishlist':
        return 'WISHLIST';
      case 'recently-viewed':
        return 'RECENTLY VIEWED';
      case 'order-info':
        return 'ORDER INFORMATION';
      case 'order-tracking':
        return 'ORDER TRACKING';
      case 'my-info':
        return 'MY INFO';
      case 'shipping-address':
        return 'ADDRESSES';
      case 'my-reviews':
        return 'MY REVIEWS';
      case 'my-vouchers':
        return 'VOUCHERS';
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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex gap-8 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 lg:flex-shrink-0">
          <ProfileSidebar 
            activeSection={activeSidebarSection}
            onSectionChange={handleSidebarSectionChange}
          />
        </div>

        {/* Main Content */}
        <main className="bg-white overflow-hidden flex-1">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Global Error */}
          {error && (
            <ErrorMessage 
              message={error.message}
              className="m-4"
            />
          )}

          {/* Update Error */}
          {updateError && (
            <ErrorMessage 
              message={updateError.message}
              className="m-4"
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
                  imagesByDetailId={imagesByDetailId}
                  onBack={() => {
                    setActiveSidebarSection('order-info');
                    // keep selected order or clear depending on UX; clear to avoid stale breadcrumb
                    setSelectedOrder(null);
                  }}
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
          {/* TODO: add other sections (membership-info, order-info, etc) */}
        </main>
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
    </div>
  );
};
