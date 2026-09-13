import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { formatCurrency } from '../utils/formatters';
import { 
  SlidersHorizontal, 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';
import { CategoryId, Product } from '../types';

export const CatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openProductDetail,
    addToCart,
    currency,
    wishlistIds,
    toggleWishlist,
    compareIds,
    toggleCompare
  } = useStore();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Available brands in the current products dataset
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (selectedCategory === 'all' || p.category === selectedCategory) {
        brands.add(p.brand);
      }
    });
    return Array.from(brands);
  }, [products, selectedCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setInStockOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesChips = p.specChips.some(chip => chip.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesChips) return false;
      }
      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedBrands, inStockOnly, minRating, sortBy]);

  const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);
  const categoryTitle = selectedCategory === 'all' 
    ? 'All Electronics & Appliances' 
    : (activeCategoryInfo?.name || 'Products Catalog');

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
              {searchQuery ? `Search results for "${searchQuery}"` : categoryTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {filteredProducts.length} items available with official warranty and express delivery
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-600 cursor-pointer appearance-none pr-9 shadow-xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discounts</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-blue-600 transition cursor-pointer shadow-sm shadow-blue-600/20"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
            <span>Filters</span>
            {(selectedBrands.length > 0 || inStockOnly || minRating > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedCategory !== 'all' && (
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
            <span>Category: {activeCategoryInfo?.name}</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className="hover:text-blue-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedBrands.map(brand => (
          <div
            key={brand}
            className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200"
          >
            <span>Brand: {brand}</span>
            <button
              onClick={() => toggleBrand(brand)}
              className="hover:text-slate-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {inStockOnly && (
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200">
            <span>In Stock Only</span>
            <button
              onClick={() => setInStockOnly(false)}
              className="hover:text-slate-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {(selectedBrands.length > 0 || inStockOnly || minRating > 0 || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer ml-2"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Products Listing Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4 p-8">
          <p className="text-slate-600 text-sm">No products found matching your current filter criteria.</p>
          <button
            onClick={clearAllFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map(product => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isCompared = compareIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden transition flex flex-col group relative shadow-xs hover:shadow-lg"
                >
                  {/* Top Image Banner */}
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden p-3">
                    {product.discountPercent > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg shadow-sm uppercase">
                        -{product.discountPercent}% OFF
                      </div>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 right-4 z-10 p-2 rounded-full transition cursor-pointer shadow-xs ${
                        isWishlisted
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Add to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>

                    <img
                      src={product.images[0]}
                      alt={product.title}
                      onClick={() => openProductDetail(product.id)}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-500 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-slate-800">{product.rating}</span>
                          <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h2
                        onClick={() => openProductDetail(product.id)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </h2>

                      {/* Specs Chips */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {product.specChips.slice(0, 2).map((chip, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Price, Compare & Add To Cart */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        {product.originalPrice > product.price && (
                          <p className="text-[11px] text-slate-400 line-through">
                            {formatCurrency(product.originalPrice, currency)}
                          </p>
                        )}
                        <p className="text-base font-black text-slate-900 font-['Outfit']">
                          {formatCurrency(product.price, currency)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare Checkbox */}
                        <label className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleCompare(product.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="font-semibold uppercase">CMP</span>
                        </label>

                        {/* Add Button */}
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/20"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Load More Products</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">Filter Products</h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Department / Category */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Department
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  All Items
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition ${
                      selectedCategory === c.id
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Brands
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableBrands.map(b => (
                    <label
                      key={b}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs text-slate-800 cursor-pointer border border-slate-200/80"
                    >
                      <span className="font-medium">{b}</span>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Availability
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs text-slate-800 cursor-pointer border border-slate-200/80">
                <span className="font-medium">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
