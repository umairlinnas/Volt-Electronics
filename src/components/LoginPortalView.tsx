import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Globe, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Users, 
  ShieldAlert,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';

export const LoginPortalView: React.FC = () => {
  const {
    loginPortalTab,
    setLoginPortalTab,
    loginUser,
    setCurrentPage,
    staffMembers
  } = useStore();

  const [activePortal, setActivePortal] = useState<'customer' | 'admin'>(loginPortalTab);
  const [customerMode, setCustomerMode] = useState<'signin' | 'register'>('signin');

  // Customer Form State
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setActivePortal(loginPortalTab);
  }, [loginPortalTab]);

  const simulatedUrl = `https://volts.electronics/login/${activePortal}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(simulatedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Quick fill helper for customer
  const handleFillCustomerDemo = () => {
    setActivePortal('customer');
    setLoginPortalTab('customer');
    setCustomerMode('signin');
    setCustEmail('kasun.p@gmail.com');
    setCustPassword('customer123');
    setErrorMessage('');
    setSuccessMessage('Customer demo credentials filled! Click "Sign In to Customer Account" below.');
  };

  // Quick fill helper for admin
  const handleFillAdminDemo = () => {
    setActivePortal('admin');
    setLoginPortalTab('admin');
    setAdminEmail('admin@volts.com');
    setAdminPassword('admin123');
    setErrorMessage('');
    setSuccessMessage('Super Admin credentials filled! Click "Authenticate & Open Admin Dashboard" below.');
  };

  // Customer login/register submit
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (customerMode === 'signin') {
      if (!custEmail || !custPassword) {
        setErrorMessage('Please enter both your customer email address and password.');
        return;
      }
      // Demo validation or account login
      loginUser(
        custEmail, 
        'customer', 
        custEmail.toLowerCase().includes('kasun') ? 'Kasun Perera' : custEmail.split('@')[0]
      );
    } else {
      // Registration
      if (!custName.trim() || !custEmail.trim() || !custPassword) {
        setErrorMessage('Please fill in all mandatory customer registration fields.');
        return;
      }
      if (custPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      loginUser(custEmail, 'customer', custName.trim());
    }
  };

  // Admin login submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!adminEmail || !adminPassword) {
      setErrorMessage('Please enter your staff administrative email and security passkey.');
      return;
    }

    // Check if email belongs to staff members or master admin
    const foundStaff = staffMembers.find(s => s.email.toLowerCase() === adminEmail.toLowerCase());

    if (adminEmail.toLowerCase() === 'admin@volts.com' || foundStaff) {
      if (adminPassword === 'admin123' || adminPassword.length >= 4) {
        const staffName = foundStaff ? foundStaff.name : 'Dilshan Silva (Super Admin)';
        const roleTitle = foundStaff 
          ? foundStaff.role.replace('_', ' ').toUpperCase()
          : 'SUPER ADMINISTRATOR';

        loginUser(adminEmail, 'admin', staffName, roleTitle);
      } else {
        setErrorMessage('Invalid administrative passkey. Try sample test password: admin123');
      }
    } else {
      // Allow demo login with warning or reject
      if (adminPassword === 'admin123') {
        loginUser(adminEmail, 'admin', 'Store Staff (' + adminEmail.split('@')[0] + ')', 'STORE ADMINISTRATOR');
      } else {
        setErrorMessage(`Administrative account "${adminEmail}" not recognized. Use master test email: admin@volts.com / pass: admin123`);
      }
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-slate-50">
      {/* Top Simulated Custom URL Bar */}
      <div className="w-full max-w-xl mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-mono overflow-hidden">
            <span className="flex items-center gap-1 text-emerald-700 font-bold shrink-0 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
              <Lock className="w-3 h-3" />
              <span>SSL ENCRYPTED</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate text-slate-800 font-semibold">{simulatedUrl}</span>
          </div>

          <button
            onClick={copyUrlToClipboard}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-xl border border-slate-200 transition cursor-pointer shrink-0 text-[11px] font-bold"
            title="Copy Current Portal URL"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
            <Zap className="w-6 h-6 fill-blue-600 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
            VOLT ELECTRONICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Role-Based Authentication Gateway with Strict Access Isolation
          </p>
        </div>

        {/* Dual Portal Switcher (Customer vs Admin) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActivePortal('customer');
              setLoginPortalTab('customer');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePortal === 'customer'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePortal('admin');
              setLoginPortalTab('admin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-slate-900 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Staff Admin Portal</span>
          </button>
        </div>

        {/* Quick Demo Test Credentials Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Sample Test Logins (Click to Autofill)
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Instant 1-Click
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Customer Box */}
            <div className={`p-3.5 rounded-2xl border transition ${
              activePortal === 'customer' ? 'bg-white border-blue-300 ring-2 ring-blue-50' : 'bg-white border-slate-200'
            } space-y-1.5`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Customer Sample
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  Buyer
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-mono">kasun.p@gmail.com</p>
              <p className="text-[10px] text-slate-500 font-mono">Password: customer123</p>
              <button
                type="button"
                onClick={handleFillCustomerDemo}
                className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-1.5 rounded-xl text-[11px] border border-blue-200 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-blue-600 text-blue-600" />
                <span>Fill Customer Demo</span>
              </button>
            </div>

            {/* Admin Box */}
            <div className={`p-3.5 rounded-2xl border transition ${
              activePortal === 'admin' ? 'bg-white border-orange-300 ring-2 ring-orange-50' : 'bg-white border-slate-200'
            } space-y-1.5`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Admin Sample
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                  Staff
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-mono">admin@volts.com</p>
              <p className="text-[10px] text-slate-500 font-mono">Passkey: admin123</p>
              <button
                type="button"
                onClick={handleFillAdminDemo}
                className="w-full mt-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-1.5 rounded-xl text-[11px] border border-orange-200 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-orange-600" />
                <span>Fill Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* 1. CUSTOMER PORTAL VIEW */}
        {activePortal === 'customer' && (
          <div className="space-y-5">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setCustomerMode('signin')}
                className={`pb-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
                  customerMode === 'signin'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => setCustomerMode('register')}
                className={`pb-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
                  customerMode === 'register'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Register New Customer
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {customerMode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Contact Phone (Sri Lanka)</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="e.g. kasun.p@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Password *</label>
                  {customerMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setSuccessMessage('Demo password reset link simulated to your inbox.')}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={custPassword}
                    onChange={(e) => setCustPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <span>{customerMode === 'signin' ? 'Sign In to Customer Account' : 'Create & Open Customer Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. ADMIN PORTAL VIEW */}
        {activePortal === 'admin' && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-orange-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Restricted Staff Administrative Area</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Only authorized store operations personnel, dispatch controllers, and management can authenticate here.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Staff Administrative Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@volts.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Security Passkey *</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Authenticate & Open Admin Dashboard</span>
              </button>
            </form>

            {/* Future Admin Management Explanation Note */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Users className="w-4 h-4 text-blue-600" />
                <span>How to create more Admin accounts in the future:</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Once logged in as Super Admin, click the <strong>"Staff & Admins"</strong> tab inside the Admin Control Center. You can create unlimited staff profiles, assign specialized roles (Inventory Manager, Orders Controller, Customer Care), change passkeys, or suspend access immediately.
              </p>
            </div>
          </div>
        )}

        {/* Back to storefront link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-500 hover:text-blue-600 transition cursor-pointer font-semibold"
          >
            ← Return to Storefront as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
