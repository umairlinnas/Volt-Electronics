export type CategoryId = 
  | 'all'
  | 'phones'
  | 'accessories'
  | 'audio'
  | 'tvs'
  | 'air-conditioners'
  | 'refrigerators'
  | 'washing-machines'
  | 'stoves'
  | 'kitchen'
  | 'fans'
  | 'laptops'
  | 'wearables'
  | 'appliances'
  | 'gaming';

export type NavigationPage = 
  | 'home'
  | 'catalog'
  | 'shop'
  | 'category'
  | 'product-detail'
  | 'search'
  | 'offers'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'account'
  | 'track-order'
  | 'wishlist'
  | 'contact'
  | 'about'
  | 'delivery-info'
  | 'warranty-returns'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'not-found'
  | 'admin';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
  featuredImage: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductStorage {
  label: string;
  priceDelta: number; // in USD
}

export interface ProductSpec {
  icon?: string;
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: CategoryId;
  price: number; // in USD (base currency)
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  flashDealExpiry?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sku: string;
  images: string[];
  colors: ProductColor[];
  storageOptions?: ProductStorage[];
  specChips: string[];
  specs: ProductSpec[];
  overview: string;
  inTheBox: string[];
  warranty: string;
  viewsCount?: number;
  salesCount?: number;
}

export interface CartItem {
  id: string; // unique item id (combines product id + options)
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  unitPrice: number;
}

export interface UserAddress {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: UserAddress[];
  savedWishlistIds: string[];
  createdAt: string;
  avatar?: string;
  adminTitle?: string; // e.g. "Operations Manager", "Inventory Admin"
  permissions?: string[]; // e.g. ["manage_inventory", "manage_orders", "manage_staff", "manage_discounts"]
}

export type StaffRole = 'super_admin' | 'inventory_manager' | 'orders_controller' | 'support_agent';

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: 'active' | 'suspended';
  lastActive: string;
  createdAt: string;
  permissions: string[];
}

export type PaymentMethod = 'ipg_card' | 'koko_bnpl' | 'bank_transfer' | 'cod';
export type PaymentStatus = 'paid' | 'pending_verification' | 'pending_bnpl' | 'cod_pending';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  storage?: string;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  currency: 'LKR' | 'USD';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bankTransferRef?: string;
  kokoInstallments?: {
    totalInstallments: number;
    amountPerInstallment: number;
    paidInstallments: number;
  };
  status: OrderStatus;
  trackingNumber: string;
  courierName?: string;
  estimatedDelivery: string;
  createdAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface FlashOffer {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  freeShipping: boolean;
  minSpendUSD: number;
  expiresAt: string;
  isActive: boolean;
  bannerText: string;
}

export interface SearchMetric {
  query: string;
  count: number;
  lastSearched: string;
  resultsCount: number;
}

export interface AdminMetrics {
  totalRevenueUSD: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  activeDiscountsCount: number;
  topSearchTerms: SearchMetric[];
  recentSalesVolume: { date: string; amount: number; ordersCount: number }[];
}

export interface AppNotification {
  id: string;
  type: 'order' | 'stock' | 'promo' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}
