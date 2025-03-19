import { createContext, useContext, useState, useEffect } from "react";

interface UIContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isMegaMenuOpen: boolean;
  openMegaMenu: () => void;
  closeMegaMenu: () => void;
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  miniCartOpen: boolean;
  setMiniCartOpen: (isOpen: boolean) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isHeaderScrolled?: boolean;
}

// Create context with default values instead of undefined
export const UIContext = createContext<UIContextType>({
  isCartOpen: false,
  isSearchOpen: false,
  isMegaMenuOpen: false,
  isMobileMenuOpen: false,
  miniCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  openSearch: () => {},
  closeSearch: () => {},
  openMegaMenu: () => {},
  closeMegaMenu: () => {},
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
  toggleMobileMenu: () => {},
  setMobileMenuOpen: () => {},
  setMiniCartOpen: () => {},
  isHeaderScrolled: false,
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debug logging for miniCartOpen state
  useEffect(() => {
    console.log("[UIContext] miniCartOpen state changed to:", miniCartOpen);
  }, [miniCartOpen]);

  // Functions for menu
  const openMegaMenu = () => setIsMegaMenuOpen(true);
  const closeMegaMenu = () => setIsMegaMenuOpen(false);
  
  // Functions for mobile menu
  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  
  // Functions for cart
  const openCart = () => {
    console.log("[UIContext] openCart called");
    setIsCartOpen(true);
    setMiniCartOpen(true); // Also set miniCartOpen
  };
  
  const closeCart = () => {
    console.log("[UIContext] closeCart called");
    setIsCartOpen(false);
    setMiniCartOpen(false); // Also clear miniCartOpen
  };
  
  // Functions for search
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        isCartOpen,
        openCart,
        closeCart,
        isMegaMenuOpen,
        openMegaMenu,
        closeMegaMenu,
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        miniCartOpen,
        setMiniCartOpen,
        setMobileMenuOpen: setIsMobileMenuOpen,
        isHeaderScrolled
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
