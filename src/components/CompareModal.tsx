import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { X, ShoppingCart, Star, Check, Sparkles, Scale } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const { compareIds, products, toggleCompare, addToCart, currency, clearCompare } = useStore();

  if (compareIds.length === 0) return null;

  const comparedProducts = products.filter(p => compareIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Direct Side-by-Side Comparison
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1 font-['Outfit']">
                Compare Specifications ({comparedProducts.length} devices)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold underline cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={clearCompare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedProducts.map(product => (
            <div
              key={product.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-xs"
            >
              <button
                onClick={() => toggleCompare(product.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-slate-400 hover:text-slate-800 shadow-xs border border-slate-200"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-white border border-slate-200 p-2">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase">{product.brand}</span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{product.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount})</span>
                  </div>
                </div>

                <div className="text-xl font-black text-slate-900 font-['Outfit']">
                  {formatCurrency(product.price, currency)}
                </div>

                {/* Specs List */}
                <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                  {product.specs.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-medium">{s.label}:</span>
                      <span className="text-slate-900 font-bold text-right">{s.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Warranty:</span>
                    <span className="text-emerald-700 font-bold">{product.warranty}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
