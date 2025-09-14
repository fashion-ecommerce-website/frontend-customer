import { ProductDetail } from '@/services/api/productApi';

// Mock product data for testing
export const mockProductData: ProductDetail = {
  id: 1,
  productTitle: "MLB - Unisex round neck short sleeve t-shirt with logo",
  productSlug: "mlb-unisex-round-neck-short-sleeve-tshirt-logo",
  price: 2290000,
  originalPrice: 2590000,
  colors: ["Beige", "Navy"],
  sizes: ["XS", "S", "M", "L", "XL"],
  imageUrls: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
  ],
  description: "Unisex sporty t-shirt with signature MLB logo",
  features: [
    "Classic round neck t-shirt with sporty design",
    "Handcrafted MLB logo on chest for authentic look", 
    "Cotton material, breathable and comfortable for active wear",
    "Fine stitching, durable and beautiful",
    "Perfect for casual photos and sport chic style"
  ],
  specifications: [
    "Brand: MLB",
    "Origin: South Korea", 
    "Type: Unisex",
    "Colors: Beige, Navy",
    "Style: Sporty chic",
    "Composition: 74% Cotton, 20% Polyester, 6% Spandex"
  ],
  category: "ao-thun",
  isInStock: true,
  quantity: 50,
  styleCode: "3ATSM90954"
};