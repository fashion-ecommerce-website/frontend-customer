// Profile Feature Barrel Export
// Self-contained profile module exports

// Export containers
export { ProfileContainer } from './containers/ProfileContainer';

// Export components
export { ProfilePresenter } from './components/ProfilePresenter';

// Export states
export { ProfileCallState } from './states/ProfileCallState';

// Export redux
export { 
  profileReducer,
  getProfileRequest,
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
  selectUser,
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
  ProfileCallStateProps,
} from './types/profile.types';

// Default export
export { ProfileContainer as default } from './containers/ProfileContainer';
