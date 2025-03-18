import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products?featured=true&limit=4'],
  });
  
  const scrollContainer = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="text-center mb-8">
              <h2 className="font-heading text-4xl font-bold mb-4 text-slate-800">{t("home.featured.title")}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{t("home.featured.description")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/40 rounded-lg h-96 animate-pulse shadow-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold mb-4 text-slate-800">{t("home.featured.title")}</h2>
              <p className="text-red-600 mt-4">{t("errors.failedToLoadProducts")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-sky-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-4xl font-bold mb-4 text-slate-800">{t("home.featured.title")}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t("home.featured.description")}
            </p>
          </motion.div>
          <div className="flex space-x-2">
            <button 
              id="prev-featured" 
              className="h-10 w-10 rounded-full border border-sky-300 bg-sky-100 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-colors" 
              aria-label="Previous slide"
              onClick={scrollLeft}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              id="next-featured" 
              className="h-10 w-10 rounded-full border border-sky-300 bg-sky-100 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-colors" 
              aria-label="Next slide"
              onClick={scrollRight}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:overflow-x-auto md:scroll-smooth md:scroll-px-6 md:snap-x md:snap-mandatory"
        >
          {Array.isArray(products) && products.map((product: Product) => (
            <div key={product.id} className="md:snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="inline-block border-2 border-sky-400 text-sky-600 hover:bg-sky-500 hover:border-sky-500 hover:text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
          >
            {t("home.featured.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
