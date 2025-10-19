// Home Feature Barrel Export
// Self-contained home module exports

// Export containers
export { HomeContainer } from './containers/HomeContainer';

// Export components
export { HomePresenter } from './components/HomePresenter';
export { RankingSection } from './components/RankingSection';
export * from './components/Icons';

// Export states
export { HomeCallState } from './states/HomeCallState';

// Export redux
export { 
  homeReducer,
  setActiveNavigation,
  toggleMenu,
  closeMenu,
  updateSearch,
  setSearching,
  submitSearch,
  submitSearchSuccess,
  submitSearchFailure,
  clearSearch,
  setLoading,
  setError,
  clearError,
  initializeHome,
  initializeHomeSuccess,
  initializeHomeFailure,
  resetHomeState,
  homeActionCreators,
  selectHomeState,
  selectNavigation,
  selectSearch,
  selectFooter,
  selectIsLoading,
  selectError,
  selectIsInitialized,
} from './redux/homeSlice';

export { homeSaga } from './redux/homeSaga';

// Export types
export type {
  NavigationItem,
  NavigationState,
  SearchState,
  SearchRequest,
  SearchFilters,
  FooterLink,
  FooterSection,
  SocialLink,
  PaymentMethod,
  FooterData,
  HomeState,
  ApiError,
  HomeContainerProps,
  HomePresenterProps,
  HomeCallStateProps,
  SetActiveNavigationAction,
  ToggleMenuAction,
  UpdateSearchAction,
  SubmitSearchAction,
  ClearSearchAction,
  SetLoadingAction,
  SetErrorAction,
  ClearErrorAction,
  InitializeHomeAction,
  InitializeHomeSuccessAction,
  InitializeHomeFailureAction,
  HomeAction,
} from './types/home.types';

// Default export
export { HomeContainer as default } from './containers/HomeContainer';
