import { ProductItem } from '@/services/api/productApi';

// Mock data for order products - represents items in a shopping cart/order
export const mockOrderProducts: ProductItem[] = [
  {
    detailId: 1,
    productTitle: "MLB - Unisex Round Neck Short Sleeve Classic Monogram T-Shirt",
    productSlug: "mlb-unisex-round-neck-short-sleeve-classic-monogram-t-shirt",
    price: 1150000,
    finalPrice: 1035000, // 10% off
    percentOff: 10,
    promotionId: 1,
    promotionName: "Summer Sale",
    quantity: 1,
    colors: ["Beige", "Navy", "Black", "White"],
    colorName: "Beige",
    sizeName: "M",
    imageUrls: [
      "https://product.hstatic.net/200000642007/product/50bks_3atsm0134_1_e93f4e72c74b45f180d3463c93c7bc71_6c3289e9674042a589a61a43592da23d_grande.jpg"
    ]
  },
  {
    detailId: 2,
    productTitle: "MLB - Unisex Varsity Stripe Overfit Polo Shirt",
    productSlug: "mlb-unisex-varsity-stripe-overfit-polo-shirt",
    price: 2490000,
    finalPrice: 1992000, // 20% off
    percentOff: 20,
    promotionId: 2,
    promotionName: "Black Friday",
    quantity: 2,
    colors: ["Navy", "White", "Black"],
    colorName: "Navy",
    sizeName: "L",
    imageUrls: [
      "https://product.hstatic.net/200000642007/product/50bks_3atsm0134_1_e93f4e72c74b45f180d3463c93c7bc71_6c3289e9674042a589a61a43592da23d_grande.jpg"
    ]
  },
  {
    detailId: 3,
    productTitle: "MLB - Unisex Classic Logo Hoodie",
    productSlug: "mlb-unisex-classic-logo-hoodie",
    price: 3200000,
    finalPrice: 3200000, // No promotion
    quantity: 1,
    colors: ["Black", "Navy", "Gray"],
    colorName: "Black",
    sizeName: "XL",
    imageUrls: [
      "https://product.hstatic.net/200000642007/product/43nys_3apqv0253_1_cba04481b9c34700969a1daeb5d1ce84_58fa4983f70a4ed78e19d71efac0d7f1_grande.jpg"
    ]
  },

];

// Mock data for different order scenarios
export const mockOrderScenarios = {
  // Small order with 2 items
  smallOrder: mockOrderProducts.slice(0, 2),
  
  // Medium order with 4 items
  mediumOrder: mockOrderProducts.slice(0, 4),
  
  // Large order with all items
  largeOrder: mockOrderProducts,
  
  // Single item order
  singleItem: [mockOrderProducts[0]],
  
  // High quantity order
  bulkOrder: mockOrderProducts.map(item => ({
    ...item,
    quantity: Math.floor(Math.random() * 5) + 1 // Random quantity 1-5
  }))
};

// Helper function to calculate order totals with promotion support
export const calculateOrderTotals = (products: ProductItem[]) => {
  const subtotal = products.reduce((total, product) => {
    // Use finalPrice if available (after promotion), otherwise use original price
    const effectivePrice = product.finalPrice ?? product.price;
    return total + (effectivePrice * product.quantity);
  }, 0);
  
  // Calculate total original price (before promotion) for comparison
  const originalSubtotal = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  // Calculate total discount from promotions
  const promotionDiscount = originalSubtotal - subtotal;
  
  const shippingFee = 50000; // Fixed shipping fee
  const total = subtotal + shippingFee;
  
  return {
    subtotal,
    originalSubtotal,
    promotionDiscount,
    shippingFee,
    total,
    itemCount: products.reduce((count, product) => count + product.quantity, 0)
  };
};

// Mock order summary data
export const mockOrderSummary = {
  products: mockOrderProducts,
  totals: calculateOrderTotals(mockOrderProducts),
  shippingAddress: {
    fullName: "Nguyen Van A",
    phone: "0123456789",
    line: "123 Nguyen Hue Street",
    ward: "Ben Nghe Ward",
    city: "Ho Chi Minh City"
  },
  paymentMethod: "Credit Card",
  orderDate: new Date().toISOString(),
  orderId: "ORD-2024-001"
};
