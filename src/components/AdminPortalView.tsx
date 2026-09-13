import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { 
  Package, 
  AlertTriangle, 
  Tag, 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Flame, 
  Truck, 
  Users, 
  BarChart3, 
  Bell, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Send,
  RefreshCw,
  Clock,
  Eye,
  ShieldCheck,
  KeyRound,
  UserPlus,
  UserCheck,
  UserX,
  Lock,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { Product, CategoryId, OrderStatus, FlashOffer, AdminStaffMember, StaffRole } from '../types';
import { CATEGORIES } from '../data/initialData';

export const AdminPortalView: React.FC = () => {
  const {
    currentUser,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    toggleStaffStatus,
    openLoginPortal,
    products,
    updateProductOnSpot,
    addNewProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    offers,
    createFlashOffer,
    toggleOfferActive,
    notifications,
    unreadNotifsCount,
    markNotificationsAsRead,
    adminMetrics,
    refreshAdminMetrics,
    setCurrentPage,
    currency,
    openProductDetail
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'offers' | 'analytics' | 'customers' | 'staff'>('inventory');

  // Staff creation modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('inventory_manager');
  const [newStaffPassword, setNewStaffPassword] = useState('admin123');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState<Partial<Product>>({
    title: '',
    brand: 'Volts',
    category: 'phones',
    price: 499,
    originalPrice: 599,
    stock: 20,
    lowStockThreshold: 5,
    sku: 'VOLTS-NEW-01',
    overview: 'High-performance electronics device engineered for precision.',
    warranty: '1 Year Brand Warranty',
    specChips: ['4K Display', 'Fast Charging', 'Wireless 5.4'],
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80']
  });

  // Inline Quick Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick Promo Modal
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoData, setNewPromoData] = useState<Partial<FlashOffer>>({
    code: 'MEGA15',
    title: '15% Off Mid-Week Flash Sale',
    discountPercent: 15,
    freeShipping: true,
    minSpendUSD: 60,
    bannerText: '⚡ Mid-Week Mega Sale: 15% OFF + Free Islandwide Delivery with code MEGA15'
  });

  // Customer Marketing email modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('Exclusive VIP Offer from Volts Electronics');
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Filtered Products for Admin Table
  const filteredAdminProducts = products.filter(p => {
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (adminCategoryFilter !== 'all' && p.category !== adminCategoryFilter) return false;
    if (stockFilter === 'low' && p.stock > p.lowStockThreshold) return false;
    if (stockFilter === 'out' && p.stock > 0) return false;
    return true;
  });

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const activeDiscountsCount = products.filter(p => p.discountPercent > 0).length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.title) return;
    const price = Number(newProductData.price) || 100;
    const originalPrice = Number(newProductData.originalPrice) || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    await addNewProduct({
      ...newProductData,
      price,
      originalPrice,
      discountPercent,
      stock: Number(newProductData.stock) || 10
    });

    setIsAddModalOpen(false);
    setNewProductData({
      title: '',
      brand: 'Volts',
      category: 'phones',
      price: 499,
      originalPrice: 599,
      stock: 20,
      lowStockThreshold: 5,
      sku: 'VOLTS-NEW-02',
      overview: 'High-performance electronics device engineered for precision.',
      warranty: '1 Year Brand Warranty',
      specChips: ['4K Display', 'Fast Charging', 'Wireless 5.4'],
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80']
    });
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProductOnSpot(editingProduct.id, {
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice),
      stock: Number(editingProduct.stock),
      isFlashDeal: editingProduct.isFlashDeal,
      isFeatured: editingProduct.isFeatured
    });
    setEditingProduct(null);
  };

  const handleStockIncrement = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProductOnSpot(product.id, { stock: newStock });
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoData.code) return;
    await createFlashOffer(newPromoData);
    setIsPromoModalOpen(false);
  };

  const handleBroadcastEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSentSuccess(true);
    setTimeout(() => {
      setEmailSentSuccess(false);
      setIsEmailModalOpen(false);
    }, 2000);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    addStaffMember({
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      phone: newStaffPhone.trim() || '+94 77 000 0000',
      role: newStaffRole,
      status: 'active'
    });

    setStaffSuccessMsg(`Administrative account for "${newStaffName}" created!`);
    setTimeout(() => {
      setStaffSuccessMsg('');
      setIsAddStaffOpen(false);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPhone('');
    }, 1200);
  };

  // Security gate: non-admins cannot access this view
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">Staff Restricted Area</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            The Admin Control Portal is strictly restricted to authorized store staff and managers. Regular customer profiles cannot access this administrative dashboard.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs text-left space-y-2.5">
          <p className="text-slate-800 font-bold flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Sample Admin Test Credentials:</span>
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-xs">
            <p className="text-slate-600">Email: <span className="text-slate-900 font-bold">admin@volts.com</span></p>
            <p className="text-slate-600">Passkey: <span className="text-slate-900 font-bold">admin123</span></p>
          </div>
        </div>
        <div className="space-y-3 pt-2">
          <button
            onClick={() => openLoginPortal('admin')}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Open Dedicated Staff Admin Login</span>
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-500 hover:text-blue-600 transition font-semibold underline cursor-pointer"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
              MANAGER PORTAL
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Firebase Firestore Live</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage live Firestore inventory, pricing, flash offers, and real-time islandwide dispatch orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Unread Notifs */}
          <button
            onClick={markNotificationsAsRead}
            className="relative p-2.5 rounded-lg bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 transition cursor-pointer"
            title="Mark notifications read"
          >
            <Bell className="w-4 h-4 text-blue-400" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Switch back to Storefront */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront View</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Package className="w-4 h-4 text-blue-400" />
            <span>TOTAL PRODUCTS</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {products.length}
          </div>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12 active listings this week</span>
          </p>
        </div>

        {/* Low Stock */}
        <div className={`border rounded-2xl p-6 space-y-2 shadow-lg ${
          lowStockCount > 0 
            ? 'bg-red-950/20 border-red-800/40 text-red-400' 
            : 'bg-[#1E293B] border-slate-700 text-slate-400'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>LOW STOCK</span>
          </div>
          <div className="text-3xl font-extrabold text-red-400">
            {lowStockCount}
          </div>
          <p className="text-xs text-red-400 font-bold">
            Requires action • Re-order soon
          </p>
        </div>

        {/* Active Discounts */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Tag className="w-4 h-4 text-orange-400" />
                <span>ACTIVE DISCOUNTS</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {activeDiscountsCount}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('offers')}
              className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition cursor-pointer shadow-md"
            >
              View Promos
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            {offers.filter(o => o.isActive).length} global flash coupons running
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders & Dispatches ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'offers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Flash Offers & Banners</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Search & Consumer Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'customers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Leads & Marketing</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'staff'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>Staff & Admins ({staffMembers.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory List */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                Inventory List ({filteredAdminProducts.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search product name or SKU..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex gap-2">
              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Stock Status</option>
                <option value="low">Low Stock Only (≤ 5)</option>
                <option value="out">Out of Stock (0)</option>
              </select>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-4">
            {filteredAdminProducts.map(item => {
              const isLow = item.stock <= item.lowStockThreshold;

              return (
                <div
                  key={item.id}
                  className={`border rounded-xl p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLow 
                      ? 'bg-[#1E293B] border-red-900/40 hover:border-red-700/60' 
                      : 'bg-[#1E293B] border-slate-700 hover:border-blue-500/60'
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-900 shrink-0 cursor-pointer"
                      onClick={() => openProductDetail(item.id)}
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        {isLow ? (
                          <span className="bg-red-950 text-red-400 border border-red-800/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{item.stock} in stock</span>
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                            {item.stock} in stock
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => openProductDetail(item.id)}
                        className="text-sm font-bold text-white hover:text-blue-400 transition cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku} • Sold: {item.salesCount || 0} units
                      </p>
                    </div>
                  </div>

                  {/* Right Price, Stock & Edit Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700">
                    <div className="text-left sm:text-right">
                      {item.originalPrice > item.price && (
                        <p className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice, currency)}
                        </p>
                      )}
                      <p className="text-lg font-extrabold text-white">
                        {formatCurrency(item.price, currency)}
                      </p>
                      {item.discountPercent > 0 && (
                        <span className="text-[10px] text-orange-400 font-semibold">
                          -{item.discountPercent}% Discount Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Instant Stock + Button */}
                      <button
                        onClick={() => handleStockIncrement(item, 5)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-2 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                        title="Add 5 units to stock"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Stock</span>
                      </button>

                      {/* Edit on spot button */}
                      <button
                        onClick={() => setEditingProduct(item)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition cursor-pointer border border-slate-700"
                        title="Edit price / discount / details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${item.title}" from store catalog?`)) {
                            deleteProduct(item.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 transition cursor-pointer border border-slate-700"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Dispatches */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <div>
                <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                  Live Orders Queue ({orders.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Update fulfillment status and dispatch shipments in real-time.
                </p>
              </div>
            </div>
            <button
              onClick={() => refreshAdminMetrics()}
              className="p-2 rounded-lg bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {orders.map(ord => (
              <div
                key={ord.id}
                className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-blue-400 font-mono">
                      {ord.orderNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      Customer: {ord.customer.name} ({ord.customer.phone})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Destination: {ord.customer.street}, {ord.customer.city} ({ord.customer.district})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-medium">Payment Gateway</span>
                      <span className="text-xs font-extrabold text-emerald-400 uppercase">
                        {ord.paymentMethod === 'koko_bnpl' ? 'Koko 3x BNPL' : ord.paymentMethod === 'ipg_card' ? 'Card IPG' : ord.paymentMethod === 'bank_transfer' ? 'Bank Deposit' : 'Cash on Delivery'}
                      </span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className={`text-xs font-extrabold px-3 py-2 rounded-lg border focus:outline-none cursor-pointer uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : ord.status === 'dispatched'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : ord.status === 'processing'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ord.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-850 bg-slate-900/60 border border-slate-700/60">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400">Qty: {item.quantity} • {formatCurrency(item.price, currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700 text-xs">
                  <span className="text-slate-400">
                    AWB Tracking: <strong className="text-slate-200">{ord.trackingNumber}</strong>
                  </span>
                  <span className="font-extrabold text-blue-400 text-sm">
                    Total: {formatCurrency(ord.total, currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Flash Offers & Discounts */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <div>
                <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                  Flash Deals & Promotional Coupons
                </h2>
                <p className="text-xs text-slate-400">
                  Launch instant store offers, set free delivery rules, and publish top announcement banners.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Flash Offer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.map(offer => (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl border transition space-y-4 ${
                  offer.isActive 
                    ? 'bg-[#1E293B] border-blue-500/40 shadow-lg' 
                    : 'bg-[#1E293B]/40 border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    {offer.code}
                  </span>
                  <button
                    onClick={() => toggleOfferActive(offer.id)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition ${
                      offer.isActive 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {offer.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{offer.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{offer.bannerText}</p>
                </div>

                <div className="pt-3 border-t border-slate-700 text-xs space-y-1 text-slate-400">
                  <p>Discount: <strong className="text-white">{offer.discountPercent}% OFF</strong></p>
                  <p>Free Delivery: <strong className="text-white">{offer.freeShipping ? 'YES' : 'Standard'}</strong></p>
                  <p>Min Order: <strong className="text-white">${offer.minSpendUSD} / Rs. {(offer.minSpendUSD * 310).toLocaleString()}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Search & Consumer Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            <div>
              <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                Live Search Queries & Consumer Trends
              </h2>
              <p className="text-xs text-slate-400">
                Real-time monitoring of keywords Sri Lankan shoppers are typing into the search bar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search terms table */}
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Top Customer Search Queries</span>
              </h3>

              <div className="space-y-2">
                {adminMetrics?.topSearchTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white">"{term.query}"</span>
                        <span className="text-[10px] text-slate-400 block">Matched {term.resultsCount} products</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                      {term.count} searches
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Volume Simulation */}
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Weekly Sales & Dispatch Volume</span>
              </h3>

              <div className="space-y-3">
                {adminMetrics?.recentSalesVolume.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="font-semibold">{item.date}</span>
                      <span className="font-mono text-blue-400 font-bold">
                        ${item.amount.toLocaleString()} ({item.ordersCount} orders)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                        style={{ width: `${Math.min(100, (item.amount / 3000) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Customers & Email Marketing */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <div>
                <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                  Customer Directory & Email Marketing
                </h2>
                <p className="text-xs text-slate-400">
                  Registered customers, emails, and purchasing history ready for promotional newsletters.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Name,Email,Phone,City,TotalSpentUSD\n"
                    + "Kasun Perera,kasun.p@gmail.com,+94 77 123 4567,Colombo,1619.10\n"
                    + "Nadeesha Senanayake,nadeesha.s@yahoo.com,+94 71 987 6543,Kandy,350.99\n";
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "volts_customers_export.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Email Campaign</span>
              </button>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-slate-200">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">Kasun Perera</td>
                    <td className="p-4 text-blue-400 font-mono">kasun.p@gmail.com</td>
                    <td className="p-4 font-mono">+94 77 123 4567</td>
                    <td className="p-4">Bambalapitiya, Colombo</td>
                    <td className="p-4 text-right font-bold">1 order ($1,619.10)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">Nadeesha Senanayake</td>
                    <td className="p-4 text-blue-400 font-mono">nadeesha.s@yahoo.com</td>
                    <td className="p-4 font-mono">+94 71 987 6543</td>
                    <td className="p-4">Peradeniya, Kandy</td>
                    <td className="p-4 text-right font-bold">1 order ($350.99)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Staff & Admin Role Management */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                  Store Administration & Role Management
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Manage administrative credentials, assign role-based permissions, and invite team members.
              </p>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Admin Account</span>
            </button>
          </div>

          {/* Current Master Admin Card */}
          <div className="bg-[#1E293B] border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{currentUser?.name}</h3>
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-500/30">
                    ACTIVE SESSION
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{currentUser?.email}</p>
                <p className="text-[11px] text-blue-400 font-semibold mt-0.5">
                  Role: {currentUser?.adminTitle || 'SUPER ADMINISTRATOR (ALL PERMISSIONS)'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 self-start sm:self-auto">
              Master Admin Access • 2FA Active
            </div>
          </div>

          {/* Staff Accounts Table */}
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Authorized Administrative Team ({staffMembers.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Default Demo Passkey: <code className="text-blue-400 font-mono">admin123</code></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-slate-200">
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs">
                          {staff.name.charAt(0)}
                        </div>
                        <span>{staff.name}</span>
                      </td>
                      <td className="p-4 text-blue-400 font-mono">{staff.email}</td>
                      <td className="p-4 font-mono text-slate-300">{staff.phone || '+94 77 123 4567'}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          staff.role === 'super_admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : staff.role === 'inventory_manager'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : staff.role === 'orders_controller'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {staff.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          staff.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {staff.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{staff.createdAt}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStaffStatus(staff.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                            title={staff.status === 'active' ? 'Suspend Access' : 'Activate Access'}
                          >
                            {staff.status === 'active' ? <UserX className="w-3.5 h-3.5 text-orange-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                          {staffMembers.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove staff account for ${staff.name}?`)) {
                                  removeStaffMember(staff.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
                              title="Delete Staff"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture & Future Account Management Explanation Card */}
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>How User & Admin Management Operates in Volts</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <p className="font-bold text-blue-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 1. Creating Admin Accounts
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Super Admins can click "Create New Admin Account" on this page at any time to provision staff access, specify roles (Inventory Manager, Orders Dispatcher, Support Agent), and define secure passkeys.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 2. Customer Registration Flow
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When new shoppers arrive on the store via Google or direct URL, they browse as Guests. When they register or place orders, their customer account is saved, allowing them to log in, track shipments, and reorder.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <p className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> 3. Customer Email Marketing
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All customer email addresses and phone numbers are automatically captured in the <strong>"Customer Leads & Marketing"</strong> tab, ready for CSV export or instant promo newsletter broadcasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Account Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white font-['Outfit'] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <span>Create Administrative Account</span>
              </h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Staff Member Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Kavinda Perera"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Staff Email Address *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. kavinda@volts.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Direct Contact Phone</label>
                <input
                  type="tel"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Assigned Administrative Role *</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="super_admin">Super Administrator (Full System & Staff Control)</option>
                  <option value="inventory_manager">Inventory Manager (Stock, Prices, Deals)</option>
                  <option value="orders_controller">Orders & Dispatch Controller</option>
                  <option value="support_agent">Support & Operations Agent</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Initial Security Passkey *</label>
                <input
                  type="password"
                  required
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500">Staff will use this password on the Admin Login Portal.</p>
              </div>

              {staffSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{staffSuccessMsg}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white font-['Outfit']">
                Edit Product: {editingProduct.title}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Current Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Original / Slashed Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Stock Inventory Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFlashDeal}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFlashDeal: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-blue-500"
                    />
                    <span>Active Flash Deal</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white font-['Outfit']">Add New Product to Store</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProductData.title}
                  onChange={(e) => setNewProductData({ ...newProductData, title: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM6 Wireless Headphones"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Brand *</label>
                  <input
                    type="text"
                    required
                    value={newProductData.brand}
                    onChange={(e) => setNewProductData({ ...newProductData, brand: e.target.value })}
                    placeholder="e.g. Sony"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Category *</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Original Price (for discount)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductData.originalPrice}
                    onChange={(e) => setNewProductData({ ...newProductData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">SKU Code</label>
                  <input
                    type="text"
                    value={newProductData.sku}
                    onChange={(e) => setNewProductData({ ...newProductData, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Image URL</label>
                <input
                  type="text"
                  value={newProductData.images?.[0]}
                  onChange={(e) => setNewProductData({ ...newProductData, images: [e.target.value] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white font-['Outfit']">Create Flash Offer</h3>
              <button onClick={() => setIsPromoModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newPromoData.code}
                  onChange={(e) => setNewPromoData({ ...newPromoData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FLASH15"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Discount Percentage (%)</label>
                  <input
                    type="number"
                    required
                    value={newPromoData.discountPercent}
                    onChange={(e) => setNewPromoData({ ...newPromoData, discountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Min Spend ($)</label>
                  <input
                    type="number"
                    value={newPromoData.minSpendUSD}
                    onChange={(e) => setNewPromoData({ ...newPromoData, minSpendUSD: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Marquee / Banner Announcement Text</label>
                <textarea
                  value={newPromoData.bannerText}
                  onChange={(e) => setNewPromoData({ ...newPromoData, bannerText: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold"
                >
                  Publish Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white font-['Outfit']">Broadcast Email Campaign</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastEmail} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Campaign Subject Line</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Email Message Body</label>
                <textarea
                  rows={4}
                  defaultValue="Hi from Volts Electronics! Enjoy a special 10% discount on all flagship phones and laptops with code VOLTS10. Islandwide shipping is 100% free this week!"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {emailSentSuccess && (
                <p className="text-emerald-400 font-bold">
                  ✓ Newsletter dispatched to 240+ registered customers!
                </p>
              )}

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
