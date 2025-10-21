export { ProfileContainer } from './containers/ProfileContainer';
export { ReviewContainer } from './containers/ReviewContainer';

export { ProfilePresenter } from './components/ProfilePresenter';
export { ProfileSidebar } from './components/ProfileSidebar';
export { ProfileFormSection } from './components/ProfileFormSection';
export { PasswordChangeModal } from './components/PasswordChangeModal';
export { UpdateInfoModal } from './components/UpdateInfoModal';
export { AddressSection } from './components/AddressSection';
export { AddressModal } from './components/AddressModal';
export { ReviewPresenter } from './components/ReviewPresenter';

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

// Default export
export { ProfileContainer as default } from './containers/ProfileContainer';
