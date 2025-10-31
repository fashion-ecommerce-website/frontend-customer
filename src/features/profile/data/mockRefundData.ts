/**
 * Mock Refund Data
 * Mock data for refund feature - replace with real API calls
 */

import { RefundItem } from '../types/refund.types';

export const mockRefunds: RefundItem[] = [
  {
    id: 1,
    orderId: 12345,
    productName: 'MLB - Unisex Round Neck Short Sleeve Baseball Logo T-Shirt',
    productImage: 'https://product.hstatic.net/200000642007/product/50bks_3atsb1843_2_882287d03667488e9b954278fc4ebdf9_8ac60b71eebc4970930d8f43916438c2_master.jpg',
    colorLabel: 'White',
    sizeLabel: 'M',
    quantity: 1,
    refundAmount: 250000,
    reason: 'Product damaged',
    status: 'pending',
    requestedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 2,
    orderId: 12344,
    productName: 'Áo Thun Local Brand - Unisex Basic Cotton T-Shirt',
    productImage: 'https://product.hstatic.net/200000642007/product/50bks_3atsb1843_2_882287d03667488e9b954278fc4ebdf9_8ac60b71eebc4970930d8f43916438c2_master.jpg',
    colorLabel: 'Black',
    sizeLabel: 'L',
    quantity: 1,
    refundAmount: 450000,
    reason: 'Wrong size received',
    status: 'approved',
    requestedAt: '2024-10-20T14:15:00Z',
    updatedAt: '2024-10-21T09:00:00Z',
    note: 'Refund approved. Amount will be credited within 5-7 business days.',
  }
];

// Export filtered data by status
export const getPendingRefunds = (): RefundItem[] => 
  mockRefunds.filter(r => r.status === 'pending');

export const getApprovedRefunds = (): RefundItem[] => 
  mockRefunds.filter(r => r.status === 'approved');

export const getRejectedRefunds = (): RefundItem[] => 
  mockRefunds.filter(r => r.status === 'rejected');

export const getCompletedRefunds = (): RefundItem[] => 
  mockRefunds.filter(r => r.status === 'completed');
