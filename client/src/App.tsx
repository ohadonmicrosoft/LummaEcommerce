import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MiniCart from "./components/layout/MiniCart";
import SearchOverlay from "./components/layout/SearchOverlay";
import AccessibilityMenu from "./components/layout/AccessibilityMenu";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import StoreLocator from "./pages/StoreLocator";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import { useUI } from "./contexts/UIContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import TestTranslations from "./utils/test-translations";
import { testTranslations } from './utils/debug-translations';
import { useEffect } from 'react';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/stores" component={StoreLocator} />
      <Route path="/admin/translations" component={TestTranslations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isCartOpen, isSearchOpen } = useUI();
  
  // Run translation debug test only once on mount
  useEffect(() => {
    // Debug tool to verify translations are working
    testTranslations('en');
    
    // Double check key integrity
    console.log('DEBUG: Translation key verification is running');
  }, []);

  return (
    <WishlistProvider>
      <div className="relative">
        <Header />
        <main>
          <Router />
        </main>
        <Footer />

        {/* Overlays */}
        {isCartOpen && <MiniCart />}
        {isSearchOpen && <SearchOverlay />}
        <Toaster />
        <AccessibilityMenu />
      </div>
    </WishlistProvider>
  );
}

export default App;
