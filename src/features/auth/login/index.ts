// Login Feature Barrel Export
// Self-contained login module exports

// Export containers
export { LoginContainer } from './containers/LoginContainer';

// Export components
export { LoginPresenter } from './components/LoginPresenter';

// Export states
export { LoginCallState } from './states/LoginCallState';

// Export redux
export { 
  loginReducer,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setLoading,
  clearError,
  clearState,
  setTokens,
  clearTokens,
  loginActionCreators,
  selectLoginState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
  selectRefreshToken,
} from './redux/loginSlice';

export { loginSaga } from './redux/loginSaga';

// Export types
export type {
  User,
  LoginRequest,
  LoginResponse,
  ApiError,
  LoginState,
  LoginFormData,
  LoginContainerProps,
  LoginPresenterProps,
  LoginCallStateProps,
} from './types/login.types';

// Default export
export { LoginContainer as default } from './containers/LoginContainer';
