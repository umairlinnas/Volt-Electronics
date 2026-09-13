import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, calculateKokoInstallment } from '../utils/formatters';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Check, 
  Lock, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  Store, 
  Info,
  FileText,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { PaymentMethod, OrderItem } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotalUSD,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    placeOrder,
    setCurrentPage,
    currentUser,
    currency
  } = useStore();

  // Shipping destination type
  const [deliveryZone, setDeliveryZone] = useState<'colombo' | 'islandwide' | 'pickup'>('colombo');

  // Customer contact and address state
  const defaultAddr = currentUser?.addresses?.[0];
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Kasun Perera',
    email: currentUser?.email || 'kasun.p@gmail.com',
    phone: currentUser?.phone || '+94 77 123 4567',
    street: defaultAddr?.street || '42/B, Galle Road, Bambalapitiya',
    city: defaultAddr?.city || 'Colombo 04',
    district: defaultAddr?.district || 'Colombo',
    postalCode: defaultAddr?.postalCode || '00400',
    notes: 'Please call before delivery'
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ipg_card');

  // Payment method specific fields
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Bank transfer ref
  const [bankTransferRef, setBankTransferRef] = useState('');

  // Koko phone
  const [kokoPhone, setKokoPhone] = useState('+94 77 123 4567');

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const discountUSD = appliedPromo
    ? (cartSubtotalUSD * appliedPromo.discountPercent) / 100
    : 0;

  // LKR shipping rates:
  // Colombo: Rs. 549 (Free if subtotal >= Rs. 15,000)
  // Islandwide: Rs. 850 (Free if subtotal >= Rs. 25,000, subject to weight/volumetric T&C)
  // Pickup: Rs. 300 Convenience & Priority Handling Fee
  const exchangeRate = 310; // LKR per USD
  const subtotalLKR = cartSubtotalUSD * exchangeRate;

  // Check if cart contains bulky/heavy items for T&C notice
  const hasBulkyItems = cart.some(item => 
    item.product.category === 'Appliances' || 
    item.product.category === 'TVs & Audio' ||
    item.product.title.toLowerCase().includes('tv') ||
    item.product.title.toLowerCase().includes('refrigerator') ||
    item.product.title.toLowerCase().includes('washing') ||
    item.product.title.toLowerCase().includes('ac') ||
    item.product.title.toLowerCase().includes('inverter')
  );

  const [showIslandwideTC, setShowIslandwideTC] = useState(false);
  const [agreedToTC, setAgreedToTC] = useState(true);

  let shippingFeeLKR = 0;
  if (deliveryZone === 'pickup') {
    shippingFeeLKR = 300; // Store pickup convenience fee
  } else if (deliveryZone === 'colombo') {
    shippingFeeLKR = subtotalLKR >= 15000 || appliedPromo?.freeShipping ? 0 : 549;
  } else {
    // islandwide: Rs. 850 base rate (Free over Rs. 25,000)
    shippingFeeLKR = subtotalLKR >= 25000 || appliedPromo?.freeShipping ? 0 : 850;
  }

  const shippingFeeUSD = shippingFeeLKR / exchangeRate;
  const totalUSD = Math.max(0, cartSubtotalUSD - discountUSD + shippingFeeUSD);
  const kokoCalc = calculateKokoInstallment(totalUSD, currency);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.productId,
      title: item.product.title,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.product.images[0],
      color: item.selectedColor,
      storage: item.selectedStorage
    }));

    const newOrder = await placeOrder({
      customer: formData,
      items: orderItems,
      subtotal: cartSubtotalUSD,
      discountAmount: discountUSD,
      shippingFee: shippingFeeUSD,
      total: totalUSD,
      currency,
      paymentMethod,
      bankTransferRef: paymentMethod === 'bank_transfer' ? (bankTransferRef || 'REF-LK-' + Math.floor(100000 + Math.random() * 900000)) : undefined,
      kokoInstallments: paymentMethod === 'koko_bnpl' ? {
        totalInstallments: 3,
        amountPerInstallment: totalUSD / 3,
        paidInstallments: 1
      } : undefined
    });

    setIsSubmitting(false);

    if (newOrder) {
      setCurrentPage('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-600 text-sm">Your shopping cart is currently empty.</p>
        <button
          onClick={() => setCurrentPage('catalog')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={() => setCurrentPage('catalog')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Details, Delivery Destination & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Delivery Destination Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center border border-blue-200">
                1
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                  Choose Delivery Method & Destination
                </h2>
                <p className="text-[11px] text-slate-500">Official Sri Lanka rates with free shipping thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Inside Colombo */}
              <button
                type="button"
                onClick={() => setDeliveryZone('colombo')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  deliveryZone === 'colombo'
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-900">Inside Colombo</span>
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-blue-700 font-['Outfit']">
                    {subtotalLKR >= 15000 ? 'FREE' : 'Rs. 549'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {subtotalLKR >= 15000 ? 'Free over Rs. 15,000' : 'Next-day delivery (Free over Rs. 15k)'}
                  </p>
                </div>
              </button>

              {/* Islandwide */}
              <button
                type="button"
                onClick={() => setDeliveryZone('islandwide')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  deliveryZone === 'islandwide'
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-900">Islandwide Delivery</span>
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-orange-700 font-['Outfit']">
                    {subtotalLKR >= 25000 ? 'FREE' : 'Rs. 850'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {subtotalLKR >= 25000 ? 'Free over Rs. 25,000 (T&C apply)' : 'Standard 2kg parcel (T&C apply)'}
                  </p>
                </div>
              </button>

              {/* Store Pickup */}
              <button
                type="button"
                onClick={() => setDeliveryZone('pickup')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  deliveryZone === 'pickup'
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-900">Store Pickup</span>
                  <Store className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-700 font-['Outfit']">
                    Rs. 300
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Showroom handling & priority inspection
                  </p>
                </div>
              </button>
            </div>

            {/* Contextual Notices for Selected Delivery Method */}
            {deliveryZone === 'islandwide' && (
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-orange-900">
                    <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Islandwide Courier Logistics • 2 to 3 Business Days</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIslandwideTC(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs cursor-pointer shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Delivery T&C</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The base fee of <strong>Rs. 850</strong> covers standard electronics packages up to 2.0 kg to all 9 provinces. Shipments over <strong>Rs. 25,000</strong> qualify for <strong>FREE shipping</strong> under standard consignment limits.
                </p>
                {hasBulkyItems && (
                  <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Notice: Your cart includes larger home appliances or displays. Specialized heavy freight delivery terms will apply upon courier dispatch.
                    </span>
                  </div>
                )}
              </div>
            )}

            {deliveryZone === 'pickup' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Store Pickup Convenience & Priority Inspection Service (Rs. 300)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The <strong>Rs. 300 convenience fee</strong> includes guaranteed stock reservation at our <strong>Colombo 03 Flagship Showroom</strong>, dedicated unboxing & screen testing with a certified technician before collection, and on-site warranty registration.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-medium pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ready for pickup within 2 hours of order confirmation. Open Mon–Sat 9AM–8PM.</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Customer & Shipping Address */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center border border-blue-200">
                2
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                  Contact & Shipping Details
                </h2>
                <p className="text-[11px] text-slate-500">Details for dispatch and order tracking updates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="Kasun Perera"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="kasun.p@gmail.com"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Mobile Phone (Sri Lanka) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="+94 77 123 4567"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Other">Other District</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-slate-700 font-bold">Street Address / House No *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="42/B, Galle Road, Bambalapitiya"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">City / Town *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="Colombo 04"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="00400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-slate-700 font-bold">Delivery Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="Special instructions for the delivery team..."
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Gateways */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center border border-blue-200">
                3
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                  Select Payment Method
                </h2>
                <p className="text-[11px] text-slate-500">Secure Sri Lankan payment gateways</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Credit / Debit Card (Bank IPG) */}
              <label
                onClick={() => setPaymentMethod('ipg_card')}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-3 ${
                  paymentMethod === 'ipg_card'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'ipg_card'}
                      onChange={() => setPaymentMethod('ipg_card')}
                      className="text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Credit / Debit Card (Bank IPG)</span>
                      <span className="text-[11px] text-slate-500">Visa & Mastercard via Commercial Bank / Sampath IPG</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">VISA</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">MC</span>
                  </div>
                </div>

                {paymentMethod === 'ipg_card' && (
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2 space-y-1">
                      <label className="text-slate-600 font-semibold">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600"
                        placeholder="4111 2222 3333 4444"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600"
                        placeholder="12/28"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Koko BNPL */}
              <label
                onClick={() => setPaymentMethod('koko_bnpl')}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-3 ${
                  paymentMethod === 'koko_bnpl'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'koko_bnpl'}
                      onChange={() => setPaymentMethod('koko_bnpl')}
                      className="text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                    />
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      K
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Koko (Buy Now Pay Later - 3x 0% Interest)</span>
                      <span className="text-[11px] text-blue-700 font-semibold">Split into 3 monthly payments of {kokoCalc.installmentAmount}</span>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    0% INTEREST
                  </span>
                </div>

                {paymentMethod === 'koko_bnpl' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">1st Installment (Today):</span>
                        <strong className="text-blue-700 font-black">{kokoCalc.installmentAmount}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">2nd Installment (Day 30):</span>
                        <strong className="text-slate-700">{kokoCalc.installmentAmount}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">3rd Installment (Day 60):</span>
                        <strong className="text-slate-700">{kokoCalc.installmentAmount}</strong>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Koko Registered Mobile Number</label>
                      <input
                        type="tel"
                        value={kokoPhone}
                        onChange={(e) => setKokoPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600"
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 3: Direct Bank Deposit */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-3 ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                    />
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Direct Bank Deposit / Wire Transfer</span>
                      <span className="text-[11px] text-slate-500">Commercial Bank, Sampath Bank, or HNB</span>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    SLIP UPLOAD
                  </span>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px] text-slate-800">
                      <p><span className="text-slate-500">Bank:</span> Commercial Bank of Ceylon PLC</p>
                      <p><span className="text-slate-500">Account Name:</span> Volt Electronics (Pvt) Ltd</p>
                      <p><span className="text-slate-500">Account No:</span> 80012938472</p>
                      <p><span className="text-slate-500">Branch:</span> Bambalapitiya (Code 042)</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Deposit Reference / Slip Number</label>
                      <input
                        type="text"
                        value={bankTransferRef}
                        onChange={(e) => setBankTransferRef(e.target.value)}
                        placeholder="e.g. FT260831004"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 4: Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-slate-500">Pay cash upon package arrival at your doorstep</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 sticky top-24 shadow-sm">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 font-['Outfit']">
              Order Summary ({cart.length} items)
            </h2>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-slate-500">
                      Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0 font-['Outfit']">
                    {formatCurrency(item.unitPrice * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Promotional Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. VOLTS10"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <p className={`text-[11px] font-semibold ${promoMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage.text}
                </p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                  <span className="font-bold text-blue-800">✓ {appliedPromo.code} applied (-{appliedPromo.discountPercent}%)</span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-slate-500 hover:text-slate-900 underline text-[10px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="text-slate-900 font-bold font-['Outfit']">{formatCurrency(cartSubtotalUSD, currency)}</span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountUSD, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>
                  {deliveryZone === 'pickup' 
                    ? 'Store Pickup Convenience Fee'
                    : deliveryZone === 'islandwide'
                    ? 'Islandwide Delivery (T&C Apply)'
                    : 'Inside Colombo Express'}
                </span>
                <span className={shippingFeeUSD === 0 ? "text-emerald-700 font-bold" : "text-slate-900 font-bold font-['Outfit']"}>
                  {shippingFeeUSD === 0 ? 'FREE' : formatCurrency(shippingFeeUSD, currency)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {formatCurrency(totalUSD, currency)}
                </span>
              </div>

              {paymentMethod === 'koko_bnpl' && (
                <p className="text-[11px] text-blue-800 bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-center font-semibold">
                  ⚡ Pay 1st installment of {kokoCalc.installmentAmount} today via Koko
                </p>
              )}
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Place Order ({formatCurrency(totalUSD, currency)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Islandwide Delivery Terms & Conditions (T&C) Modal */}
      {showIslandwideTC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                    Islandwide Delivery Terms & Conditions
                  </h3>
                  <p className="text-xs text-slate-500">Volts Electronics Sri Lanka Logistics Policy</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIslandwideTC(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-1">
                <p className="font-bold text-orange-900 text-sm">
                  Standard Flat Rate: Rs. 850 • Free Over Rs. 25,000
                </p>
                <p className="text-[11px] text-orange-800 leading-relaxed">
                  The Rs. 850 courier rate and Rs. 25,000 free delivery threshold apply to all standard technology consignments across Sri Lanka, subject to the conditions detailed below.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-black">1</span>
                    Standard Weight Allowance (Up to 2.0 kg)
                  </h4>
                  <p className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                    The standard Rs. 850 tariff covers packages weighing up to 2.0 kg (e.g. mobile phones, smart watches, earbuds, accessories, tablets, compact peripherals).
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-black">2</span>
                    Bulky Electronics & Volumetric Weight Freight
                  </h4>
                  <p className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                    Large appliances (50"+ Smart TVs, Inverter Air Conditioners, Washing Machines, Double-door Refrigerators) require specialized heavy goods transportation. While the base rate covers dispatch processing, our dedicated freight coordinator will contact you prior to dispatch to confirm access guidelines and tailgate unloading.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-black">3</span>
                    Regional Delivery Timelines
                  </h4>
                  <p className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                    • <strong>Western, Central & Southern Provinces</strong>: 2 to 3 working days.<br />
                    • <strong>North-Western, North-Central, Sabaragamuwa & Uva</strong>: 2 to 4 working days.<br />
                    • <strong>Northern & Eastern Provinces</strong> (Jaffna, Kilinochchi, Batticaloa, Trincomalee, Ampara): 3 to 5 working days.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-black">4</span>
                    Transit Insurance & Tamper-Proof Packaging
                  </h4>
                  <p className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                    All deliveries are 100% insured against transit breakage or loss. Packages are sealed with serialized tamper-evident security tape. Customers must inspect outer security seals before signing the courier waybill.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-black">5</span>
                    Cash on Delivery (COD) Limit
                  </h4>
                  <p className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                    Cash on Delivery for islandwide shipments is supported for order values up to Rs. 50,000. Orders exceeding Rs. 50,000 require payment via Online Card IPG, Koko 3-month installments, or direct Bank Deposit for verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIslandwideTC(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                I Understand & Accept T&C
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
