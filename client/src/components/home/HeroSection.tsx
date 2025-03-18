import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const { t, dir, language } = useLanguage();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  // Hard-code the translations directly as a fallback method
  const translations = {
    en: {
      title: "Tactical Gear for Modern Adventures",
      subtitle: "Professional equipment for outdoor enthusiasts and tactical professionals",
      cta: "Shop Now",
      secondaryCta: "Our Story",
      scrollText: "Scroll to explore"
    },
    he: {
      title: "ציוד טקטי להרפתקאות מודרניות",
      subtitle: "ציוד מקצועי לחובבי טיולים ואנשי מקצוע טקטיים",
      cta: "קנה עכשיו",
      secondaryCta: "הסיפור שלנו",
      scrollText: "גלול לגלות"
    }
  };
  
  // Use direct translations as fallback
  const currentTranslations = translations[language] || translations.en;
  
  // Update direct content
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = currentTranslations.title;
    }
    if (subtitleRef.current) {
      subtitleRef.current.textContent = currentTranslations.subtitle;
    }
  }, [language, currentTranslations]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Fallback Image */}
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block w-full h-full">
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="https://images.unsplash.com/photo-1553304390-83c2e7b9ce2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=80"
          >
            <source src="https://player.vimeo.com/external/370467553.hd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842dedb8e97&profile_id=175&oauth2_token_id=57447761" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Fallback image for mobile */}
        <img 
          src="https://images.unsplash.com/photo-1553304390-83c2e7b9ce2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="Tactical gear in action" 
          className="md:hidden w-full h-full object-cover"
        />
        {/* Enhanced overlay with multiple gradients */}
        <div className="absolute inset-0">
          {/* Base dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-sky-700/40 to-black/70"></div>
          {/* Top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-1/4"></div>
          {/* Bottom vignette for text contrast */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
          {/* Subtle texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')]"></div>
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 text-white">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            ref={titleRef}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-5 md:mb-6 leading-tight tracking-tight text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2)"
            }}
          >
            {currentTranslations.title}
          </motion.h1>
          <motion.p 
            ref={subtitleRef}
            className="text-lg md:text-2xl mb-8 md:mb-10 font-light max-w-2xl mx-auto text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }}
          >
            {currentTranslations.subtitle}
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="#categories">
                <span className="block w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 px-8 md:px-10 rounded-lg transition-all duration-300 text-base md:text-lg cursor-pointer shadow-lg border border-white/20 backdrop-blur-sm">
                  {currentTranslations.cta}
                </span>
              </Link>
            </motion.div>
            <motion.div className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="#about">
                <span className="block w-full bg-white/10 hover:bg-white/20 border border-white/40 text-white font-bold py-3.5 px-8 md:px-10 rounded-lg transition-all duration-300 text-base md:text-lg cursor-pointer shadow-lg backdrop-blur-sm">
                  {currentTranslations.secondaryCta}
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div 
          className="flex flex-col items-center text-white bg-sky-600/60 rounded-full py-2.5 px-6 backdrop-blur-sm shadow-xl border border-white/20"
          whileHover={{ 
            backgroundColor: "rgba(14, 165, 233, 0.7)",
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
            y: -5
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-bold mb-1 tracking-wide">{currentTranslations.scrollText}</span>
          <motion.div
            animate={{ 
              y: [0, 6, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
        
        {/* Subtle decorative glow effect */}
        <motion.div 
          className="absolute -z-10 w-full h-full rounded-full blur-xl bg-sky-400/30 opacity-70"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
      </motion.div>
      
      {/* Shape Divider */}
      <div className="custom-shape-divider absolute bottom-0 left-0 w-full overflow-hidden line-height-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 120L0 16.48V0h1200v120z" className="fill-background"></path>
        </svg>
      </div>
    </section>
  );
}
