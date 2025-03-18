import { useState, useEffect } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollEffect } from "@/hooks/useScrollEffect";

export default function LanguageSwitcher() {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isThresholdExceeded } = useScrollEffect({
    threshold: 50
  });
  
  // Close the menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      setIsMenuOpen(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Function to toggle language directly
  const toggleLanguage = () => {
    const newLang = language === "en" ? "he" : "en";
    
    try {
      // Set the language in local storage
      localStorage.setItem("language", newLang);
      
      // Change document direction immediately
      document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
      document.documentElement.lang = newLang;
      
      // Force reload the page to ensure all components update properly
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("Failed to switch language:", error);
    }
  };
  
  // Function to handle language selection from menu
  const handleLanguageChange = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    
    try {
      // Set the language in local storage
      localStorage.setItem("language", lang);
      
      // Change document direction immediately
      document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
      
      // Force reload the page to ensure all components update properly
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("Failed to switch language:", error);
    }
  };
  
  // Toggle the menu open/closed
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };
  
  // On mobile, use a simple button to toggle between languages
  if (isMobile) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className={`min-w-[38px] h-9 flex items-center justify-center rounded-full transition-colors ${
            isThresholdExceeded 
              ? "bg-white/90 text-neutral-700 hover:bg-primary/5 hover:text-primary border-transparent shadow-sm" 
              : "bg-white/15 text-white hover:bg-white/25 border-white/10 backdrop-blur-sm"
          }`}
          onClick={toggleLanguage}
        >
          <GlobeIcon className="h-4 w-4" />
          <span className="sr-only">{language === "he" ? "החלף שפה" : "Switch Language"}</span>
        </Button>
      </motion.div>
    );
  }
  
  // Desktop dropdown menu
  return (
    <div className="relative">
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative rounded-full transition-all ${
            isThresholdExceeded 
              ? "bg-white/90 text-neutral-700 hover:bg-primary/5 hover:text-primary shadow-sm" 
              : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
          }`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label={language === "he" ? "החלף שפה" : "Switch Language"}
        >
          <GlobeIcon className="h-4.5 w-4.5" />
          <motion.span 
            className="absolute inset-0 rounded-full border border-transparent"
            animate={{
              boxShadow: isMenuOpen ? '0 0 0 2px hsla(var(--primary), 0.4)' : '0 0 0 0px transparent',
              borderColor: isMenuOpen ? 'hsla(var(--primary), 0.4)' : 'transparent',
            }}
            transition={{ duration: 0.2 }}
          />

        </Button>
      </motion.div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-neutral-100"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="py-1.5">
              <div 
                role="menuitem"
                className={`group px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                  language === "en" 
                    ? "bg-primary/5 text-primary font-medium" 
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
                onClick={(e) => handleLanguageChange(e, "en")}
              >
                <div className="flex items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3 transition-colors ${
                    language === "en"
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200"
                  }`}>EN</span>
                  <span className="font-medium">English</span>
                </div>
                {language === "en" && (
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </motion.svg>
                )}
              </div>
              
              <div 
                role="menuitem"
                className={`group px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                  language === "he" 
                    ? "bg-primary/5 text-primary font-medium" 
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
                onClick={(e) => handleLanguageChange(e, "he")}
              >
                <div className="flex items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3 transition-colors ${
                    language === "he"
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200"
                  }`}>עב</span>
                  <span className="font-medium">עברית</span>
                </div>
                {language === "he" && (
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </motion.svg>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}