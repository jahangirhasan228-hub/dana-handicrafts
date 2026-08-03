import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery';
  transactionId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  note?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  siteDescription?: string;
  phone: string;
  whatsappNumber?: string;
  hotline?: string;
  email: string;
  address?: string;
  currency: string;
  bannerText: string;
  bkashNumber: string;
  nagadNumber: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  noticeMsg: string;

  // Social Links
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;

  // TV Banner (Top 10 Mega Deals)
  showTvBanner?: boolean;
  tvBannerTitle?: string;
  tvBannerSubtitle?: string;
  tvBannerProductIds?: string[];

  // Dynamic Ads Management
  showAds?: boolean;
  topBannerAdImageUrl?: string;
  topBannerAdLink?: string;
  topBannerAdCode?: string;

  smallAdImageUrl?: string;
  smallAdLink?: string;
  smallAdCode?: string;

  largeAdImageUrl?: string;
  largeAdLink?: string;
  largeAdCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

interface DataStore {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  reviews: Review[];
  settings: StoreSettings;
  users: User[];
}

const DATA_FILE = path.join(process.cwd(), 'dana_shop_db.json');

const INITIAL_DATA: DataStore = {
  settings: {
    storeName: 'Dana Handicrafts & Shop',
    logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    siteDescription: 'Your trusted destination in Bangladesh for authentic handicrafts, electronics, gadgets, skincare, and fashion essentials.',
    phone: '+880 1712-345678',
    whatsappNumber: '+880 1712-345678',
    hotline: '16222',
    email: 'support@danashop.com',
    address: 'House 14, Road 7, Block D, Gulshan-1, Dhaka-1212, Bangladesh',
    currency: '৳',
    bannerText: '⚡ Special Mega Discount: Get 10% OFF with code DANA10! Superfast Nationwide Delivery.',
    bkashNumber: '01712345678',
    nagadNumber: '01812345678',
    deliveryFeeInsideDhaka: 60,
    deliveryFeeOutsideDhaka: 120,
    noticeMsg: 'Free delivery on all orders over ৳3,000!',

    // Social Links
    facebookUrl: 'https://facebook.com/danashopbd',
    instagramUrl: 'https://instagram.com/danashopbd',
    youtubeUrl: 'https://youtube.com/@danashopbd',
    whatsappUrl: 'https://wa.me/8801712345678',
    tiktokUrl: 'https://tiktok.com/@danashopbd',
    twitterUrl: 'https://twitter.com/danashopbd',
    linkedinUrl: 'https://linkedin.com/company/danashopbd',

    // TV Banner
    showTvBanner: true,
    tvBannerTitle: 'LIVE TV MEGA DEALS - TOP 10 SPECIAL OFFERS',
    tvBannerSubtitle: 'Exclusive broadcast discounts updated live! Claim up to 50% discount today.',
    tvBannerProductIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'],

    // Dynamic Ads Management
    showAds: true,
    topBannerAdImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    topBannerAdLink: 'https://danashop.com/deals',
    smallAdImageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    smallAdLink: 'https://danashop.com/gadgets',
    largeAdImageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80',
    largeAdLink: 'https://danashop.com/offers',
  },
  categories: [
    {
      id: 'cat-1',
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      icon: 'Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-2',
      name: 'Fashion & Apparel',
      slug: 'fashion',
      icon: 'Shirt',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-3',
      name: 'Home & Living',
      slug: 'home-living',
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-4',
      name: 'Beauty & Skincare',
      slug: 'beauty',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Dana Pro Active Noise Cancelling Headphones',
      category: 'Electronics & Gadgets',
      price: 4500,
      originalPrice: 5800,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Immersive sound quality with advanced active noise cancellation, 40-hour battery life, and ultra-comfortable ear cushions.',
      stock: 25,
      rating: 4.8,
      reviewCount: 42,
      featured: true,
      specs: { 'Connectivity': 'Bluetooth 5.3', 'Battery': '40 Hours', 'Warranty': '1 Year' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      name: 'Ultra Slim Smartwatch with AMOLED Display',
      category: 'Electronics & Gadgets',
      price: 2950,
      originalPrice: 3800,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      description: 'Full-touch AMOLED display, heart rate monitor, SpO2 sensor, 100+ sports modes, and IP68 waterproof rating.',
      stock: 18,
      rating: 4.7,
      reviewCount: 29,
      featured: true,
      specs: { 'Display': '1.43" AMOLED', 'Battery': '10 Days', 'Waterproof': 'IP68' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      name: 'Premium Genuine Leather Executive Backpack',
      category: 'Fashion & Apparel',
      price: 3400,
      originalPrice: 4200,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      description: 'Handcrafted leather backpack featuring a padded 15.6-inch laptop compartment, water-resistant lining, and anti-theft zipper.',
      stock: 12,
      rating: 4.9,
      reviewCount: 38,
      featured: true,
      specs: { 'Material': 'Genuine Leather', 'Laptop Size': 'Up to 15.6"', 'Color': 'Chestnut Brown' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      name: 'RGB Wireless Mechanical Gaming Keyboard',
      category: 'Electronics & Gadgets',
      price: 4900,
      originalPrice: 5500,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      description: 'Hot-swappable tactile switches, dynamic RGB backlighting per key, tri-mode connection (BT 5.0, 2.4Ghz, Type-C).',
      stock: 15,
      rating: 4.6,
      reviewCount: 19,
      featured: false,
      specs: { 'Switch Type': 'Brown Tactile', 'Layout': '75% Compact', 'Battery': '4000 mAh' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      name: 'Organic Radiance Vitamin C Glow Serum',
      category: 'Beauty & Skincare',
      price: 1350,
      originalPrice: 1750,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      description: 'Dermatologist tested formula with 20% Vitamin C, Hyaluronic Acid, and Niacinamide to brighten dark spots and hydrate deeply.',
      stock: 30,
      rating: 4.8,
      reviewCount: 56,
      featured: true,
      specs: { 'Volume': '30ml', 'Skin Type': 'All Skin Types', 'Cruelty-Free': 'Yes' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-6',
      name: 'Vacuum Insulated Stainless Steel Water Bottle 1L',
      category: 'Home & Living',
      price: 980,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
      description: 'Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leakproof bamboo lid.',
      stock: 40,
      rating: 4.7,
      reviewCount: 24,
      featured: false,
      specs: { 'Capacity': '1000ml', 'Material': '304 Stainless Steel', 'Keep Hot': '12 Hours' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-7',
      name: '100% Organic Cotton Premium Oversized Hoodie',
      category: 'Fashion & Apparel',
      price: 1850,
      originalPrice: 2400,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      description: 'Heavyweight fleece hoodie with drop shoulder fit, double-stitched kangaroo pocket, and breathable natural cotton blend.',
      stock: 20,
      rating: 4.9,
      reviewCount: 31,
      featured: true,
      specs: { 'Fabric': '380 GSM Organic Cotton', 'Fit': 'Oversized Unisex', 'Care': 'Machine Washable' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-8',
      name: 'Aroma Diffuser & Ultrasonic Air Humidifier',
      category: 'Home & Living',
      price: 1650,
      originalPrice: 2100,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
      description: 'Whisper-quiet essential oil diffuser with 7 ambient LED mood lighting colors and automatic safety shutoff.',
      stock: 14,
      rating: 4.6,
      reviewCount: 16,
      featured: false,
      specs: { 'Capacity': '500ml', 'Timer': '1H / 3H / 6H', 'Coverage': '30 sq meters' },
      createdAt: new Date().toISOString(),
    },
  ],
  coupons: [
    {
      id: 'coup-1',
      code: 'DANA10',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 1000,
      expiryDate: '2026-12-31',
      isActive: true,
    },
    {
      id: 'coup-2',
      code: 'WELCOME500',
      discountType: 'fixed',
      discountValue: 500,
      minPurchase: 2500,
      expiryDate: '2026-12-31',
      isActive: true,
    },
  ],
  orders: [
    {
      id: 'ord-1001',
      trackingNumber: 'DNS-849201',
      customerName: 'Tanvir Hossain',
      customerEmail: 'tanvir@gmail.com',
      customerPhone: '01711122233',
      address: 'House 42, Road 11, Banani, Dhaka',
      city: 'Inside Dhaka',
      items: [
        {
          productId: 'prod-1',
          productName: 'Dana Pro Active Noise Cancelling Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          price: 4500,
          quantity: 1,
        },
      ],
      subtotal: 4500,
      discount: 450,
      deliveryFee: 60,
      total: 4110,
      paymentMethod: 'bKash',
      transactionId: 'BK9A82J1X',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      productId: 'prod-1',
      userName: 'Ayesha Rahman',
      rating: 5,
      comment: 'Excellent sound clarity and noise cancellation! Delivery was inside 24 hours in Dhaka.',
      date: '2026-07-20',
    },
    {
      id: 'rev-2',
      productId: 'prod-1',
      userName: 'Kamrul Hasan',
      rating: 4,
      comment: 'Great build quality and soft ear pads. Highly recommended.',
      date: '2026-07-22',
    },
  ],
  users: [
    {
      id: 'usr-admin',
      name: 'Dana Admin',
      email: 'admin@danashop.com',
      passwordHash: 'admin123', // Demo plain check
      role: 'admin',
    },
  ],
};

function loadStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load store, using initial data:', err);
  }
  saveStore(INITIAL_DATA);
  return INITIAL_DATA;
}

function saveStore(data: DataStore): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store:', err);
  }
}

let store = loadStore();

export const db = {
  getStore: () => store,
  
  // Products
  getProducts: (filter?: { category?: string; search?: string; featured?: boolean }) => {
    let list = store.products;
    if (filter?.category) {
      list = list.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase() || p.category.toLowerCase().includes(filter.category!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filter?.featured !== undefined) {
      list = list.filter(p => p.featured === filter.featured);
    }
    return list;
  },

  getProductById: (id: string) => store.products.find(p => p.id === id),

  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.products.unshift(newProd);
    saveStore(store);
    return newProd;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const idx = store.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      store.products[idx] = { ...store.products[idx], ...updates };
      saveStore(store);
      return store.products[idx];
    }
    return null;
  },

  deleteProduct: (id: string) => {
    store.products = store.products.filter(p => p.id !== id);
    saveStore(store);
  },

  // Categories
  getCategories: () => store.categories,
  
  addCategory: (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    store.categories.push(newCat);
    saveStore(store);
    return newCat;
  },

  // Coupons
  getCoupons: () => store.coupons,
  validateCoupon: (code: string, subtotal: number) => {
    const coup = store.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coup) return { valid: false, message: 'Invalid or expired coupon code' };
    if (subtotal < coup.minPurchase) {
      return { valid: false, message: `Minimum purchase amount for ${coup.code} is ${store.settings.currency}${coup.minPurchase}` };
    }
    let discount = 0;
    if (coup.discountType === 'percentage') {
      discount = Math.round((subtotal * coup.discountValue) / 100);
    } else {
      discount = coup.discountValue;
    }
    return { valid: true, coupon: coup, discount };
  },

  addCoupon: (coup: Omit<Coupon, 'id'>) => {
    const newCoup: Coupon = { ...coup, id: `coup-${Date.now()}` };
    store.coupons.unshift(newCoup);
    saveStore(store);
    return newCoup;
  },

  // Orders
  getOrders: () => store.orders,
  
  getOrderByTracking: (trackingOrId: string) => {
    const query = trackingOrId.trim().toUpperCase();
    return store.orders.find(o => o.id.toUpperCase() === query || o.trackingNumber.toUpperCase() === query);
  },

  createOrder: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt'>) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-6)}`,
      trackingNumber: `DNS-${randomNum}`,
      createdAt: new Date().toISOString(),
    };
    store.orders.unshift(newOrder);
    saveStore(store);
    return newOrder;
  },

  updateOrderStatus: (id: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => {
    const ord = store.orders.find(o => o.id === id);
    if (ord) {
      ord.orderStatus = orderStatus;
      if (paymentStatus) ord.paymentStatus = paymentStatus;
      saveStore(store);
      return ord;
    }
    return null;
  },

  // Reviews
  getReviewsByProduct: (productId: string) => store.reviews.filter(r => r.productId === productId),
  addReview: (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    store.reviews.unshift(newRev);

    // Update product rating
    const prodReviews = store.reviews.filter(r => r.productId === review.productId);
    const avgRating = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));
    const prod = store.products.find(p => p.id === review.productId);
    if (prod) {
      prod.rating = avgRating;
      prod.reviewCount = prodReviews.length;
    }

    saveStore(store);
    return newRev;
  },

  // Settings
  getSettings: () => store.settings,
  updateSettings: (newSettings: Partial<StoreSettings>) => {
    store.settings = { ...store.settings, ...newSettings };
    saveStore(store);
    return store.settings;
  },

  // Users
  getUserByEmail: (email: string) => store.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: `usr-${Date.now()}` };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  }
};
