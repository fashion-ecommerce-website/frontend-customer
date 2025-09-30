/**
 * Order-related types and interfaces
 */

// Order status enum
export enum OrderStatus {
  UNFULFILLED = 'UNFULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

// Payment status enum
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

// Payment method enum
export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  E_WALLET = 'E_WALLET'
}

// Shipping address interface
export interface ShippingAddress {
  id: number;
  fullName: string;
  phone: string;
  line: string;
  ward: string;
  city: string;
  countryCode: string;
}

// Order detail interface
export interface OrderDetail {
  id: number;
  productDetailId: number;
  title: string;
  colorLabel: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

// Payment interface
export interface Payment {
  id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  provider: string | null;
  transactionNo: string | null;
  paidAt: string | null;
  createdAt: string;
}

// Shipment interface
export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

// Complete order interface
export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  userUsername: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  note: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  orderDetails: OrderDetail[];
  payments: Payment[];
  shipments: Shipment[];
}

// Create order request interface
export interface CreateOrderRequest {
  shippingAddressId: number;
  note: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderDetails: {
    productDetailId: number;
    quantity: number;
  }[];
}

// Order summary interface for UI
export interface OrderSummary {
  products: {
    detailId: number;
    productTitle: string;
    price: number;
    quantity: number;
    colorName: string;
    imageUrls: string[];
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  note: string;
}
