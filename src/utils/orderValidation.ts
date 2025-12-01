import { Address } from '@/services/api/addressApi';

/**
 * Order validation utilities
 */

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates if an address is suitable for order creation
 */
export const validateAddressForOrder = (address: Address | null): OrderValidationResult => {
  const errors: string[] = [];

  if (!address) {
    errors.push('Please select a shipping address');
    return { isValid: false, errors };
  }

  if (!address.id) {
    errors.push('Selected address is invalid - missing ID');
  }

  if (!address.fullName?.trim()) {
    errors.push('Address must have a recipient name');
  }

  if (!address.phone?.trim()) {
    errors.push('Address must have a phone number');
  }

  if (!address.line?.trim()) {
    errors.push('Address must have a street address');
  }

  if (!address.ward?.trim()) {
    errors.push('Address must have a ward');
  }

  if (!address.city?.trim()) {
    errors.push('Address must have a city');
  }

  if (!address.countryCode?.trim()) {
    errors.push('Address must have a country code');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates order data before submission
 */
export const validateOrderData = (orderData: {
  shippingAddressId?: number;
  products: unknown[];
  subtotalAmount: number;
  totalAmount: number;
}): OrderValidationResult => {
  const errors: string[] = [];

  if (!orderData.shippingAddressId) {
    errors.push('Please select a shipping address');
  }

  if (!orderData.products || orderData.products.length === 0) {
    errors.push('Your cart is empty');
  }

  if (orderData.subtotalAmount <= 0) {
    errors.push('Order total must be greater than zero');
  }

  if (orderData.totalAmount <= 0) {
    errors.push('Order total must be greater than zero');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
