export { ProfileContainer } from './containers/ProfileContainer';
export { ReviewContainer } from './containers/ReviewContainer';
export { RefundContainer } from './containers/RefundContainer';

export { ProfilePresenter } from './components/ProfilePresenter';
export { ProfileSidebar } from './components/ProfileSidebar';
export { ProfileFormSection } from './components/ProfileFormSection';
export { PasswordChangeModal } from './components/PasswordChangeModal';
export { UpdateInfoModal } from './components/UpdateInfoModal';
export { AddressSection } from './components/AddressSection';
export { AddressModal } from './components/AddressModal';
export { ReviewPresenter } from './components/ReviewPresenter';
export { RefundPresenter } from './components/RefundPresenter';

export { useFormValidation, useProfileValidation, usePasswordValidation } from './hooks/useValidation';


export { 
  profileReducer,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  setLoading,
  clearError,
  clearUpdateError,
  clearPasswordError,
  clearSuccess,
  clearState,
  profileActionCreators,
  selectProfileState,
  selectIsLoading,
  selectIsUpdating,
  selectIsChangingPassword,
  selectError,
  selectUpdateError,
  selectPasswordError,
  selectUpdateSuccess,
  selectPasswordChangeSuccess,
} from './redux/profileSlice';

export { profileSaga } from './redux/profileSaga';
export { reviewSaga } from './redux/reviewSaga';

// Export mock data (same pattern as home feature)
export { mockRefunds, getPendingRefunds, getApprovedRefunds, getRejectedRefunds, getCompletedRefunds } from './data/mockRefundData';

// Export types
export type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ProfileResponse,
  ApiError,
  ProfileState,
  ProfileFormData,
  ChangePasswordFormData,
  ProfileContainerProps,
  ProfilePresenterProps,
  Review,
  ReviewFormData,
  ReviewState,
  ReviewPresenterProps,
  ReviewContainerProps,
} from './types/profile.types';

export type {
  RefundItem,
  RefundQueryParams,
  RefundPresenterProps,
  RefundContainerProps,
} from './types/refund.types';

// Default export
export { ProfileContainer as default } from './containers/ProfileContainer';
