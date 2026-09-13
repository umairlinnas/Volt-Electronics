import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Send,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { CategoryId, NavigationPage } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategory } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  const handleNav = (page: NavigationPage, categoryId?: CategoryId) => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-16">
      {/* 1. Value Proposition Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Colombo Express & Islandwide</p>
              <p className="text-[11px] text-slate-500">Colombo Rs. 549 (Free over 15k) • Islandwide Free over 25k</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">100% Genuine Warranty</p>
              <p className="text-[11px] text-slate-500">Authorized agent warranties on all phones & appliances</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Flexible Payment Options</p>
              <p className="text-[11px] text-slate-500">Cash on Delivery, Bank Transfer & Koko 3-month BNPL</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Dedicated Tech Support</p>
              <p className="text-[11px] text-slate-500">Colombo showroom pickup & after-sales guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* 2. Newsletter Signup Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-100">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              VIP Newsletter
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Stay Ahead with Volt Electronics Offers
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Subscribe for early notifications on Inverter AC seasonal promotions, flagship smartphone launches, and instant discount vouchers.
            </p>
          </div>

          <div className="lg:col-span-6 flex items-center">
            {isSubscribed ? (
              <div className="w-full p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your welcome discount code <strong>VOLTS10</strong> is active.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email (e.g. kasun@gmail.com)"
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-blue-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. 4-Column Public Pages Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Showroom Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight font-['Outfit']">
                VOLT <span className="text-blue-600">ELECTRONICS</span>
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Sri Lanka's trusted retailer for genuine mobile technology, 4K home entertainment, and household appliances with official brand warranties.
            </p>

            <div className="space-y-2 text-xs text-slate-700 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>No. 142, Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hotline: +94 11 234 5678 / +94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <span>info@voltelectronics.lk</span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs font-['Outfit']">
              Appliances & Electronics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'phones')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Mobiles & Tablets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'accessories')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Phone Accessories & Cables
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'audio')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Earphones & Bluetooth Speakers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'tvs')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  4K OLED & Smart TVs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'air-conditioners')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Inverter Air Conditioners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'refrigerators')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Refrigerators & Freezers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'washing-machines')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Washing Machines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'stoves')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Gas & Electric Stoves
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'kitchen')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Rice Cookers & Kitchen Appliances
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog', 'fans')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Stand & Ceiling Fans
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Orders */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs font-['Outfit']">
              Customer Care & Orders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('account')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Customer Account Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('track-order')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left font-semibold text-blue-600"
                >
                  Track Order & Courier Status
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('delivery-info')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Delivery Rates & Islandwide Policies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('warranty-returns')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Warranty Terms & 7-Day Returns
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Showroom Location & Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('checkout')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Proceed to Checkout
                </button>
              </li>
            </ul>
          </div>

          {/* About & Policies */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs font-['Outfit']">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  About Volt Electronics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('privacy-policy')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('terms-conditions')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('not-found')} 
                  className="hover:text-blue-600 transition cursor-pointer text-left text-slate-400"
                >
                  Help Center (404 Page)
                </button>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p>TRCSL Registered Telecommunication Dealer</p>
              <p>Official Colombo Agent Authorized Center</p>
            </div>
          </div>
        </div>

        {/* 4. Bottom Payment Gateways & Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Volt Electronics Sri Lanka (Pvt) Ltd. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-700 font-semibold text-xs mr-1">Accepted Payment Methods:</span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-bold">
              Cash on Delivery (COD)
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-bold">
              Direct Bank Transfer
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-bold">
              Koko 3-Month BNPL
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-bold">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
