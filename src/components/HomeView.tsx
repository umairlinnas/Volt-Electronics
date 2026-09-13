import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { formatCurrency, calculateKokoInstallment } from '../utils/formatters';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Tv, 
  Wind,
  Refrigerator, 
  Waves,
  Flame as StoveIcon,
  UtensilsCrossed,
  Fan,
  Zap, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { CategoryId } from '../types';

export const HomeView: React.FC = () => {
  const {
    products,
    openProductDetail,
    setSelectedCategory,
    setCurrentPage,
    addToCart,
    currency,
    recentlyViewedIds
  } = useStore();

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'phones': return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'accessories': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'audio': return <Headphones className="w-5 h-5 text-purple-600" />;
      case 'tvs': return <Tv className="w-5 h-5 text-indigo-600" />;
      case 'air-conditioners': return <Wind className="w-5 h-5 text-cyan-600" />;
      case 'refrigerators': return <Refrigerator className="w-5 h-5 text-sky-600" />;
      case 'washing-machines': return <Waves className="w-5 h-5 text-teal-600" />;
      case 'stoves': return <StoveIcon className="w-5 h-5 text-orange-600" />;
      case 'kitchen': return <UtensilsCrossed className="w-5 h-5 text-rose-600" />;
      case 'fans': return <Fan className="w-5 h-5 text-blue-500" />;
      default: return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCurrentPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured Deals from dataset
  const featuredDeals = products.filter(p => p.discountPercent > 0 || p.isFeatured).slice(0, 8);
  
  // Hero product (Flagship or major appliance)
  const heroProduct = products.find(p => p.id === 'prod-s24-ultra') || products[0];

  // Recently viewed products
  const recentlyViewed = products.filter(p => recentlyViewedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero Showcase Banner (Electric Cobalt with clean contrast) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 border border-blue-700/50 shadow-xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14 relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL SRI LANKA AGENT STOCK</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] font-['Outfit']">
                Next-Gen Tech & <br />
                <span className="bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent">
                  Modern Living Appliances
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-lg leading-relaxed">
                Discover genuine flagship smartphones, 4K Smart OLEDs, and energy-saving Inverter ACs. Covered by official brand warranties and prompt islandwide delivery.
              </p>
            </div>

            {/* Price & BNPL badge */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div>
                <span className="text-xs text-blue-200 block font-medium">Featured Flagship</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                    {formatCurrency(heroProduct.price, currency)}
                  </span>
                  {heroProduct.originalPrice > heroProduct.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(heroProduct.originalPrice, currency)}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-slate-900/90 border border-blue-400/30 px-3.5 py-2 rounded-xl text-xs text-slate-200 shadow-inner">
                <span className="text-amber-400 font-bold">Koko BNPL:</span> 3x {calculateKokoInstallment(heroProduct.price, currency).installmentAmount} / mo (0% Interest)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openProductDetail(heroProduct.id)}
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer text-xs uppercase tracking-wider"
              >
                <span>View Flagship</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => addToCart(heroProduct)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3.5 rounded-xl transition border border-blue-500 flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider shadow-md shadow-blue-600/30"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => handleCategorySelect('all')}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold px-5 py-3.5 rounded-xl transition border border-slate-700 flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <span>Browse All Products</span>
              </button>
            </div>
          </div>

          {/* Hero Featured Product Image */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div 
              className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border border-blue-400/30 shadow-2xl group cursor-pointer bg-slate-900"
              onClick={() => openProductDetail(heroProduct.id)}
            >
              <img
                src={heroProduct.images[0]}
                alt={heroProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-5">
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 w-full shadow-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                        {heroProduct.brand} • Flagship
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">{heroProduct.title}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shop by Category Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
              Explore Departments & Appliances
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              From personal smart tech to complete home and kitchen solutions
            </p>
          </div>
          <button
            onClick={() => handleCategorySelect('all')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group cursor-pointer text-center shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                {getCategoryIcon(cat.id)}
              </div>
              <div className="w-full">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 block truncate">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-500 font-medium block">
                  Official Warranty
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Deals & Best Sellers */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
                Featured Deals & Special Offers
              </h2>
              <p className="text-xs text-slate-500">
                Verified genuine stock at special discounted rates
              </p>
            </div>
          </div>
          <button
            onClick={() => handleCategorySelect('all')}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
          >
            <span>See All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDeals.map(product => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 transition flex flex-col group relative shadow-xs hover:shadow-lg"
            >
              {/* Discount Tag */}
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-orange-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg shadow-sm uppercase">
                  -{product.discountPercent}% OFF
                </div>
              )}

              {/* Product Image */}
              <div 
                onClick={() => openProductDetail(product.id)}
                className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer p-3"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {product.category}
                    </span>
                  </div>

                  <h3 
                    onClick={() => openProductDetail(product.id)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition line-clamp-2 cursor-pointer leading-snug"
                  >
                    {product.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-900 font-['Outfit']">
                      {formatCurrency(product.price, currency)}
                    </p>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-slate-400 line-through">
                        {formatCurrency(product.originalPrice, currency)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/20"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Promotional Appliances Showcase Banner */}
      <div 
        onClick={() => handleCategorySelect('air-conditioners')}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-10 cursor-pointer group shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block">
              Seasonal Climate Living Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit']">
              Energy-Saving Inverter Air Conditioners & Freezers
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Beat the heat with Panasonic and LG R32 Eco-Inverter split air conditioners. Up to 65% energy savings, free Colombo installation, and genuine 5-year compressor warranties.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md">
                <span>Shop Air Conditioners & Freezers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <div className="w-full max-w-xs h-48 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"
                alt="Inverter AC Air Conditioner"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sri Lanka Trust Factors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine Warranty</h4>
            <p className="text-[11px] text-slate-500">Official Brand Sealed & TRCSL Approved</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Inside Colombo Rs. 549</h4>
            <p className="text-[11px] text-slate-500">FREE delivery on orders over Rs. 15,000</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Koko 3x 0% Interest BNPL</h4>
            <p className="text-[11px] text-slate-500">Debit card supported, 3 easy splits</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">7-Day Replacement Policy</h4>
            <p className="text-[11px] text-slate-500">Direct exchange on manufacturer defects</p>
          </div>
        </div>
      </div>

      {/* 6. Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-['Outfit']">
              Recently Viewed Products
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewed.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-blue-400 transition shadow-xs"
              >
                <div 
                  onClick={() => openProductDetail(item.id)}
                  className="flex items-center gap-3 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate hover:text-blue-600 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs font-black text-blue-600 font-['Outfit']">
                      {formatCurrency(item.price, currency)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition shrink-0 cursor-pointer"
                  title="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
