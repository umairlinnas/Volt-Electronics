import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const TrackOrderView: React.FC = () => {
  const { trackOrderNumber, setTrackOrderNumber, orders, setCurrentPage, currency } = useStore();
  const [searchInput, setSearchInput] = useState(trackOrderNumber || 'VOLTS-89210');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const lookupOrder = (searchStr: string) => {
    const clean = searchStr.trim().toUpperCase();
    if (!clean) return;

    // Search in store state first
    const found = orders.find(o => 
      o.orderNumber.toUpperCase() === clean || 
      o.id.toUpperCase() === clean || 
      o.trackingNumber.toUpperCase() === clean
    );

    if (found) {
      setActiveOrder(found);
      setNotFound(false);
    } else {
      // Fetch from API
      fetch(`/api/orders/${clean}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not found');
        })
        .then(data => {
          setActiveOrder(data);
          setNotFound(false);
        })
        .catch(() => {
          setNotFound(true);
          setActiveOrder(null);
        });
    }
  };

  useEffect(() => {
    if (trackOrderNumber) {
      setSearchInput(trackOrderNumber);
      lookupOrder(trackOrderNumber);
    }
  }, [trackOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(searchInput);
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Placed', desc: 'Received & logged in Colombo system' },
    { key: 'confirmed', label: 'Payment Verified', desc: 'IPG / Koko / Deposit approved' },
    { key: 'processing', label: 'Quality Checked & Packed', desc: 'Bambalapitiya fulfillment centre' },
    { key: 'dispatched', label: 'Dispatched via Courier', desc: 'In transit with Pronto Express' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over at customer doorstep' }
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderLevels: { [key in OrderStatus]: number } = {
      pending: 1,
      confirmed: 2,
      processing: 3,
      dispatched: 4,
      delivered: 5,
      cancelled: 0
    };

    const currentLevel = orderLevels[currentStatus] || 1;
    const stepLevel = orderLevels[stepKey] || 1;

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentLevel > stepLevel) return 'completed';
    if (currentLevel === stepLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Store</span>
      </button>

      {/* Header & Tracker Search Box */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-Time Islandwide Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Track Your Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your Volts Order Number (e.g. <code>VOLTS-89210</code>) or Courier Waybill AWB code.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. VOLTS-89210 or LK-DOM-994821"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm text-white font-mono uppercase focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition cursor-pointer shadow-lg shadow-blue-600/20"
          >
            Track
          </button>
        </form>

        {notFound && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Order reference not found. Please double-check the Order ID or try <strong>VOLTS-89210</strong>.</span>
          </div>
        )}
      </div>

      {/* Active Order Details */}
      {activeOrder && (
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Order Reference: {activeOrder.orderNumber}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5 font-['Outfit']">
                Status: <span className="uppercase text-blue-400">{activeOrder.status}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Courier Waybill: <strong className="text-slate-200">{activeOrder.trackingNumber}</strong> ({activeOrder.courierName || 'Pronto Express'})
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-900 p-3.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Arrival</span>
              <span className="text-sm font-bold text-emerald-400">
                {activeOrder.estimatedDelivery || 'Within 24-48 Hours'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline Visual */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Progress
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-700 ml-4 sm:ml-6 py-2">
              {steps.map((step, idx) => {
                const state = getStepStatus(step.key, activeOrder.status);

                return (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                        state === 'completed'
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : state === 'current'
                          ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : state === 'current' ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          state === 'completed' || state === 'current'
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live History Logs */}
          {activeOrder.statusHistory && activeOrder.statusHistory.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Event Activity Logs
              </h4>
              <div className="space-y-1.5 text-xs">
                {activeOrder.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-baseline justify-between text-slate-300">
                    <span>• {h.note}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer & Items Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-700">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Destination</span>
              </div>
              <p className="text-white font-bold">{activeOrder.customer.name}</p>
              <p className="text-slate-300">{activeOrder.customer.street}, {activeOrder.customer.city}</p>
              <p className="text-slate-400 font-mono">{activeOrder.customer.phone}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Courier Support Helpline</span>
              </div>
              <p className="text-white font-bold">Volts Logistics Dispatch Desk</p>
              <p className="text-slate-300">Hotline: +94 11 755 8899</p>
              <p className="text-slate-400">Available 24/7 for delivery updates</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
