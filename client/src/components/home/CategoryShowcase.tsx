import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Category } from "@/types";
import CategoryCard from "@/components/ui/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CategoryShowcase() {
  const { t } = useLanguage();
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <section id="categories" className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">{t("home.categories.title")}</h2>
            <p className="text-secondary max-w-2xl mx-auto">{t("home.categories.description")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/40 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="categories" className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold mb-4">{t("home.categories.title")}</h2>
            <p className="text-error">{t("errors.failedToLoadCategories")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-12 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-slate-800">{t("home.categories.title")}</h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto px-2">
            {t("home.categories.description")}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {Array.isArray(categories) && categories.map((category: Category) => (
            <motion.div key={category.id} variants={item}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
