export type Lang = 'en' | 'vi';

export interface VirtualTryOnTranslations {
  title: string;
  previewTitle: string;
  previewDescription: string;
  bullets: string[];
  upgradeButton: string;
  backButton: string;
  upgradeNote: string;
  selectProduct: string;
  uploadImage: string;
  yourLook: string;
  generatedForYou: string;
  productDetails: string;
  tryOnNow: string;
  selectTShirt: string;
  selectShirt: string;
  removeProduct: string;
  noProductSelected: string;
  noImageSelected: string;
  processingStatus: string;
  completedStatus: string;
  viewDetails: string;
  activeStatus: string;
}

export interface PromotionalBannerTranslations {
  signUpDiscount: string;
  signUpAction: string;
  freeShipping: string;
  newArrivals: string;
  shopNow: string;
  exclusiveDeals: string;
  viewDeals: string;
  easyReturns: string;
}

export interface HomeTranslations {
  ranking: string;
  recommendForYou: string;
  newArrivals: string;
  recentlyViewed: string;
  similarProducts: string;
  youMayAlsoLike: string;
  viewAll: string;
  shopNow: string;
  noProductsFound: string;
  loadingProducts: string;
}

export interface CommonTranslations {
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  confirm: string;
  close: string;
  submit: string;
  search: string;
  filter: string;
  sort: string;
  viewAll: string;
  learnMore: string;
  welcome: string;
  processing: string;
  completed: string;
  home: string;
  back: string;
  next: string;
  prev: string;
  remove: string;
  select: string;
  change: string;
}

export interface HeaderTranslations {
  menu: string;
  search: string;
  cart: string;
  wishlist: string;
  profile: string;
  login: string;
  logout: string;
  myProfile: string;
  myOrders: string;
  signOut: string;
  switchLanguage: string;
  sale: string;
  shop: string;
}

export interface FooterTranslations {
  company: string;
  help: string;
  faq: string;
  moreInfo: string;
  description: string;
  copyright: string;
  aboutUs: string;
  features: string;
  works: string;
  career: string;
  customerSupport: string;
  deliveryDetails: string;
  termsConditions: string;
  privacyPolicy: string;
  stayUpToDate: string;
  emailPlaceholder: string;
  subscribeNewsletter: string;
  paymentMethods: string;
}

export interface AuthTranslations {
  login: string;
  register: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  forgotPassword: string;
  rememberMe: string;
  loginButton: string;
  registerButton: string;
  loggingIn: string;
  registering: string;
  signingIn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  signInWith: string;
  orContinueWith: string;
  loginWith: string;
  loginWithGoogle: string;
  welcomeMessage: string;
  journeyStarts: string;
}

export interface ProductTranslations {
  products: string;
  product: string;
  addToCart: string;
  addToWishlist: string;
  removeFromWishlist: string;
  size: string;
  color: string;
  quantity: string;
  price: string;
  description: string;
  details: string;
  reviews: string;
  relatedProducts: string;
  outOfStock: string;
  inStock: string;
  newArrival: string;
  sale: string;
  discount: string;
  selectSize: string;
  selectColor: string;
  quickView: string;
  viewProduct: string;
  similarProducts: string;
  youMayAlsoLike: string;
  recentlyViewed: string;
  noProductsFound: string;
  loadingProducts: string;
  tabs: {
    information: string;
    productCare: string;
    exchangeReturn: string;
  };
  careItems: string[];
  exchange: {
    applicability: string;
    returnExchangePeriodLabel: string;
    exchangeText: string;
    returnText: string;
    notesTitle: string;
    note1: string;
    note2: string;
    remarkTitle: string;
    remarkBody: string;
  };
}

export interface CartTranslations {
  cart: string;
  emptyCart: string;
  addToCartPrompt: string;
  continueShopping: string;
  checkout: string;
  subtotal: string;
  shipping: string;
  total: string;
  remove: string;
  update: string;
  apply: string;
  couponCode: string;
  cartItems: string;
  orderInformation: string;
  notes: string;
  enterOrderNotes: string;
  issueInvoice: string;
}

export interface CheckoutTranslations {
  checkout: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  orderSummary: string;
  placeOrder: string;
  processingOrder: string;
  orderSuccess: string;
  orderFailed: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface ProfileTranslations {
  profile: string;
  personalInfo: string;
  orderHistory: string;
  wishlist: string;
  settings: string;
  editProfile: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  saveChanges: string;
  orderDetails: string;
  orderDate: string;
  orderStatus: string;
  trackOrder: string;
  // Sidebar sections
  membershipTier: string;
  orderInfo: string;
  orderTracking: string;
  myRefund: string;
  recentlyViewed: string;
  myReviews: string;
  myVouchers: string;
  vouchers: string;
  shippingAddress: string;
  myInfo: string;
  logout: string;
  deleteAccount: string;
  // Profile page
  account: string;
  clearAll: string;
  edit: string;
  cancel: string;
  areYouSureClearAll: string;
  areYouSureDeleteSelected: string;
  itemsSelected: string;
  addressesHeader?: string;
  loadingAddresses?: string;
  noAddressesFound?: string;
  addShippingAddress?: string;
  tryAgain?: string;
  defaultLabel?: string;
  phoneNotProvided?: string;
  update?: string;
  // Additional optional strings used in profile subcomponents
  voucherHeader?: string;
  searchVouchers?: string;
  statusLabel?: string;
  statusOptions_all?: string;
  statusOptions_available?: string;
  statusOptions_unavailable?: string;
  noVouchersAvailable?: string;
  refreshVouchers?: string;
  noVouchersFound?: string;
  tryAdjustFilters?: string;
  clearFilters?: string;
  codeLabel?: string;
  minOrderLabel?: string;
  maxDiscountLabel?: string;
  startsLabel?: string;
  expiresLabel?: string;
  readyToUse?: string;
  notAvailable?: string;
  copyCode?: string;
  copied?: string;
  copiedShort?: string;
  copy?: string;
  noWishlistStored?: string;
  browseRecommendedProducts?: string;
  noWishlistFound?: string;
  updateInformationTitle?: string;
  nameLabel?: string;
  dateOfBirthLabel?: string;
  phoneNumberLabel?: string;
  updating?: string;
  updateButton?: string;
  accountLoginHeader?: string;
  usernameLabel?: string;
  changePasswordButton?: string;
  accountHeader?: string;
  birthdayLabel?: string;
  phoneLabel?: string;
  updateInformationButton?: string;
  emailLabel?: string;
}

export interface MessageTranslations {
  success: string;
  error: string;
  warning: string;
  info: string;
  addedToCart: string;
  addedToWishlist: string;
  removedFromWishlist: string;
  loginSuccess: string;
  loginFailed: string;
  registerSuccess: string;
  registerFailed: string;
  updateSuccess: string;
  updateFailed: string;
  deleteSuccess: string;
  deleteFailed: string;
  requiredField: string;
  invalidEmail: string;
  passwordMismatch: string;
}

export interface Translations {
  common: CommonTranslations;
  header: HeaderTranslations;
  footer: FooterTranslations;
  auth: AuthTranslations;
  product: ProductTranslations;
  cart: CartTranslations;
  checkout: CheckoutTranslations;
  profile: ProfileTranslations;
  message: MessageTranslations;
  virtualTryOn: VirtualTryOnTranslations;
  promotionalBanner: PromotionalBannerTranslations;
  home: HomeTranslations;
}

export default Translations;
