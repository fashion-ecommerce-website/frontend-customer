import { ProductDetail } from '@/services/api/productApi';

// Mock product data for testing - matches new API response format
export const mockProductData: ProductDetail = {
  detailId: 1,
  productId: 1,
  title: "MLB - Unisex round neck short sleeve t-shirt with logo",
  price: 2290000,
  finalPrice: 2290000,
  activeColor: "Beige",
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500",
    "https://images.unsplash.com/photo-1571455786673-1d0cd8d95041?w=500",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
    "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500",
  ],
  colors: ["Beige", "Navy", "Black", "White"],
  mapSizeToQuantity: {
    "XS": 5,
    "S": 12,
    "M": 8,
    "L": 15,
    "XL": 10
  },
  description: [
    "Classic round neck t-shirt with sporty design",
    "Handcrafted MLB logo on chest for authentic look", 
    "Cotton material, breathable and comfortable for active wear",
    "Fine stitching, durable and beautiful",
    "Perfect for casual photos and sport chic style"
  ]
};

// Mock data for different color variants with MLB-style structure
export const mockProductVariants: Record<string, ProductDetail> = {
  "Beige": {
    ...mockProductData,
    detailId: 1050170869, // Unique product ID like MLB
    productId: 1,
    finalPrice: 2290000,
    activeColor: "Beige",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500",
      "https://images.unsplash.com/photo-1571455786673-1d0cd8d95041?w=500",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500",
    ]
  },
  "Navy": {
    ...mockProductData,
    detailId: 1050170919, // Unique product ID like MLB
    productId: 1,
    finalPrice: 2290000,
    activeColor: "Navy",
    mapSizeToQuantity: {
      "XS": 0,  // Out of stock
      "S": 8,
      "M": 12,
      "L": 0,   // Out of stock
      "XL": 15
    },
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&sat=-100",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
      "https://images.unsplash.com/photo-1571455786673-1d0cd8d95041?w=500&sat=-100",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&sat=-100",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500&sat=-100",
    ]
  },
  "Black": {
    ...mockProductData,
    detailId: 1050170920, // Unique product ID like MLB
    productId: 1,
    finalPrice: 2290000,
    activeColor: "Black",
    mapSizeToQuantity: {
      "XS": 3,
      "S": 0,   // Out of stock
      "M": 5,
      "L": 8,
      "XL": 0   // Out of stock
    },
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500&sat=-100",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&sat=-100",
      "https://images.unsplash.com/photo-1571455786673-1d0cd8d95041?w=500&sat=-100",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&sat=-100",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&sat=-100",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&sat=-100",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&sat=-100",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500&sat=-100",
    ]
  },
  "White": {
    ...mockProductData,
    detailId: 1050170921, // Unique product ID like MLB
    productId: 1,
    finalPrice: 2290000,
    activeColor: "White",
    mapSizeToQuantity: {
      "XS": 12,
      "S": 20,
      "M": 0,   // Out of stock
      "L": 18,
      "XL": 25
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1571455786673-1d0cd8d95041?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&brightness=1.2",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500&brightness=1.2",
    ]
  }
};

// Mock API function to simulate color change
export const mockFetchProductByColor = async (productId: number, color: string): Promise<ProductDetail> => {
  // Simulate API delay - Reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const variant = mockProductVariants[color];
  if (!variant) {
    throw new Error(`Color variant '${color}' not found`);
  }
  
  return variant;
};