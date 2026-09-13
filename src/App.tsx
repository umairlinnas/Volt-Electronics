import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { TrackOrderView } from './components/TrackOrderView';
import { CustomerAccountView } from './components/CustomerAccountView';
import { AdminPortalView } from './components/AdminPortalView';
import { LoginPortalView } from './components/LoginPortalView';
import { CartDrawer } from './components/CartDrawer';
import { CompareModal } from './components/CompareModal';
import { Footer } from './components/Footer';
import { 
  ContactView, 
  AboutView, 
  DeliveryInfoView, 
  WarrantyReturnsView, 
  PrivacyPolicyView, 
  TermsConditionsView, 
  NotFoundView 
} from './components/InformationPages';

const AppContent: React.FC = () => {
  const { currentPage, setIsCartDrawerOpen } = useStore();

  // If navigated to 'cart', open the cart drawer
  useEffect(() => {
    if (currentPage === 'cart') {
      setIsCartDrawerOpen(true);
    }
  }, [currentPage, setIsCartDrawerOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Page View Routing */}
      <main className="flex-1">
        {currentPage === 'home' && <HomeView />}
        {(currentPage === 'catalog' || 
          currentPage === 'shop' || 
          currentPage === 'category' || 
          currentPage === 'search' || 
          currentPage === 'offers') && <CatalogView />}
        {currentPage === 'product-detail' && <ProductDetailView />}
        {currentPage === 'checkout' && <CheckoutView />}
        {currentPage === 'order-success' && <OrderSuccessView />}
        {currentPage === 'track-order' && <TrackOrderView />}
        {(currentPage === 'account' || currentPage === 'wishlist') && <CustomerAccountView />}
        {currentPage === 'admin' && <AdminPortalView />}
        {(currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password') && <LoginPortalView />}
        {currentPage === 'contact' && <ContactView />}
        {currentPage === 'about' && <AboutView />}
        {currentPage === 'delivery-info' && <DeliveryInfoView />}
        {currentPage === 'warranty-returns' && <WarrantyReturnsView />}
        {currentPage === 'privacy-policy' && <PrivacyPolicyView />}
        {currentPage === 'terms-conditions' && <TermsConditionsView />}
        {currentPage === 'not-found' && <NotFoundView />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CompareModal />

      {/* Store Footer */}
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
