export { ProfileContainer } from './containers/ProfileContainer';

export { ProfilePresenter } from './components/ProfilePresenter';
export { ProfileSidebar } from './components/ProfileSidebar';
export { ProfileFormSection } from './components/ProfileFormSection';
export { PasswordChangeModal } from './components/PasswordChangeModal';
export { UpdateInfoModal } from './components/UpdateInfoModal';

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
} from './types/profile.types';

// Default export
export { ProfileContainer as default } from './containers/ProfileContainer';
