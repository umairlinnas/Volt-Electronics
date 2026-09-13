import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  User, 
  Order, 
  FlashOffer, 
  CategoryId, 
  AppNotification, 
  AdminMetrics,
  AdminStaffMember 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_ORDERS } from '../data/initialData';
import { 
  db, 
  PRODUCTS_COLLECTION, 
  ORDERS_COLLECTION, 
  OFFERS_COLLECTION, 
  STAFF_COLLECTION,
  seedFirestoreIfEmpty,
  saveFirestoreProduct,
  updateFirestoreProduct,
  deleteFirestoreProduct,
  saveFirestoreOrder,
  updateFirestoreOrderStatus,
  saveFirestoreOffer,
  saveFirestoreStaff,
  deleteFirestoreStaff
} from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export type NavigationPage = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'track-order'
  | 'account'
  | 'admin'
  | 'login';

const INITIAL_STAFF_MEMBERS: AdminStaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dilshan Silva',
    email: 'admin@volts.com',
    role: 'super_admin',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2026-01-10T08:00:00Z',
    permissions: ['all_access', 'manage_inventory', 'manage_orders', 'manage_staff', 'manage_discounts', 'financial_metrics']
  },
  {
    id: 'staff-2',
    name: 'Naveen Fernando',
    email: 'inventory@volts.com',
    role: 'inventory_manager',
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2026-01-15T10:30:00Z',
    permissions: ['manage_inventory', 'manage_stock', 'view_orders']
  },
  {
    id: 'staff-3',
    name: 'Shenali Jayawardena',
    email: 'orders@volts.com',
    role: 'orders_controller',
    status: 'active',
    lastActive: '30 mins ago',
    createdAt: '2026-02-01T09:15:00Z',
    permissions: ['manage_orders', 'update_dispatch', 'customer_support']
  }
];

interface StoreContextType {
  // Navigation
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  performSearch: (q: string) => void;
  loginPortalTab: 'customer' | 'admin';
  setLoginPortalTab: (tab: 'customer' | 'admin') => void;
  openLoginPortal: (tab?: 'customer' | 'admin') => void;

  // Currency
  currency: 'LKR' | 'USD';
  setCurrency: (c: 'LKR' | 'USD') => void;
  toggleCurrency: () => void;

  // Products
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  updateProductOnSpot: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  addNewProduct: (productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, storage?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartSubtotalUSD: number;
  cartTotalItems: number;

  // Promo / Offers
  offers: FlashOffer[];
  appliedPromo: FlashOffer | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  createFlashOffer: (offerData: Partial<FlashOffer>) => Promise<void>;
  toggleOfferActive: (id: string) => Promise<void>;

  // User Auth & Profiles
  currentUser: User | null;
  loginUser: (email: string, role?: 'customer' | 'admin', name?: string, adminTitle?: string) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Staff & Admin Management (For creating more admins & managing team)
  staffMembers: AdminStaffMember[];
  addStaffMember: (staff: Omit<AdminStaffMember, 'id' | 'createdAt'>) => void;
  removeStaffMember: (id: string) => void;
  toggleStaffStatus: (id: string) => void;

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string, note?: string) => Promise<boolean>;
  trackOrderNumber: string;
  setTrackOrderNumber: (num: string) => void;

  // Wishlist & Compare
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  compareIds: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareDrawerOpen: boolean;
  setIsCompareDrawerOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewedIds: string[];

  // Admin & Notifications
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationsAsRead: () => void;
  adminMetrics: AdminMetrics | null;
  refreshAdminMetrics: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-xenofold-pro');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loginPortalTab, setLoginPortalTab] = useState<'customer' | 'admin'>('customer');

  // Currency (default LKR for Sri Lanka reference, easy toggle to USD)
  const [currency, setCurrency] = useState<'LKR' | 'USD'>('LKR');

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('volts_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Offers
  const [offers, setOffers] = useState<FlashOffer[]>(INITIAL_OFFERS);
  const [appliedPromo, setAppliedPromo] = useState<FlashOffer | null>(null);

  // Auth: Start as GUEST by default (null). Do NOT auto-login as any user!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('volts_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Staff and Admin Accounts Management state (persists in localStorage)
  const [staffMembers, setStaffMembers] = useState<AdminStaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('volts_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
    } catch {
      return INITIAL_STAFF_MEMBERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('volts_staff', JSON.stringify(staffMembers));
    } catch (e) {
      console.error(e);
    }
  }, [staffMembers]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string>('VOLTS-89210');

  // Wishlist & Compare
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-sonicflow-pro', 'prod-samsung-65-neo-qled']);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    'prod-mechpro-rgb-keyboard',
    'prod-ergogrip-mouse'
  ]);

  // Notifications & Admin
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('volts_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save user to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('volts_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('volts_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Initial Data Fetch from API
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.log('Using local products fallback:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.log('Orders fetch fallback', err);
    }
  };

  const refreshOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (err) {
      console.log('Offers fetch fallback', err);
    }
  };

  const refreshNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.log('Notifications fallback', err);
    }
  };

  const refreshAdminMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setAdminMetrics(data);
      }
    } catch (err) {
      console.log('Admin metrics fallback', err);
    }
  };

  useEffect(() => {
    // Initial fetch from backend/fallbacks
    refreshProducts();
    refreshOrders();
    refreshOffers();
    refreshNotifications();
    refreshAdminMetrics();

    // Firestore initial seeding if collections are empty
    seedFirestoreIfEmpty(INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_ORDERS, INITIAL_STAFF_MEMBERS);

    // Real-time Firestore sync listeners
    let unsubProducts = () => {};
    let unsubOrders = () => {};
    let unsubOffers = () => {};
    let unsubStaff = () => {};

    try {
      unsubProducts = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
        if (!snap.empty) {
          const liveProducts = snap.docs.map(d => d.data() as Product);
          setProducts(liveProducts);
        }
      }, (err) => {
        console.warn('Firestore products listener:', err.message);
      });

      unsubOrders = onSnapshot(collection(db, ORDERS_COLLECTION), (snap) => {
        if (!snap.empty) {
          const liveOrders = snap.docs.map(d => d.data() as Order);
          // Sort descending by createdAt
          liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(liveOrders);
        }
      }, (err) => {
        console.warn('Firestore orders listener:', err.message);
      });

      unsubOffers = onSnapshot(collection(db, OFFERS_COLLECTION), (snap) => {
        if (!snap.empty) {
          const liveOffers = snap.docs.map(d => d.data() as FlashOffer);
          setOffers(liveOffers);
        }
      }, (err) => {
        console.warn('Firestore offers listener:', err.message);
      });

      unsubStaff = onSnapshot(collection(db, STAFF_COLLECTION), (snap) => {
        if (!snap.empty) {
          const liveStaff = snap.docs.map(d => d.data() as AdminStaffMember);
          setStaffMembers(liveStaff);
        }
      }, (err) => {
        console.warn('Firestore staff listener:', err.message);
      });
    } catch (e) {
      console.warn('Firestore initialization fallback active', e);
    }

    return () => {
      unsubProducts();
      unsubOrders();
      unsubOffers();
      unsubStaff();
    };
  }, []);

  // Currency toggle
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'LKR' ? 'USD' : 'LKR');
  };

  // Open Product Detail
  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    // Add to recently viewed
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search
  const performSearch = (q: string) => {
    setSearchQuery(q);
    setSelectedCategory('all');
    setCurrentPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, storage?: string) => {
    const chosenColor = color || (product.colors?.[0]?.name ?? 'Default');
    const chosenStorage = storage || (product.storageOptions?.[0]?.label ?? '');
    const cartItemId = `${product.id}-${chosenColor}-${chosenStorage}`;

    // calculate price with storage delta
    let unitPrice = product.price;
    if (storage && product.storageOptions) {
      const option = product.storageOptions.find(o => o.label === storage);
      if (option) {
        unitPrice += option.priceDelta;
      }
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === cartItemId);
      if (existing) {
        return prevCart.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          product,
          quantity,
          selectedColor: chosenColor,
          selectedStorage: chosenStorage,
          unitPrice
        }
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => item.id === cartItemId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Promo code
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const offer = offers.find(o => o.code === clean && o.isActive);
    if (!offer) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (offer.minSpendUSD > cartSubtotalUSD) {
      return { 
        success: false, 
        message: `Minimum order amount of $${offer.minSpendUSD} / Rs. ${(offer.minSpendUSD * 310).toLocaleString()} required.` 
      };
    }
    setAppliedPromo(offer);
    return { success: true, message: `Coupon ${offer.code} applied successfully!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const createFlashOffer = async (offerData: Partial<FlashOffer>) => {
    try {
      const newOffer: FlashOffer = {
        id: 'offer-' + Date.now(),
        code: (offerData.code || 'PROMO').toUpperCase().trim(),
        title: offerData.title || 'Special Promotion',
        discountPercent: offerData.discountPercent || 10,
        freeShipping: !!offerData.freeShipping,
        minSpendUSD: offerData.minSpendUSD || 0,
        expiresAt: offerData.expiresAt || new Date(Date.now() + 86400000 * 7).toISOString(),
        isActive: offerData.isActive ?? true,
        bannerText: offerData.bannerText || `Use code ${offerData.code} for discount!`,
        ...offerData
      };

      try {
        await saveFirestoreOffer(newOffer);
      } catch (fsErr) {
        console.warn('Firestore save offer notice:', fsErr);
      }

      try {
        await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOffer)
        });
      } catch (e) {}

      setOffers(prev => [newOffer, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOfferActive = async (id: string) => {
    try {
      const target = offers.find(o => o.id === id);
      if (target) {
        const updated = { ...target, isActive: !target.isActive };
        try {
          await saveFirestoreOffer(updated);
        } catch (fsErr) {
          console.warn('Firestore toggle offer notice:', fsErr);
        }
        try {
          await fetch(`/api/offers/${id}/toggle`, { method: 'PATCH' });
        } catch (e) {}
        setOffers(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Login Portal Navigation Helper
  const openLoginPortal = (tab: 'customer' | 'admin' = 'customer') => {
    setLoginPortalTab(tab);
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Staff & Admin Management
  const addStaffMember = async (staffData: Omit<AdminStaffMember, 'id' | 'createdAt'>) => {
    const newStaff: AdminStaffMember = {
      ...staffData,
      id: 'staff-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    try {
      await saveFirestoreStaff(newStaff);
    } catch (e) {
      console.warn('Firestore save staff notice:', e);
    }
    setStaffMembers(prev => [newStaff, ...prev]);
  };

  const removeStaffMember = async (id: string) => {
    try {
      await deleteFirestoreStaff(id);
    } catch (e) {
      console.warn('Firestore delete staff notice:', e);
    }
    setStaffMembers(prev => prev.filter(s => s.id !== id));
  };

  const toggleStaffStatus = async (id: string) => {
    const target = staffMembers.find(s => s.id === id);
    if (target) {
      const updated: AdminStaffMember = {
        ...target,
        status: target.status === 'active' ? 'suspended' : 'active'
      };
      try {
        await saveFirestoreStaff(updated);
      } catch (e) {
        console.warn('Firestore toggle staff notice:', e);
      }
      setStaffMembers(prev =>
        prev.map(s => s.id === id ? updated : s)
      );
    }
  };

  // User Auth
  const loginUser = (
    email: string, 
    role: 'customer' | 'admin' = 'customer', 
    name = '', 
    adminTitle = 'Store Operations Administrator'
  ) => {
    const user: User = {
      id: role === 'admin' ? 'admin-' + Date.now() : 'cust-' + Date.now(),
      name: name || (role === 'admin' ? 'Dilshan Silva (Admin)' : email.split('@')[0]),
      email,
      role,
      adminTitle: role === 'admin' ? adminTitle : undefined,
      phone: '+94 77 123 4567',
      addresses: [
        {
          id: 'addr-default',
          title: 'Primary Address',
          fullName: name || 'Kasun Perera',
          phone: '+94 77 123 4567',
          street: '42/B, Galle Road',
          city: 'Colombo',
          district: 'Colombo',
          postalCode: '00300',
          isDefault: true
        }
      ],
      savedWishlistIds: wishlistIds,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    
    // If admin logged in, redirect to admin portal, else if customer logged in from login page, go to account or home
    if (role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('account');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('volts_user');
    } catch (e) {
      console.error(e);
    }
    // Redirect to home safely
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Place Order
  const placeOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      const orderNumber = orderData.orderNumber || 'VOLTS-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder: Order = {
        id: orderData.id || 'ord-' + Date.now(),
        orderNumber,
        userId: currentUser?.id || 'guest-' + Date.now(),
        customer: orderData.customer || {
          name: 'Customer',
          email: '',
          phone: '',
          address: '',
          city: '',
          district: 'Colombo',
          postalCode: ''
        },
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        discountAmount: orderData.discountAmount || 0,
        shippingFee: orderData.shippingFee ?? 0,
        total: orderData.total || 0,
        currency: orderData.currency || currency,
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: orderData.paymentStatus || 'paid',
        status: 'confirmed',
        trackingNumber: 'LK-DOM-' + Math.floor(100000 + Math.random() * 900000),
        courierName: (orderData.subtotal && orderData.subtotal >= 25000) ? 'Pronto Express Sri Lanka' : 'Certis Lanka Logistics',
        estimatedDelivery: 'In 2-3 Business Days',
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed online' },
          { status: 'confirmed', timestamp: new Date().toISOString(), note: 'Payment verified & order confirmed' }
        ],
        ...orderData
      };

      // 1. Save directly into Firestore database
      try {
        await saveFirestoreOrder(newOrder);
      } catch (fsErr) {
        console.warn('Firestore direct order save notice:', fsErr);
      }

      // 2. Also send to Express backend
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (apiErr) {}

      setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
      setCurrentOrder(newOrder);
      setTrackOrderNumber(newOrder.orderNumber);
      clearCart();
      refreshProducts();
      refreshNotifications();
      refreshAdminMetrics();
      return newOrder;
    } catch (err) {
      console.error('Order creation error:', err);
    }
    return null;
  };

  // Update order status (Admin)
  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    try {
      // 1. Update in Firestore
      try {
        await updateFirestoreOrderStatus(orderId, status, note);
      } catch (fsErr) {
        console.warn('Firestore status update notice:', fsErr);
      }

      // 2. Express backend update
      try {
        await fetch(`/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, note })
        });
      } catch (e) {}

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const history = o.statusHistory || [];
          const updated: Order = {
            ...o,
            status: status as any,
            statusHistory: [
              ...history,
              {
                status: status as any,
                timestamp: new Date().toISOString(),
                note: note || `Status updated to ${status}`
              }
            ]
          };
          if (currentOrder?.id === orderId) {
            setCurrentOrder(updated);
          }
          return updated;
        }
        return o;
      }));

      refreshAdminMetrics();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Product Updates on the spot (Admin)
  const updateProductOnSpot = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      try {
        await updateFirestoreProduct(id, updates);
      } catch (fsErr) {
        console.warn('Firestore product update notice:', fsErr);
      }

      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (e) {}

      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      refreshNotifications();
      refreshAdminMetrics();
      const updated = products.find(p => p.id === id);
      return updated ? { ...updated, ...updates } : null;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const addNewProduct = async (productData: Partial<Product>): Promise<Product | null> => {
    try {
      const newProd: Product = {
        id: productData.id || 'prod-' + Date.now(),
        title: productData.title || 'New Electronics Item',
        brand: productData.brand || 'Volts',
        category: productData.category || 'accessories',
        price: productData.price || 99,
        originalPrice: productData.originalPrice || (productData.price ? productData.price * 1.2 : 119),
        discountPercent: productData.discountPercent || 10,
        rating: 4.8,
        reviewsCount: 1,
        stock: productData.stock ?? 25,
        lowStockThreshold: 5,
        isFeatured: productData.isFeatured || false,
        isFlashDeal: productData.isFlashDeal || false,
        sku: productData.sku || 'VLT-' + Math.floor(1000 + Math.random() * 9000),
        images: productData.images && productData.images.length > 0 
          ? productData.images 
          : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'],
        colors: productData.colors || [{ name: 'Default', hex: '#1e293b', inStock: true }],
        specChips: productData.specChips || ['1 Year Warranty', 'Islandwide Delivery'],
        specs: productData.specs || [],
        overview: productData.overview || 'Genuine electronics with full authorized distributor warranty in Sri Lanka.',
        inTheBox: productData.inTheBox || ['Device Unit', 'Charger', 'Warranty Documentation'],
        warranty: productData.warranty || '1 Year Official Warranty',
        ...productData
      };

      try {
        await saveFirestoreProduct(newProd);
      } catch (fsErr) {
        console.warn('Firestore product creation notice:', fsErr);
      }

      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd)
        });
      } catch (e) {}

      setProducts(prev => [newProd, ...prev]);
      refreshAdminMetrics();
      return newProd;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      try {
        await deleteFirestoreProduct(id);
      } catch (fsErr) {
        console.warn('Firestore delete product notice:', fsErr);
      }

      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (e) {}

      setProducts(prev => prev.filter(p => p.id !== id));
      refreshAdminMetrics();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Compare
  const toggleCompare = (productId: string) => {
    setCompareIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 products at a time.');
        return prev;
      }
      setIsCompareDrawerOpen(true);
      return [...prev, productId];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    setIsCompareDrawerOpen(false);
  };

  // Notifications
  const markNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        performSearch,
        loginPortalTab,
        setLoginPortalTab,
        openLoginPortal,

        currency,
        setCurrency,
        toggleCurrency,

        products,
        isLoadingProducts,
        refreshProducts,
        updateProductOnSpot,
        addNewProduct,
        deleteProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartSubtotalUSD,
        cartTotalItems,

        offers,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        createFlashOffer,
        toggleOfferActive,

        currentUser,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,

        staffMembers,
        addStaffMember,
        removeStaffMember,
        toggleStaffStatus,

        orders,
        currentOrder,
        setCurrentOrder,
        placeOrder,
        updateOrderStatus,
        trackOrderNumber,
        setTrackOrderNumber,

        wishlistIds,
        toggleWishlist,
        compareIds,
        toggleCompare,
        clearCompare,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,

        recentlyViewedIds,

        notifications,
        unreadNotifsCount,
        markNotificationsAsRead,
        adminMetrics,
        refreshAdminMetrics
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
