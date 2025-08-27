// Home Feature Types
// TypeScript definitions for home page components and state

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
}

export interface NavigationState {
  items: NavigationItem[];
  activeItem: string | null;
  isMenuOpen: boolean;
}

// Search Types
export interface SearchState {
  query: string;
  isSearching: boolean;
  suggestions: string[];
  recentSearches: string[];
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
}

export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  brand?: string;
  size?: string;
  color?: string;
}

// Footer Types
export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface FooterData {
  sections: FooterSection[];
  socialLinks: SocialLink[];
  paymentMethods: PaymentMethod[];
  companyInfo: {
    name: string;
    description: string;
    copyright: string;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link: string;
  buttonText?: string;
  type: 'hero' | 'promotion' | 'sale';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

// Home Page State
export interface HomeState {
  navigation: NavigationState;
  search: SearchState;
  footer: FooterData;
  banners: Banner[];
  newArrivals: Product[];
  recommendedProducts: Product[];
  productCategories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Component Props Types
export interface HomeContainerProps {
  className?: string;
}

export interface HomePresenterProps {
  banners: Banner[];
  newArrivals: Product[];
  recommendedProducts: Product[];
  productCategories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  onProductClick: (productId: string) => void;
  onCategoryClick: (categoryId: string) => void;
  onBannerClick: (bannerId: string) => void;
}

export interface HomeCallStateProps {
  children: (props: {
    navigation: NavigationState;
    search: SearchState;
    footer: FooterData;
    banners: Banner[];
    newArrivals: Product[];
    recommendedProducts: Product[];
    productCategories: ProductCategory[];
    isLoading: boolean;
    error: string | null;
    setActiveNavigation: (itemId: string) => void;
    toggleMenu: () => void;
    updateSearch: (query: string) => void;
    submitSearch: (query: string) => void;
    clearSearch: () => void;
    clearError: () => void;
    initializeHome: () => void;
    selectProduct: (productId: string) => void;
    selectCategory: (categoryId: string) => void;
    selectBanner: (bannerId: string) => void;
  }) => React.ReactNode;
}

// Action Types
export interface SetActiveNavigationAction {
  type: 'home/setActiveNavigation';
  payload: string;
}

export interface ToggleMenuAction {
  type: 'home/toggleMenu';
}

export interface UpdateSearchAction {
  type: 'home/updateSearch';
  payload: string;
}

export interface SubmitSearchAction {
  type: 'home/submitSearch';
  payload: SearchRequest;
}

export interface ClearSearchAction {
  type: 'home/clearSearch';
}

export interface SetLoadingAction {
  type: 'home/setLoading';
  payload: boolean;
}

export interface SetErrorAction {
  type: 'home/setError';
  payload: string | null;
}

export interface ClearErrorAction {
  type: 'home/clearError';
}

export interface InitializeHomeAction {
  type: 'home/initializeHome';
}

export interface InitializeHomeSuccessAction {
  type: 'home/initializeHomeSuccess';
  payload: {
    navigation: NavigationItem[];
    footer: FooterData;
  };
}

export interface InitializeHomeFailureAction {
  type: 'home/initializeHomeFailure';
  payload: ApiError;
}

// Union type for all actions
export type HomeAction = 
  | SetActiveNavigationAction
  | ToggleMenuAction
  | UpdateSearchAction
  | SubmitSearchAction
  | ClearSearchAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | InitializeHomeAction
  | InitializeHomeSuccessAction
  | InitializeHomeFailureAction;
