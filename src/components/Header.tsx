import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Zap, 
  Heart, 
  Scale, 
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  Flame, 
  KeyRound, 
  Package, 
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { CategoryId, Product } from '../types';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    performSearch,
    currency,
    toggleCurrency,
    formatPrice,
    products,
    setSelectedProduct,
    cartTotalItems,
    cartSubtotalUSD,
    setIsCartDrawerOpen,
    wishlistIds,
    compareIds,
    setIsCompareDrawerOpen,
    currentUser,
    logoutUser,
    openLoginPortal,
    unreadNotifsCount
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize local search with global state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Click outside listener for user dropdown and search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete suggestions computed from products
  const matchingSuggestions = useMemo(() => {
    if (!localSearch.trim() || localSearch.trim().length < 2) return [];
    const query = localSearch.toLowerCase().trim();
    return products
      .filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [localSearch, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      performSearch(localSearch.trim());
      setIsSuggestionsOpen(false);
      setIsSearchOpen(false);
      setCurrentPage('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    setIsSuggestionsOpen(false);
    setIsSearchOpen(false);
    setLocalSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCurrentPage('catalog');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Announcement & Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Delivery message & trust guarantee */}
          <div className="flex items-center gap-3 text-[11px] truncate">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Colombo Delivery: Rs. 549 (FREE over Rs. 15,000)</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-300">
              Islandwide Free over Rs. 25,000 (T&C apply)
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Genuine Agent Warranty
            </span>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-4 text-xs shrink-0">
            <button
              onClick={() => {
                setCurrentPage('track-order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Track Order</span>
            </button>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: +94 11 234 5678</span>
            </div>

            <span className="text-slate-700">|</span>

            {/* Currency Selector */}
            <button
              onClick={toggleCurrency}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-bold text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Toggle LKR / USD Display Currency"
            >
              <span>{currency === 'LKR' ? '🇱🇰 LKR' : '🇺🇸 USD'}</span>
              <span className="text-[10px] text-blue-400">({currency === 'LKR' ? 'Rs.' : '$'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Clean Modern Brand Logo: Volt Electronics */}
          <div 
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:bg-blue-700 transition">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-black text-2xl tracking-tight text-blue-600 font-['Outfit'] leading-none">
                  VOLT
                </span>
                <span className="font-black text-2xl tracking-tight text-slate-900 font-['Outfit'] leading-none">
                  ELECTRONICS
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-0.5 hidden sm:inline">
                Sri Lanka's Premier Tech & Appliances
              </span>
            </div>
          </div>

          {/* 3. Large Search Bar with Autocomplete Suggestions */}
          <div 
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-xl relative items-center"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={localSearch}
                onFocus={() => setIsSuggestionsOpen(true)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                placeholder="Search phones, ACs, refrigerators, TVs, audio, stoves..."
                className="w-full bg-slate-100/90 text-slate-900 placeholder-slate-400 text-xs rounded-full pl-11 pr-24 py-3 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    performSearch('');
                    setIsSuggestionsOpen(false);
                  }}
                  className="absolute right-18 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-full transition cursor-pointer shadow-sm shadow-blue-600/20"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {isSuggestionsOpen && localSearch.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Matching Products
                  </span>
                  <span>{matchingSuggestions.length} Results</span>
                </div>

                {matchingSuggestions.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {matchingSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectSuggestion(prod)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                              {prod.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                {prod.brand}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                {prod.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-slate-900 font-['Outfit']">
                            {formatPrice(prod.price)}
                          </p>
                          {prod.discountPercent > 0 && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                              {prod.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No exact products found for "{localSearch}". Press Search to explore catalog.
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>View all matching results for "{localSearch}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Right Action Icons (Wishlist, Compare, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2.5 text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Tool */}
            <button
              onClick={() => setIsCompareDrawerOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition hidden sm:flex items-center gap-1 cursor-pointer"
              title="Compare Electronics & Appliances"
            >
              <Scale className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentPage('account');
                } else {
                  openLoginPortal('customer');
                }
              }}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition hidden sm:flex cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-slate-900/10"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Cart</span>
                <span className="text-xs font-bold text-white leading-tight font-['Outfit']">
                  {cartTotalItems > 0 ? formatPrice(cartSubtotalUSD) : 'Rs. 0'}
                </span>
              </div>
            </button>

            {/* Authentication & User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 max-w-[90px] truncate leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold leading-tight">
                      {currentUser.role === 'admin' ? 'Store Staff' : 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                </button>
              ) : (
                <button
                  onClick={() => openLoginPortal('customer')}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/20 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Menu Dropdown (when user is logged in) */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Authenticated Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">{currentUser.email}</p>
                    {currentUser.role === 'admin' && (
                      <span className="inline-block mt-1.5 text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                        🛡️ {currentUser.adminTitle || 'STORE ADMINISTRATOR'}
                      </span>
                    )}
                  </div>

                  {currentUser.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-left my-1 border border-blue-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>Admin Control Center</span>
                        </div>
                        {unreadNotifsCount > 0 && (
                          <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                            {unreadNotifsCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('home');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition text-left cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>View Storefront</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage('account');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition text-left cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        <span>My Account & Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('track-order');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition text-left cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Track My Delivery</span>
                      </button>
                    </>
                  )}

                  {/* Log Out Button */}
                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out of Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated Admin Portal button if logged in as admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentPage(currentPage === 'admin' ? 'home' : 'admin')}
                className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-blue-700 border-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{currentPage === 'admin' ? 'Exit Admin' : 'Admin Panel'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (when expanded) */}
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search phones, ACs, refrigerators..."
                autoFocus
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-10 pr-20 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 5. Category Navigation Bar (Desktop) */}
      <div className="hidden lg:block bg-slate-50 border-t border-slate-200 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all' && currentPage === 'catalog'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>All Products</span>
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id && currentPage === 'catalog'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage('catalog');
              }}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1 text-orange-600 hover:bg-orange-100 font-bold ml-1 bg-orange-50 border border-orange-200"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>Offers & Deals</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 shrink-0 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Agent Warranty
            </span>
            <span>•</span>
            <span className="text-slate-600 font-medium">
              Flexible COD & Bank Transfer
            </span>
          </div>
        </div>
      </div>

      {/* 6. Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-5 animate-in slide-in-from-top-4 duration-200 space-y-4 shadow-lg">
          {/* User Session Profile Card on Mobile */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{currentUser.email}</p>
                    <span className="inline-block text-[9px] bg-blue-50 text-blue-700 px-2 py-0.2 rounded font-medium mt-0.5 border border-blue-100">
                      {currentUser.role === 'admin' ? 'Staff Admin' : 'Customer Account'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logoutUser();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px]">Log Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-700 font-medium">Welcome to Volt Electronics</p>
                <button
                  onClick={() => {
                    openLoginPortal('customer');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Category Department Links */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Browse Electronics & Appliances
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 border border-slate-200/80"
              >
                <span>All Products</span>
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 border border-slate-200/80"
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentPage('track-order');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Track My Order</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Live Timeline</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setCurrentPage('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Open Store Admin Portal</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Staff
                </span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  openLoginPortal('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] py-1.5 transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Staff & Administrative Access</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
