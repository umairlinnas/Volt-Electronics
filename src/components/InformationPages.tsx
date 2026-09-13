import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Package,
  Search
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

// 16. Contact Page
export const ContactView: React.FC = () => {
  const { setCurrentPage } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb & Heading */}
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Contact Volt Electronics</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Have a question regarding appliance installation, product availability, or your recent order? Our Colombo-based team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] border-b border-slate-100 pb-3">
              Store & Showroom Details
            </h2>

            <div className="space-y-5 text-xs text-slate-600">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Flagship Showroom</h3>
                  <p className="text-slate-600 mt-0.5">No. 142, Galle Road, Colombo 03, Sri Lanka</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">(Customer pickup & demo center available)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Direct Phone & WhatsApp</h3>
                  <p className="text-slate-700 font-semibold mt-0.5">Hotline: +94 11 234 5678</p>
                  <p className="text-slate-700 font-semibold">WhatsApp Support: +94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Customer Email Support</h3>
                  <p className="text-slate-700 font-semibold mt-0.5">info@voltelectronics.lk</p>
                  <p className="text-slate-700 font-semibold">warranty@voltelectronics.lk</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Showroom & Support Hours</h3>
                  <p className="text-slate-600 mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                  <p className="text-slate-600">Sunday & Poya Days: 10:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ note */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              100% Genuine Sri Lankan Warranty
            </p>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              All electronics and heavy appliances purchased from Volt Electronics include manufacturer/authorized agent warranty cards stamped and registered upon dispatch.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Send an Inquiry or Service Request
            </h2>

            {isSubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Message Received Successfully!
                </div>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out to Volt Electronics. A customer care representative will review your message and reply to your email or phone within 2–4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-medium">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kasun@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-medium">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-medium">Inquiry Topic</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                    >
                      <option value="Product Inquiry">Product Inquiry & Stock Check</option>
                      <option value="Order Tracking">Order Tracking & Delivery Status</option>
                      <option value="Appliance Installation">Heavy Appliance Installation</option>
                      <option value="Warranty Claim">Warranty Claim & Technical Service</option>
                      <option value="Corporate / Wholesale">Corporate & Bulk Orders</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Message Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our technical support team help you today?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 17. About Us Page
export const AboutView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          About Volt Electronics Sri Lanka
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Powering Sri Lankan Homes with Authentic Technology & Appliances
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded with a clear mission: to provide Sri Lankan consumers with genuine, TRCSL-approved mobile technology, home entertainment, and energy-efficient kitchen appliances backed by trustworthy local agent warranties.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base font-['Outfit']">100% Genuine Guaranteed</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every smartphone, refrigerator, and smart TV sold is sourced through authorized distributor channels with registered manufacturer serial numbers.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base font-['Outfit']">Reliable Islandwide Dispatch</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Swift doorstep delivery in Colombo (Rs. 549 or Free over Rs. 15,000) and dependable islandwide logistics across all 25 districts with insurance protection.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base font-['Outfit']">Dedicated After-Sales Care</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Local technical repair assistance, appliance installation guidance, and hassle-free warranty claim routing so your investment is safeguarded.
          </p>
        </div>
      </div>

      {/* Appliance spectrum */}
      <div className="bg-slate-100 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
          Our Comprehensive Product Range
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          {[
            'Flagship & Budget Phones',
            'Charging Cables & GaN Adapters',
            'Earphones & Bluetooth Speakers',
            '4K UHD & OLED Smart TVs',
            'Inverter Air Conditioners',
            'No-Frost Refrigerators',
            'Front & Top Load Washers',
            'Gas & Induction Stoves',
            'Deluxe Rice Cookers',
            'Stand & Ceiling Fans',
            'Laptops & Computing Gear',
            'Small Household Appliances'
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentPage('catalog')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/25 cursor-pointer"
        >
          Explore Product Catalogue
        </button>
      </div>
    </div>
  );
};

// 18. Delivery Information Page
export const DeliveryInfoView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Delivery Information & Rates</h1>
        <p className="text-sm text-slate-600">
          Clear, upfront shipping policies across Colombo and islandwide Sri Lanka.
        </p>
      </div>

      {/* Rates Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-sm space-y-4 relative">
          <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Popular
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Inside Colombo (Districts 1–15)</h2>
            <p className="text-2xl font-black text-slate-900 mt-2 font-['Outfit']">
              Rs. 549 <span className="text-xs font-normal text-slate-500">flat rate</span>
            </p>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              FREE on orders above Rs. 15,000
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
            <li>• Estimated Delivery: 24–48 hours</li>
            <li>• Same-day delivery available for orders placed before 12:00 PM</li>
            <li>• Cash on Delivery (COD) & card swipe on delivery supported</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Islandwide Courier</h2>
            <p className="text-2xl font-black text-slate-900 mt-2 font-['Outfit']">
              From Rs. 850 <span className="text-xs font-normal text-slate-500">by district</span>
            </p>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              FREE on orders above Rs. 25,000 (T&C apply)
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
            <li>• Estimated Delivery: 2–4 business days</li>
            <li>• Fully insured transit for phones, TVs & electronics</li>
            <li>• Live tracking number provided via SMS and web portal</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Store Showroom Pickup</h2>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-['Outfit']">
              FREE
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Colombo 03 Flagship Store
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
            <li>• Ready for collection within 2 hours of confirmation</li>
            <li>• In-store testing and unboxing verification</li>
            <li>• Free expert data transfer and screen guard application</li>
          </ul>
        </div>
      </div>

      {/* Heavy Appliances Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Large Home Appliances Delivery Terms (Refrigerators, ACs, Washing Machines)
        </h2>
        <p className="text-xs text-amber-800 leading-relaxed">
          Due to specialized freight requirements, heavy appliances such as refrigerators, air conditioners, and washing machines are delivered via our dedicated logistics team. In Colombo and suburban areas, two-man delivery to ground or elevator-accessible floors is included. For deliveries above the 1st floor without an elevator, please notify our team in advance during checkout notes.
        </p>
      </div>
    </div>
  );
};

// 19. Warranty & Returns Policy Page
export const WarrantyReturnsView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Warranty & Returns Policy</h1>
        <p className="text-sm text-slate-600">
          Your purchase is covered by authorized agent warranties and our 7-day exchange promise.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            1. Official Agent Warranty Coverage
          </h2>
          <p>
            All products sold by Volt Electronics are 100% genuine and covered by authorized distributor warranty terms in Sri Lanka:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Smartphones & Tablets:</strong> 1 Year Hardware Warranty + 1 Year Software Support (Apple, Samsung, Xiaomi).</li>
            <li><strong>Air Conditioners:</strong> 5 to 10 Years Inverter Compressor Warranty + 1 Year Comprehensive Machine Warranty.</li>
            <li><strong>Refrigerators:</strong> 10 Years Inverter Compressor Warranty + 1 Year Internal Components.</li>
            <li><strong>Smart TVs:</strong> 2 to 3 Years Panel & Motherboard Warranty.</li>
            <li><strong>Audio & Small Accessories:</strong> 6 Months to 1 Year Replacement Warranty depending on brand.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-5">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            2. 7-Day Replacement Guarantee
          </h2>
          <p>
            If any electronic device or appliance exhibits a verifiable manufacturer technical defect within 7 days of delivery, Volt Electronics will replace the item with a brand-new unit upon technical verification, provided the original packaging, seals, and accessories remain intact.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-5">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            3. Exclusions from Warranty
          </h2>
          <p>
            Standard manufacturer warranty exclusions apply. The warranty does not cover:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Physical damage, screen cracking, or dropped impact.</li>
            <li>Liquid/water damage (unless the product has an intact IP rating used strictly within manufacturer specs).</li>
            <li>Electrical power surges (we strongly recommend using certified surge protectors for smart TVs and refrigerators).</li>
            <li>Unauthorized repair attempts or software rooting.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

// 20. Privacy Policy Page
export const PrivacyPolicyView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 text-xs text-slate-700 leading-relaxed">
        <p>
          At Volt Electronics Sri Lanka, safeguarding your personal data and privacy is paramount. This privacy policy describes how we collect, use, and protect your information when using our online store and delivery services.
        </p>

        <h2 className="text-sm font-bold text-slate-900 font-['Outfit'] pt-2">1. Information We Collect</h2>
        <p>
          We only collect information necessary to fulfill your purchases and ensure smooth delivery: your name, contact phone number, delivery address, email address, and order history.
        </p>

        <h2 className="text-sm font-bold text-slate-900 font-['Outfit'] pt-2">2. Payment Data Security</h2>
        <p>
          Volt Electronics never stores credit or debit card numbers on our servers. All card transactions and BNPL installments are handled securely by PCI-DSS compliant payment gateways and authorized Sri Lankan financial institutions.
        </p>

        <h2 className="text-sm font-bold text-slate-900 font-['Outfit'] pt-2">3. No Third-Party Selling</h2>
        <p>
          We will never sell or monetize your contact information. Your delivery address and phone number are shared solely with our verified courier delivery partners to safely dispatch your order.
        </p>
      </div>
    </div>
  );
};

// 21. Terms and Conditions Page
export const TermsConditionsView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Terms and Conditions</h1>
        <p className="text-xs text-slate-500">Applicable to all online purchases at Volt Electronics</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-sm font-bold text-slate-900 font-['Outfit']">1. Pricing & Currency</h2>
        <p>
          All product prices are quoted in Sri Lankan Rupees (LKR) including applicable local taxes. Prices are subject to real-time verification before order fulfillment.
        </p>

        <h2 className="text-sm font-bold text-slate-900 font-['Outfit']">2. Order Acceptance</h2>
        <p>
          Receipt of an electronic order confirmation constitutes receipt of your purchase request. Volt Electronics reserves the right to confirm stock availability prior to dispatch.
        </p>

        <h2 className="text-sm font-bold text-slate-900 font-['Outfit']">3. Delivery & Inspection</h2>
        <p>
          Customers or authorized recipients are requested to inspect physical sealed packaging upon delivery before signing courier proof-of-delivery receipts.
        </p>
      </div>
    </div>
  );
};

// 22. 404 Not Found Page
export const NotFoundView: React.FC = () => {
  const { setCurrentPage, setSelectedCategory, performSearch } = useStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
      setCurrentPage('catalog');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-md">
        <HelpCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-4xl font-black text-slate-900 font-['Outfit']">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The appliance, phone model, or page you were looking for might have been moved or is currently unavailable.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for ACs, phones, TVs, stoves..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition cursor-pointer shadow-md shadow-blue-600/20"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Category links */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Browse Popular Categories:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage('catalog');
              }}
              className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => setCurrentPage('home')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
        >
          ← Return to Volt Electronics Home
        </button>
      </div>
    </div>
  );
};
