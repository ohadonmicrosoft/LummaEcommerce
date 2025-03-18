import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  // Setup page scroll animations
  const scrollVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  return (
    <motion.div
      variants={scrollVariants}
      initial="initial"
      animate="enter"
    >
      {/* Hero Banner */}
      <HeroSection />
      
      {/* Categories Grid */}
      <CategoryShowcase />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Features/Benefits */}
      <FeaturesSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Newsletter */}
      <NewsletterSection />
    </motion.div>
  );
}
