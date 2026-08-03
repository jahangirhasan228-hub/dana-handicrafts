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
  isHalalCertified?: boolean;
  isEcoFriendly?: boolean;
  artisanOrigin?: string;
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

export interface CartItem {
  product: Product;
  quantity: number;
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

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  items: {
    productId: string;
    productName: string;
    image: string;
    price: number;
    quantity: number;
  }[];
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

  // Social Media Links
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

  // A-to-Z Feature Master Toggles
  enableTopAnnouncementBar?: boolean;
  enableInstantSearch?: boolean;
  enableWhatsAppWidget?: boolean;
  enableHalalBadges?: boolean;
  enableEcoBadges?: boolean;
  enableArtisanOrigin?: boolean;
  enableStockBadges?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}
