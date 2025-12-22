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
  exclusiveDeals: string;
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

export interface AboutTranslations {
  title: string;
  subtitle: string;
  missionTitle: string;
  missionText1: string;
  missionText2: string;
  featuresTitle: string;
  chatbotTitle: string;
  chatbotDesc: string;
  virtualTryOnTitle: string;
  virtualTryOnDesc: string;
  personalizedTitle: string;
  personalizedDesc: string;
  contactTitle: string;
  contactDesc: string;
}

export interface SupportTranslations {
  title: string;
  subtitle: string;
  hotline: string;
  hotlineHours: string;
  email: string;
  emailResponse: string;
  faqTitle: string;
  faqDesc: string;
  viewFaq: string;
}

export interface TermsTranslations {
  title: string;
  subtitle: string;
  section1Title: string;
  section1Content: string[];
  section2Title: string;
  section2Content: string[];
  section3Title: string;
  section3Content: string[];
  section4Title: string;
  section4Content: string[];
  section5Title: string;
  section5Content: string[];
  section6Title: string;
  section6Content: string[];
  section7Title: string;
  section7Content: string[];
  section8Title: string;
  section8Content: string[];
  section9Title: string;
  section9Content: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQTranslations {
  title: string;
  subtitle: string;
  categoryLabel: string;
  notFoundTitle: string;
  notFoundDesc: string;
  contactSupport: string;
  loading: string;
  categories: {
    account: string;
    order: string;
    payment: string;
    shipping: string;
    return: string;
    size: string;
  };
  account: FAQItem[];
  order: FAQItem[];
  payment: FAQItem[];
  shipping: FAQItem[];
  return: FAQItem[];
  size: FAQItem[];
}

export interface PrivacyTranslations {
  title: string;
  subtitle: string;
  section1Title: string;
  section1Content: string[];
  section2Title: string;
  section2Content: string[];
  section3Title: string;
  section3Content: string[];
  section4Title: string;
  section4Content: string[];
}

export interface ChatBotTranslations {
  title: string;
  online: string;
  welcomeMessage: string;
  placeholder: string;
  clearChat: string;
  errorMessage: string;
  suggestedQuestions: string[];
}

export interface FilterProductTranslations {
  filters: string;
  sortBy: string;
  sortNameAZ: string;
  sortNameZA: string;
  sortPriceLowHigh: string;
  sortPriceHighLow: string;
  colors: string;
  sizes: string;
  price: string;
  allPrices: string;
  under1m: string;
  from1to2m: string;
  from2to3m: string;
  over3m: string;
  selectedFilters: string;
  clearAll: string;
  showingProducts: string;
  noProductsFound: string;
}

export interface ReviewTranslations {
  title: string;
  reviewsCount: string;
  outOf: string;
  reviews: string;
  filter: string;
  all: string;
  stars: string;
  star: string;
  sort: string;
  newestFirst: string;
  oldestFirst: string;
  loadingReviews: string;
  noReviewsYet: string;
  beFirstToReview: string;
  emptyHere: string;
  tryAdjustFilter: string;
  verifiedPurchase: string;
  color: string;
  size: string;
  viewMoreReviews: string;
  showLess: string;
}

export interface OrderModalTranslations {
  // Modal header
  buyNow: string;
  order: string;
  // Address form
  deliveryAddress: string;
  addressCount: string;
  addressCountPlural: string;
  loadingAddress: string;
  errorLoadingAddresses: string;
  default: string;
  selectAddress: string;
  noAddressAvailable: string;
  addNew: string;
  // Payment methods
  paymentMethods: string;
  stripe: string;
  stripeDesc: string;
  cashOnDelivery: string;
  codDesc: string;
  // Order summary
  orderSummary: string;
  item: string;
  items: string;
  voucher: string;
  changeVoucher: string;
  selectVoucher: string;
  removeVoucher: string;
  loyalCustomers: string;
  subtotal: string;
  voucherDiscount: string;
  shippingFee: string;
  calculating: string;
  error: string;
  selectAddressToCalculate: string;
  totalPayment: string;
  back: string;
  processing: string;
  selectAddressBtn: string;
  completeOrder: string;
  quantity: string;
  // Voucher modal
  searchVoucher: string;
  enterVoucherCode: string;
  searching: string;
  search: string;
  searchResults: string;
  showAllVouchers: string;
  noVouchersFound: string;
  noVouchersAvailable: string;
  available: string;
  notEligible: string;
  unavailable: string;
  code: string;
  minOrder: string;
  maxDiscount: string;
  starts: string;
  expires: string;
  apply: string;
  close: string;
  // Checkout success page
  orderSuccessTitle: string;
  paymentSuccessTitle: string;
  paymentCanceledTitle: string;
  orderSuccessDesc: string;
  paymentSuccessDesc: string;
  paymentCanceledDesc: string;
  viewOrder: string;
  payAgain: string;
  continueShopping: string;
  emailConfirmation: string;
  loading: string;
}

export interface AddressModalTranslations {
  // Address list modal
  selectDeliveryAddress: string;
  noAddressesFound: string;
  pleaseAddAddress: string;
  addNewAddress: string;
  selected: string;
  editAddress: string;
  deleteAddress: string;
  cannotDeleteDefault: string;
  cannotDeleteDefaultMsg: string;
  deleteAddressConfirm: string;
  areYouSureDelete: string;
  deleteFailed: string;
  errorOccurred: string;
  confirm: string;
  cancel: string;
  // Address form modal
  updateShippingAddress: string;
  addShippingAddress: string;
  fullName: string;
  fullNameRequired: string;
  enterFullName: string;
  phone: string;
  phoneRequired: string;
  phoneInvalid: string;
  phoneLengthVN: string;
  phoneLengthIntl: string;
  phoneHintVN: string;
  addressLine: string;
  addressLineRequired: string;
  addressLinePlaceholder: string;
  provinceCity: string;
  provinceRequired: string;
  searchProvince: string;
  noProvinceFound: string;
  district: string;
  districtRequired: string;
  searchDistrict: string;
  noDistrictFound: string;
  ward: string;
  wardRequired: string;
  searchWard: string;
  noWardFound: string;
  setAsDefault: string;
  updating: string;
  adding: string;
  updateAddress: string;
  addAddress: string;
}

export interface MyReviewTranslations {
  title: string;
  reviewsCount: string;
  rating: string;
  comment: string;
  commentPlaceholder: string;
  saving: string;
  save: string;
  cancel: string;
  edit: string;
  verified: string;
  color: string;
  size: string;
  noReviewsStored: string;
  startReviewing: string;
  reviewUpdated: string;
  reviewDeleted: string;
}

export interface OrderHistoryTranslations {
  // Actions
  reload: string;
  show: string;
  hide: string;
  details: string;
  track: string;
  payAgain: string;
  refund: string;
  review: string;
  // Status
  shipping: string;
  total: string;
  quantity: string;
  // Empty state
  noOrdersYet: string;
  // Order detail page
  orderProductInfo: string;
  backToOrderHistory: string;
  totalAmount: string;
  productPrice: string;
  shippingFee: string;
  promotionDiscount: string;
  billingAddress: string;
  shippingAddress: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  name: string;
  phoneNumber: string;
  address: string;
  country: string;
  // Payment methods
  cashOnDelivery: string;
  creditCard: string;
  unknown: string;
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
  // Register validation
  phoneRequired: string;
  phoneInvalid: string;
  usernameRequired: string;
  usernameMinLength: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  confirmPasswordRequired: string;
  passwordsNotMatch: string;
  creatingAccount: string;
  signIn: string;
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
  // Quick view modal
  addingToCart: string;
  buyNow: string;
  pleaseSelectSize: string;
  sizeOutOfStock: string;
  unableToLoadImage: string;
  unableToLoadProduct: string;
  onlyXAvailable: string;
  sizeGuide: string;
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
  tryOnTitle: string;
  tryOnDesc: string;
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
  about: AboutTranslations;
  support: SupportTranslations;
  terms: TermsTranslations;
  faq: FAQTranslations;
  privacy: PrivacyTranslations;
  chatBot: ChatBotTranslations;
  filterProduct: FilterProductTranslations;
  review: ReviewTranslations;
  orderModal: OrderModalTranslations;
  addressModal: AddressModalTranslations;
  myReview: MyReviewTranslations;
  orderHistory: OrderHistoryTranslations;
}

export default Translations;
