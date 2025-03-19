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
  setMobileMenuOpen: (isOpen: boolean) => void;
  isHeaderScrolled?: boolean;
  miniCartOpen: boolean;
  setMiniCartOpen: (isOpen: boolean) => void;
}

// Debug console log
console.log("[UIContext] Module loaded");

// Create context with default values instead of undefined
export const UIContext = createContext<UIContextType>({
  isCartOpen: false,
  isSearchOpen: false,
  isMegaMenuOpen: false,
  isMobileMenuOpen: false,
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
  isHeaderScrolled: false,
  miniCartOpen: false,
  setMiniCartOpen: () => {},
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  // Debug log on provider mount
  useEffect(() => {
    console.log("[UIContext] Provider mounted");
  }, []);

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
    setMiniCartOpen(true);
  };
  
  const closeCart = () => {
    console.log("[UIContext] closeCart called");
    setIsCartOpen(false);
    setMiniCartOpen(false);
  };
  
  const handleSetMiniCartOpen = (isOpen: boolean) => {
    console.log("[UIContext] setMiniCartOpen called with:", isOpen);
    setMiniCartOpen(isOpen);
    setIsCartOpen(isOpen);
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
        setMobileMenuOpen: setIsMobileMenuOpen,
        isHeaderScrolled,
        miniCartOpen,
        setMiniCartOpen: handleSetMiniCartOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
