import { createContext, useContext, useState, useEffect } from "react";

interface UIContextType {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMegaMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMegaMenu: () => void;
  closeMegaMenu: () => void;
  toggleMobileMenu: () => void;
  isHeaderScrolled: boolean;
}

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
  toggleMobileMenu: () => {},
  isHeaderScrolled: false,
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Disable body scroll when modals are open
  useEffect(() => {
    const shouldDisableScroll = isCartOpen || isSearchOpen || isMobileMenuOpen;
    
    if (shouldDisableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isSearchOpen, isMobileMenuOpen]);

  // Functions to control UI states
  function openCart() {
    setIsCartOpen(true);
    setIsSearchOpen(false);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function openSearch() {
    setIsSearchOpen(true);
    setIsCartOpen(false);
  }

  function closeSearch() {
    setIsSearchOpen(false);
  }

  function openMegaMenu() {
    setIsMegaMenuOpen(true);
  }

  function closeMegaMenu() {
    setIsMegaMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(prev => !prev);
  }

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        isSearchOpen,
        isMegaMenuOpen,
        isMobileMenuOpen,
        openCart,
        closeCart,
        openSearch,
        closeSearch,
        openMegaMenu,
        closeMegaMenu,
        toggleMobileMenu,
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
