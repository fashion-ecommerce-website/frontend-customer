import { Banner, Product, ProductCategory } from '../types/home.types';

// Mock Banners
export const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'FASHION SALE',
    subtitle: 'THỜI TRANG ƯU ĐÃI',
    description: 'GIẢM GIÁ ĐẾN 50%',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    link: '/sale',
    buttonText: 'Mua ngay',
    type: 'hero',
    isActive: true,
  },
  {
    id: '2',
    title: 'NEW COLLECTION',
    subtitle: 'BỘ SƯU TẬP MỚI',
    description: 'PHONG CÁCH 2025',
    image: 'https://file.hstatic.net/200000642007/file/summer_cooling_tee.jpg',
    link: '/products?collection=new',
    buttonText: 'Khám phá',
    type: 'hero',
    isActive: true,
  },
  {
    id: '3',
    title: 'WEEKEND DEALS',
    subtitle: 'ƯU ĐÃI CUỐI TUẦN',
    description: 'MUA 2 GIẢM 20%',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    link: '/deals/weekend',
    buttonText: 'Xem ưu đãi',
    type: 'promotion',
    isActive: true,
  },
];

// Mock Product Categories
export const mockProductCategories: ProductCategory[] = [
  { 
    id: 'upper-body', 
    name: 'UPPER BODY', 
    slug: 'upper-body', 
    isActive: true,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'lower-body', 
    name: 'LOWER BODY', 
    slug: 'lower-body', 
    isActive: false,
    image: 'https://images.unsplash.com/photo-1542272617-08f086302542?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'hat', 
    name: 'HAT', 
    slug: 'hat', 
    isActive: false,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'bag', 
    name: 'BAG', 
    slug: 'bag', 
    isActive: false,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
  },
];


// Mock Ranking Products converted from product-detail RelatedProducts mock
export const mockRankingProducts: Product[] = [
  {
    id: '7',
    name: 'MLB - Unisex Round Neck Short Sleeve Baseball Logo T-Shirt',
    brand: 'MLB',
    price: 1250000,
    finalPrice: 1000000, // 20% off
    percentOff: 20,
    promotionId: 1,
    promotionName: 'Summer Sale',
    image: 'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg',
      'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_3_3645df7dc2e64185879d0f0bce0c41d2_51289e8a86bf4279accd344c3c8c35a7_master.jpg'
    ],
    category: 'clothes',
    colors: ['white', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '19',
    name: 'MLB - Unisex Essential Basic Crew Neck T-Shirt',
    brand: 'MLB',
    price: 1450000,
    finalPrice: 1160000, // 20% off
    percentOff: 20,
    promotionId: 1,
    promotionName: 'Summer Sale',
    image: 'https://product.hstatic.net/200000642007/product/07nys_3atsb1843_1_9e4bed9bb86f4f44b9bf6b3dbcf54fda_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/07nys_3atsb1843_1_9e4bed9bb86f4f44b9bf6b3dbcf54fda_master.jpg',
      'https://product.hstatic.net/200000642007/product/07nys_3atsb1843_2_08cb8bb2a61e46cd9e6d5028223e07af_master.jpg'
    ],
    category: 'clothes',
    colors: ['navy', 'gray', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '17',
    name: "MLB - Women's Cropped Fit Graphic Logo T-Shirt",
    brand: 'MLB',
    price: 1650000,
    image: 'https://product.hstatic.net/200000642007/product/50bks_3atsb1843_2_882287d03667488e9b954278fc4ebdf9_8ac60b71eebc4970930d8f43916438c2_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/50bks_3atsb1843_2_882287d03667488e9b954278fc4ebdf9_8ac60b71eebc4970930d8f43916438c2_master.jpg',
      'https://product.hstatic.net/200000642007/product/50bks_3atsb1843_3_18563f0fd8334d2b8d417fb61aeea4b3_ac092530fe0449d3b9e5c4a221636d50_master.jpg'
    ],
    category: 'clothes',
    colors: ['pink', 'white', 'mint'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '36',
    name: 'MLB - Unisex Vintage Style Heritage Logo T-Shirt',
    brand: 'MLB',
    price: 1850000,
    finalPrice: 1480000, // 20% off
    percentOff: 20,
    promotionId: 2,
    promotionName: 'Heritage Collection Sale',
    image: 'https://product.hstatic.net/200000642007/product/50bks_3atse0334_1_7477d62e24054123958d170e1e919931_d7dabff799aa449393fb5d2ef48b05d8_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/50bks_3atse0334_1_7477d62e24054123958d170e1e919931_d7dabff799aa449393fb5d2ef48b05d8_master.jpg',
      'https://product.hstatic.net/200000642007/product/50bks_3atse0334_2_35293ae8a6634b89a4162f7066b6b42c_ed2c5f39eeb04da69d4e5a6a24a8d0b7_master.jpg'
    ],
    category: 'clothes',
    colors: ['brown', 'olive', 'cream'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '47',
    name: 'MLB - Limited Edition Team Colors Logo T-Shirt',
    brand: 'MLB',
    price: 2150000,
    image: 'https://product.hstatic.net/200000642007/product/07whs_3atsb1843_1_2380b55b265a4723a52de7c293d9a8a1_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/07whs_3atsb1843_1_2380b55b265a4723a52de7c293d9a8a1_master.jpg',
      'https://product.hstatic.net/200000642007/product/07whs_3atsb1843_2_4b3f46d4db0d451085c38544374c9972_master.jpg'
    ],
    category: 'clothes',
    colors: ['red', 'blue', 'yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '87',
    name: 'MLB - Premium Cotton Blend Casual T-Shirt',
    brand: 'MLB',
    price: 1750000,
    image: 'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg',
    images: [
      'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg',
      'https://product.hstatic.net/200000642007/product/50whs_3atsb1843_3_3645df7dc2e64185879d0f0bce0c41d2_51289e8a86bf4279accd344c3c8c35a7_master.jpg'
    ],
    category: 'clothes',
    colors: ['black', 'white', 'gray'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  
];
// Mock New Arrivals - take first 4 from ranking
export const mockNewArrivals: Product[] = [
  // Spread first 4 items for independence
  ...[0,1,2,3]
    .map((i) => ({ ...mockRankingProducts[i] }))
];
