import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalUSD,
    setCurrentPage,
    currency
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">
                Shopping Cart ({cart.length})
              </h3>
              <p className="text-[11px] text-slate-500">Official Volt Electronics Cart</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Your shopping cart is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our catalog of smartphones, home appliances, and accessories.
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 text-xs"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition ml-2 cursor-pointer p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {item.selectedColor ? `Color: ${item.selectedColor}` : ''} {item.selectedStorage ? `• ${item.selectedStorage}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-slate-900 px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-slate-900 font-['Outfit'] text-sm">
                      {formatCurrency(item.unitPrice * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Colombo Rs. 549 (Free &gt; 15k) • Islandwide Rs. 850 (Free &gt; 25k T&C) • Pickup Rs. 300</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-black text-slate-900 font-['Outfit'] text-base">
                  {formatCurrency(cartSubtotalUSD, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Warranty Coverage</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Guaranteed
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs shadow-md shadow-blue-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
