import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/contexts/UIContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollEffect } from "@/hooks/useScrollEffect";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { Search, User, ShoppingBag, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hard-code navigation translations directly as a fallback
const navTranslations = {
  en: {
    categories: "Categories",
    shop: "Shop",
    stores: "Store Locator",
    sale: "Sale",
    about: "About",
    contact: "Contact",
    account: "Account",
    wishlist: "Wishlist",
    search: "Search",
    cart: "Cart"
  },
  he: {
    categories: "קטגוריות",
    shop: "חנות",
    stores: "מיקומי חנויות",
    sale: "מבצע",
    about: "אודות",
    contact: "צור קשר",
    account: "חשבון",
    wishlist: "רשימת משאלות",
    search: "חיפוש",
    cart: "עגלה"
  }
};

export default function Header() {
  const { 
    openCart, 
    openSearch, 
    isMegaMenuOpen, 
    openMegaMenu, 
    closeMegaMenu,
    toggleMobileMenu,
    isMobileMenuOpen,
    setMobileMenuOpen,
    setMiniCartOpen,
  } = useUI();
  const { cartItems, getTotalItems, cartCountChanged, resetCartCountChanged } = useCart();
  const { wishlistItems } = useWishlist();
  const { t, dir, language } = useLanguage();
  
  // Track cart item count
  const [prevCartCount, setPrevCartCount] = useState(0);
  
  // Use direct translations map as fallback
  const nav = navTranslations[language] || navTranslations.en;
  
  const { isThresholdExceeded } = useScrollEffect({
    threshold: 50
  });
  
  // Track cart count changes
  useEffect(() => {
    const currentTotalItems = getTotalItems();
    
    // Update the previous count reference
    if (currentTotalItems !== prevCartCount) {
      setPrevCartCount(currentTotalItems);
    }
  }, [cartItems, getTotalItems, prevCartCount]);
  
  // Reset cart count changed flag after animation duration
  useEffect(() => {
    if (cartCountChanged) {
      const timer = setTimeout(() => {
        resetCartCountChanged();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cartCountChanged, resetCartCountChanged]);
  
  // Log when the component renders with current cart information
  useEffect(() => {
    const totalItemCount = getTotalItems();
    console.log("[Header] Rendering with cart items:", totalItemCount);
  }, [getTotalItems, cartItems]);

  // Debug logging for header render
  console.log("[Header] Rendering - Cart items count:", getTotalItems());
  
  // Force an update for cart indicator
  useEffect(() => {
    console.log("[Header] Cart items count changed:", getTotalItems(), "cartCountChanged:", cartCountChanged);
    
    // Debug the active state of the cart button elements
    const mainCartBtn = document.getElementById('main-cart-button');
    const mobileCartBtn = document.getElementById('mobile-cart-button');
    
    console.log("[Header] Main cart button exists:", !!mainCartBtn);
    console.log("[Header] Mobile cart button exists:", !!mobileCartBtn);
    
    // Apply an animated class for visibility
    const cartBadges = document.querySelectorAll('.cart-badge');
    console.log("[Header] Found cart badges:", cartBadges.length);
    
    cartBadges.forEach(badge => {
      badge.classList.add('cart-badge-highlight');
      // Make badges more visible
      badge.setAttribute('style', 'display: flex !important; background-color: red !important;');
      
      setTimeout(() => {
        badge.classList.remove('cart-badge-highlight');
      }, 1000);
    });
  }, [getTotalItems(), cartCountChanged]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isThresholdExceeded 
          ? "scrolled bg-white shadow-sm" 
          : "bg-gradient-to-b from-primary/75 via-primary/30 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="group relative inline-flex items-center">
                <span 
                  className={`text-2xl font-bold tracking-tight cursor-pointer transition-colors ${
                    isThresholdExceeded ? "text-neutral-900" : "text-white"
                  }`}
                  style={{ letterSpacing: "-0.02em" }}
                >
                  LUMA
                </span>
                <span 
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ease-in-out bg-current group-hover:w-full ${
                    isThresholdExceeded ? "bg-primary" : "bg-white/90"
                  }`}
                ></span>
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className={`hidden lg:flex items-center space-x-8 rtl:space-x-reverse ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div 
              className="relative group"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <button 
                className={`font-medium flex items-center transition-colors duration-200 ${
                  isThresholdExceeded 
                    ? "text-neutral-800 hover:text-primary" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {nav.categories}
              </button>
              
              {/* Mega Menu */}
              <div 
                className={`absolute top-full ${dir === "rtl" ? "right-0" : "left-0"} w-screen bg-white rounded-b-md mt-1 z-50 mega-menu overflow-hidden ${
                  isMegaMenuOpen ? "block" : "hidden"
                }`}
                style={{ 
                  boxShadow: "var(--shadow-lg)",
                  borderTop: "1px solid rgba(0, 0, 0, 0.03)"
                }}
              >
                <div className="container mx-auto p-6 grid grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-sans font-bold text-lg mb-4 text-primary">Tactical Gear</h3>
                    <ul className="space-y-2">
                      <li><Link href="/products?category=plate-carriers"><span className="hover:text-accent cursor-pointer">Plate Carriers</span></Link></li>
                      <li><Link href="/products?category=belts-holsters"><span className="hover:text-accent cursor-pointer">Belts & Holsters</span></Link></li>
                      <li><Link href="/products?category=helmets"><span className="hover:text-accent cursor-pointer">Helmets</span></Link></li>
                      <li><Link href="/products?category=eye-protection"><span className="hover:text-accent cursor-pointer">Eye Protection</span></Link></li>
                      <li><Link href="/products?category=gloves"><span className="hover:text-accent cursor-pointer">Gloves</span></Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg mb-4 text-primary">Outdoor</h3>
                    <ul className="space-y-2">
                      <li><Link href="/products?category=tents-shelters"><span className="hover:text-accent cursor-pointer">Tents & Shelters</span></Link></li>
                      <li><Link href="/products?category=backpacks"><span className="hover:text-accent cursor-pointer">Backpacks</span></Link></li>
                      <li><Link href="/products?category=navigation"><span className="hover:text-accent cursor-pointer">Navigation</span></Link></li>
                      <li><Link href="/products?category=lighting"><span className="hover:text-accent cursor-pointer">Lighting</span></Link></li>
                      <li><Link href="/products?category=cooking"><span className="hover:text-accent cursor-pointer">Cooking</span></Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg mb-4 text-primary">Apparel</h3>
                    <ul className="space-y-2">
                      <li><Link href="/products?category=jackets"><span className="hover:text-accent cursor-pointer">Jackets</span></Link></li>
                      <li><Link href="/products?category=base-layers"><span className="hover:text-accent cursor-pointer">Base Layers</span></Link></li>
                      <li><Link href="/products?category=footwear"><span className="hover:text-accent cursor-pointer">Footwear</span></Link></li>
                      <li><Link href="/products?category=all-weather"><span className="hover:text-accent cursor-pointer">All-Weather</span></Link></li>
                      <li><Link href="/products?category=accessories"><span className="hover:text-accent cursor-pointer">Accessories</span></Link></li>
                    </ul>
                  </div>
                  <div className="row-span-1 bg-primary rounded-lg p-4 flex items-center">
                    <div>
                      <h3 className="font-sans font-bold text-lg mb-2 text-white">
                        {language === "he" ? "מוצרים מובחרים" : "Featured Products"}
                      </h3>
                      <p className="text-neutral-dark text-sm mb-3">
                        {language === "he" ? "בדוק את הציוד הטקטי החדש שלנו" : "Check out our latest tactical gear"}
                      </p>
                      <Link href="/products?newArrival=true">
                        <span className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-md inline-block transition-colors cursor-pointer">
                          {language === "he" ? "קנה עכשיו" : "Shop Now"}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/products?newArrival=true">
              <motion.div 
                className={`font-medium cursor-pointer transition-all duration-300 hover:text-primary ${
                  isThresholdExceeded ? "text-gray-800" : "text-white"
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {nav.shop}
              </motion.div>
            </Link>
            <Link href="/stores">
              <motion.div 
                className={`font-medium cursor-pointer transition-all duration-300 hover:text-primary ${
                  isThresholdExceeded ? "text-gray-800" : "text-white"
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {nav.stores}
              </motion.div>
            </Link>
            <Link href="/products?sale=true">
              <motion.div 
                className={`font-medium cursor-pointer transition-all duration-300 hover:text-primary ${
                  isThresholdExceeded ? "text-gray-800" : "text-white"
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {nav.sale}
              </motion.div>
            </Link>
            <Link href="/about">
              <motion.div 
                className={`font-medium cursor-pointer transition-all duration-300 hover:text-primary ${
                  isThresholdExceeded ? "text-gray-800" : "text-white"
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {nav.about}
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div 
                className={`font-medium cursor-pointer transition-all duration-300 hover:text-primary ${
                  isThresholdExceeded ? "text-gray-800" : "text-white"
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {nav.contact}
              </motion.div>
            </Link>
          </nav>

          {/* Search, Account, Cart, Language */}
          <div className={`flex items-center space-x-3 md:space-x-5 rtl:space-x-reverse ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            
            <motion.button 
              type="button" 
              className={`p-2 rounded-full transition-all duration-300 ${
                isThresholdExceeded 
                  ? "bg-gray-100 text-gray-800 hover:bg-primary/10 hover:text-primary" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={openSearch} 
              aria-label={nav.search}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            <Link href="/account" className="hidden md:block">
              <motion.span 
                className={`cursor-pointer p-2 rounded-full block transition-all duration-300 ${
                  isThresholdExceeded 
                    ? "bg-gray-100 text-gray-800 hover:bg-primary/10 hover:text-primary" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5" />
              </motion.span>
            </Link>
            
            <Link href="/wishlist" className="hidden md:block">
              <motion.span 
                className={`cursor-pointer p-2 rounded-full block transition-all duration-300 ${
                  isThresholdExceeded 
                    ? "bg-gray-100 text-gray-800 hover:bg-primary/10 hover:text-primary" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </motion.span>
            </Link>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                id="main-cart-button"
                className="cart-button relative hover:bg-primary/10 active:scale-95 transition-all border border-gray-300"
                onClick={() => {
                  console.log("[Header] Cart button clicked, items:", getTotalItems());
                  setMiniCartOpen(true);
                }}
                aria-label="Shopping cart"
                data-testid="cart-button"
                style={{ backgroundColor: "#f0f0f0" }}
              >
                <ShoppingBag className="h-5 w-5" />
                <div 
                  className="cart-badge absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-cart-badge-pulse"
                  style={{display: getTotalItems() > 0 ? 'flex' : 'none'}}
                >
                  {getTotalItems()}
                </div>
              </Button>
            </div>
            
            <motion.button 
              className={`lg:hidden p-2 rounded-full transition-all duration-300 ${
                isThresholdExceeded 
                  ? "bg-gray-100 text-gray-800 hover:bg-primary/10 hover:text-primary" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={toggleMobileMenu} 
              aria-label="Menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <motion.div 
        className={`lg:hidden fixed top-[72px] inset-x-0 bg-white/95 backdrop-blur-md shadow-xl z-40 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ 
          maxHeight: "calc(100vh - 72px)", 
          overflowY: "auto",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)"
        }}
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: -20 }
        }}
      >
        <div className="container mx-auto px-4 py-5">
          <nav className={`flex flex-col space-y-2 ${dir === "rtl" ? "items-end" : "items-start"}`}>
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.1 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/products?category=all">
                <div
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.categories}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.15 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/products?newArrival=true">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.shop}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.2 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/stores">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.stores}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.25 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/products?sale=true">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors relative"
                  onClick={toggleMobileMenu}
                >
                  {nav.sale}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.3 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/about">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.about}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.35 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/contact">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.contact}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.4 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/account">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {nav.account}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.45 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <Link href="/wishlist">
                <div 
                  className="text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors relative"
                  onClick={toggleMobileMenu}
                >
                  {nav.wishlist}
                  {wishlistItems.length > 0 && (
                    <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 text-xs font-medium bg-accent text-white rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full"
              variants={{
                open: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.5 }
                },
                closed: { opacity: 0, y: -10 }
              }}
            >
              <div 
                id="mobile-cart-button"
                className="cart-button text-gray-800 font-medium text-lg w-full py-3 px-4 block hover:bg-primary/5 hover:text-primary rounded-xl transition-colors relative cursor-pointer active:translate-y-0.5 active:bg-primary/10 border border-gray-300"
                onClick={() => {
                  console.log("[Header] Mobile cart clicked, items:", getTotalItems());
                  toggleMobileMenu();
                  setMiniCartOpen(true);
                }}
                data-testid="mobile-cart-button"
                style={{ backgroundColor: "#f0f0f0" }}
              >
                {nav.cart}
                <div
                  className="cart-badge absolute right-4 top-1/2 -translate-y-1/2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  style={{display: getTotalItems() > 0 ? 'flex' : 'none'}}
                >
                  {getTotalItems()}
                </div>
              </div>
            </motion.div>
          </nav>
        </div>
      </motion.div>
    </header>
  );
}
