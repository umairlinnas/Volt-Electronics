import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Truck, 
  Printer, 
  ArrowRight, 
  Package, 
  MapPin, 
  CreditCard, 
  Zap, 
  ShieldCheck,
  BellRing
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { currentOrder, setCurrentPage, currency, setTrackOrderNumber } = useStore();

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const order = currentOrder || {
    id: 'ord-mock',
    orderNumber: 'VOLTS-89210',
    customer: {
      name: 'Kasun Perera',
      email: 'kasun.p@gmail.com',
      phone: '+94 77 123 4567',
      address: '42/B, Galle Road, Bambalapitiya',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00400'
    },
    items: [
      {
        productId: 'prod-xenofold-pro',
        title: 'XenoFold Pro 5G - Titanium Edition',
        price: 1799.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        color: 'Midnight Titanium'
      }
    ],
    subtotal: 1799.00,
    discountAmount: 179.90,
    shippingFee: 0,
    total: 1619.10,
    currency: 'USD' as const,
    paymentMethod: 'koko_bnpl' as const,
    paymentStatus: 'paid' as const,
    status: 'pending' as const,
    trackingNumber: 'LK-DOM-994821',
    courierName: 'Pronto Express Sri Lanka',
    estimatedDelivery: 'Within 2 Business Days',
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'pending' as const, timestamp: new Date().toISOString(), note: 'Order placed' }
    ]
  };

  const handleTrackOrder = () => {
    setTrackOrderNumber(order.orderNumber);
    setCurrentPage('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-600/10 px-3 py-1 rounded-lg border border-blue-500/20">
            ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Thank you, {order.customer.name}!
          </h1>
          <p className="text-sm text-slate-300">
            Your order has been received and routed to our Colombo 03 warehouse team.
          </p>
        </div>

        {/* Real-time sync notification badge */}
        <div className="inline-flex items-center gap-2 bg-[#1E293B] border border-slate-700 px-4 py-2 rounded-xl text-xs text-slate-300">
          <BellRing className="w-4 h-4 text-blue-400 animate-bounce" />
          <span>Real-time dispatch alert automatically transmitted to Admin Portal.</span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
          <div>
            <p className="text-xs text-slate-400">Order Reference Number</p>
            <p className="text-xl font-extrabold text-white font-mono">{order.orderNumber}</p>
            <p className="text-xs text-blue-400 mt-0.5">AWB Tracking: {order.trackingNumber}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleTrackOrder}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </button>
          </div>
        </div>

        {/* Summary 3-Column Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Delivery Address</span>
            </div>
            <p className="text-white font-semibold">{order.customer.name}</p>
            <p className="text-slate-300">{order.customer.street}</p>
            <p className="text-slate-300">{order.customer.city}, {order.customer.district}</p>
            <p className="text-slate-400 font-mono">{order.customer.phone}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              <span>Payment Gateway</span>
            </div>
            <p className="text-white font-semibold uppercase">
              {order.paymentMethod === 'koko_bnpl' ? 'Koko 3x BNPL' : order.paymentMethod === 'ipg_card' ? 'Card IPG' : order.paymentMethod === 'bank_transfer' ? 'Bank Deposit' : 'Cash on Delivery'}
            </p>
            <p className="text-emerald-400 font-bold">Status: {order.paymentStatus.toUpperCase()}</p>
            <p className="text-slate-400 text-[11px]">Email sent to {order.customer.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Courier Delivery</span>
            </div>
            <p className="text-white font-semibold">{order.courierName || 'Pronto Express'}</p>
            <p className="text-slate-300">Est. Arrival: {order.estimatedDelivery}</p>
            <p className="text-blue-400 font-bold">100% Insured Transit</p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3 pt-4 border-t border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Items in This Order
          </h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-950"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} {item.color ? `• ${item.color}` : ''} {item.storage ? `• ${item.storage}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-white">
                  {formatCurrency(item.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-slate-700 flex justify-between items-baseline">
          <div>
            <span className="text-xs text-slate-400">Total Amount Paid / Payable</span>
            {order.discountAmount > 0 && (
              <span className="block text-[11px] text-emerald-400 font-semibold">
                Saved {formatCurrency(order.discountAmount, currency)} with promo
              </span>
            )}
          </div>
          <span className="text-2xl font-extrabold text-white font-['Outfit']">
            {formatCurrency(order.total, currency)}
          </span>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCurrentPage('catalog')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-lg transition cursor-pointer border border-slate-700"
        >
          Explore More Products
        </button>
        <button
          onClick={handleTrackOrder}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-6 py-3 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
        >
          <span>Track Order Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
