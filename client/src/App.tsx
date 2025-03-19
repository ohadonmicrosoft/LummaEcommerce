import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
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
import { useEffect, useState } from 'react';
import MiniCart from "./components/layout/MiniCart";

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

// Direct debugging component that doesn't rely on complex UI
function DirectDebug() {
  const [errors, setErrors] = useState<string[]>([]);
  
  // Log any errors
  window.onerror = function(message, source, lineno, colno, error) {
    setErrors(prev => [...prev, `Error: ${message}`]);
    console.error("Captured error:", { message, source, lineno, colno, error });
    return false;
  };
  
  useEffect(() => {
    console.log("[DirectDebug] Component mounted");
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px', 
        left: '10px',
        zIndex: 9999,
        background: '#ff0000',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px',
        border: '2px solid white',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>DIRECT DEBUG</div>
      
      {errors.length > 0 && (
        <div style={{ marginTop: '10px', borderTop: '1px solid white', paddingTop: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>Errors:</div>
          {errors.map((err, i) => (
            <div key={i} style={{ color: 'yellow', marginTop: '5px' }}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const { isSearchOpen } = useUI();
  
  // Run translation debug test only once on mount
  useEffect(() => {
    testTranslations();
    console.log('DEBUG: Translation key verification is running');
  }, []);

  return (
    <div className="relative">
      <Header />
      <main>
        <Router />
      </main>
      <Footer />

      {/* Direct debugging that doesn't rely on components */}
      <DirectDebug />
      
      {/* Search overlay */}
      {isSearchOpen && <SearchOverlay />}
      
      {/* MiniCart - rendered unconditionally, will show/hide itself based on state */}
      <MiniCart />
      
      {/* Other overlays */}
      <Toaster />
      <AccessibilityMenu />
    </div>
  );
}

export default App;
