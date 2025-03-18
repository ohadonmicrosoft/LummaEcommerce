import { Link } from "wouter";
import { motion } from "framer-motion";
import { Category } from "@/types";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <motion.div 
        className="category-card group relative overflow-hidden rounded-lg h-72 md:h-80 shadow-xl cursor-pointer border border-gray-100"
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          borderColor: "rgba(255, 255, 255, 0.2)"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Image with overlay animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"
          />
          <motion.img 
            src={category.imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08, filter: "brightness(1.1)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 z-20">
          <motion.h3 
            initial={{ y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
            className="font-heading text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow tracking-tight"
          >
            {category.name}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
            className="text-white/80 text-sm md:text-base mb-5 max-w-sm font-light leading-relaxed"
          >
            {category.description}
          </motion.p>
          <motion.div 
            className="text-white font-semibold flex items-center bg-sky-500 hover:bg-sky-600 py-2.5 px-5 rounded-md self-start transition-all duration-300 shadow-md"
            whileHover={{ 
              x: 5, 
              scale: 1.05, 
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Collection <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
