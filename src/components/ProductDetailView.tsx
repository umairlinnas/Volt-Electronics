import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, calculateKokoInstallment } from '../utils/formatters';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  Zap, 
  Cpu, 
  Camera, 
  Battery, 
  Smartphone,
  Box
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentPage,
    addToCart,
    currency,
    wishlistIds,
    toggleWishlist,
    openProductDetail
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0]?.label || '');
  const [quantity, setQuantity] = useState(1);
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  // Accordion open/close states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    overview: true,
    specs: false,
    box: true,
    warranty: false
  });

  // Reset variant defaults on product change
  useEffect(() => {
    setActiveImageIndex(0);
    if (product.colors?.length) setSelectedColor(product.colors[0].name);
    if (product.storageOptions?.length) setSelectedStorage(product.storageOptions[0].label);
    setQuantity(1);
  }, [product.id]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate price with storage delta
  let currentPrice = product.price;
  if (selectedStorage && product.storageOptions) {
    const opt = product.storageOptions.find(o => o.label === selectedStorage);
    if (opt) currentPrice += opt.priceDelta;
  }

  const savingsUSD = product.originalPrice > currentPrice ? product.originalPrice - currentPrice : 0;
  const kokoCalc = calculateKokoInstallment(currentPrice, currency);
  const isWishlisted = wishlistIds.includes(product.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopiedShare(true);
    setTimeout(() => setIsCopiedShare(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Quick Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={() => setCurrentPage('catalog')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-xl border transition cursor-pointer shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md p-4">
            {product.isBestSeller && (
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-blue-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>POPULAR BESTSELLER</span>
              </div>
            )}

            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails Carousel */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer shrink-0 bg-white p-1.5 ${
                    activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Genuine Warranty</p>
                <p className="text-[11px] text-slate-500">{product.warranty}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <Truck className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Islandwide Courier</p>
                <p className="text-[11px] text-slate-500">Insured Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Options & Specifications */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Rating */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
              {product.brand} • SKU: {product.sku}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-900">{product.rating}</span>
              <span className="text-slate-500 underline cursor-pointer">
                ({product.reviewsCount.toLocaleString()} verified customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing & Savings */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
                {formatCurrency(currentPrice, currency)}
              </span>
              {product.originalPrice > currentPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(product.originalPrice, currency)}
                </span>
              )}
              {savingsUSD > 0 && (
                <span className="bg-orange-50 text-orange-700 font-bold text-xs px-3 py-1 rounded-full border border-orange-200">
                  Save {formatCurrency(savingsUSD, currency)}
                </span>
              )}
            </div>

            {/* Delivery estimate banner */}
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Colombo Rs. 549 (Free over 15k) • Islandwide Free over 25k (T&C apply)</span>
            </div>

            {/* Koko BNPL Calculator Widget */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  KOKO BNPL
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  3 interest-free monthly splits of <strong className="text-blue-700">{kokoCalc.installmentAmount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Color:</span>
                <span className="font-bold text-slate-900">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer border-2 shadow-xs ${
                      selectedColor === color.name
                        ? 'border-blue-600 ring-2 ring-blue-200 scale-105'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-4 h-4 ${color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#dcdfe4' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage / Variants Selector */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block">
                Configuration / Capacity:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {product.storageOptions.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedStorage(opt.label)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      selectedStorage === opt.label
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{opt.label.split(' ')[0]}</span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {opt.priceDelta === 0 ? 'Included' : `+${formatCurrency(opt.priceDelta, currency)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Specifications 2x2 Grid */}
          <div className="space-y-2 pt-2">
            <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block">
              Key Technical Details
            </span>
            <div className="grid grid-cols-2 gap-3">
              {product.specs.slice(0, 4).map((spec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs"
                >
                  <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1.5">
                    {i === 0 && <Smartphone className="w-3.5 h-3.5" />}
                    {i === 1 && <Camera className="w-3.5 h-3.5" />}
                    {i === 2 && <Battery className="w-3.5 h-3.5" />}
                    {i === 3 && <Cpu className="w-3.5 h-3.5" />}
                    <span>{spec.label}</span>
                  </p>
                  <p className="text-xs text-slate-800 font-semibold leading-tight">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex gap-3">
            <button
              onClick={() => addToCart(product, quantity, selectedColor, selectedStorage)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider shadow-md shadow-blue-600/20"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Direct Buy</span>
            </button>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            {/* Overview Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('overview')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>Product Overview & Features</span>
                {openSections.overview ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.overview && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed">
                  {product.overview}
                </div>
              )}
            </div>

            {/* In The Box Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('box')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>Package Contents (In The Box)</span>
                {openSections.box ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.box && (
                <div className="p-4 pt-0 space-y-1.5">
                  {product.inTheBox.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Box className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warranty & Guarantee */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('warranty')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>Warranty & Replacement Terms</span>
                {openSections.warranty ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.warranty && (
                <div className="p-4 pt-0 text-xs text-slate-600 space-y-2">
                  <p><strong>Official Warranty:</strong> {product.warranty}</p>
                  <p><strong>Replacement Guarantee:</strong> 7 days direct replacement if hardware defect verified.</p>
                  <p><strong>Authorized Center:</strong> Service and support provided at our Colombo 03 flagship center.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">
            Related Tech & Appliances
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map(item => (
              <div
                key={item.id}
                onClick={() => openProductDetail(item.id)}
                className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-blue-400 transition flex flex-col justify-between space-y-3 group shadow-xs hover:shadow-md"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 p-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold text-blue-600 uppercase">{item.brand}</p>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">{item.title}</p>
                  <p className="text-sm font-black text-slate-900 font-['Outfit']">{formatCurrency(item.price, currency)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
