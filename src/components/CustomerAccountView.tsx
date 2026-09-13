import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { 
  User, 
  Package, 
  MapPin, 
  Mail, 
  Phone, 
  Lock, 
  LogOut, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    logoutUser,
    loginUser,
    openLoginPortal,
    setTrackOrderNumber,
    setCurrentPage,
    currency
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Customer orders only
  const customerOrders = orders.filter(
    o => o.customer.email.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  // If user is not logged in or is guest, guide to login portal
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 font-['Outfit']">
            Customer Account Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please sign in to view your order history, delivery tracking, and saved Sri Lankan shipping addresses.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <button
            onClick={() => openLoginPortal('customer')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider shadow-md shadow-blue-600/20"
          >
            Sign In to Customer Account
          </button>
          <p className="text-[11px] text-slate-400">
            Demo Login: <strong className="text-slate-700 font-mono">kasun.p@gmail.com</strong> / <strong className="text-slate-700 font-mono">customer123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Customer Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-black text-2xl flex items-center justify-center border border-blue-200 shadow-xs font-['Outfit']">
            {currentUser.name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 font-['Outfit']">{currentUser.name}</h1>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                VERIFIED CUSTOMER
              </span>
            </div>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1.5 font-medium">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({currentUser.addresses?.length || 0})</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-slate-800 font-bold text-sm">No orders placed yet</p>
                <p className="text-slate-500 text-xs">Explore our electronics catalog with genuine brand warranties.</p>
              </div>
              <button
                onClick={() => setCurrentPage('catalog')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                Browse Products
              </button>
            </div>
          ) : (
            customerOrders.map(ord => (
              <div
                key={ord.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-black text-blue-600 font-mono tracking-wider">
                      {ord.orderNumber}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.items.length} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ord.status === 'dispatched'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ord.status}
                    </span>

                    <button
                      onClick={() => {
                        setTrackOrderNumber(ord.orderNumber);
                        setCurrentPage('track-order');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>

                {/* Items preview list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Qty: {item.quantity} {item.color ? `• ${item.color}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer price & payment */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Payment Method: <strong className="text-slate-800 uppercase">{ord.paymentMethod.replace('_', ' ')}</strong>
                  </span>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 mr-2">Total Amount:</span>
                    <span className="text-base font-black text-slate-900 font-['Outfit']">
                      {formatCurrency(ord.total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentUser.addresses?.map(addr => (
            <div
              key={addr.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm relative"
            >
              {addr.isDefault && (
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-blue-200 tracking-wider">
                  PRIMARY SHIPPING DESTINATION
                </span>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900">{addr.street}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{addr.city}, {addr.district} District</p>
                <p className="text-xs text-slate-400 font-mono mt-1">Postal Code: {addr.postalCode}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{addr.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
