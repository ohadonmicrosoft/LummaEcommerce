import { useState } from "react";
import { motion } from "framer-motion";
import { useUI } from "@/contexts/UIContext";
import { Link } from "wouter";
import { fadeIn } from "@/lib/animations";

export default function SearchOverlay() {
  const { closeSearch } = useUI();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
      closeSearch();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-primary/90 flex items-start justify-center pt-20 z-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="container px-4 max-w-3xl">
        <form className="bg-white rounded-lg shadow-2xl overflow-hidden" onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full py-4 px-6 text-lg focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary hover:text-accent transition-colors" 
              aria-label="Search"
            >
              <i className="fas fa-search text-xl"></i>
            </button>
          </div>
          <div className="p-6 border-t">
            <h3 className="font-heading font-medium mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/products?category=plate-carriers">
                <a 
                  className="bg-neutral px-3 py-1 rounded-full text-secondary hover:bg-neutral-dark transition-colors"
                  onClick={closeSearch}
                >
                  Plate Carriers
                </a>
              </Link>
              <Link href="/products?category=tactical-backpacks">
                <a 
                  className="bg-neutral px-3 py-1 rounded-full text-secondary hover:bg-neutral-dark transition-colors"
                  onClick={closeSearch}
                >
                  Tactical Backpacks
                </a>
              </Link>
              <Link href="/products?category=battle-belts">
                <a 
                  className="bg-neutral px-3 py-1 rounded-full text-secondary hover:bg-neutral-dark transition-colors"
                  onClick={closeSearch}
                >
                  Battle Belts
                </a>
              </Link>
              <Link href="/products?category=outdoor-tents">
                <a 
                  className="bg-neutral px-3 py-1 rounded-full text-secondary hover:bg-neutral-dark transition-colors"
                  onClick={closeSearch}
                >
                  Outdoor Tents
                </a>
              </Link>
              <Link href="/products?category=tactical-boots">
                <a 
                  className="bg-neutral px-3 py-1 rounded-full text-secondary hover:bg-neutral-dark transition-colors"
                  onClick={closeSearch}
                >
                  Tactical Boots
                </a>
              </Link>
            </div>
          </div>
        </form>
        <button 
          className="mt-6 mx-auto flex items-center justify-center text-white hover:text-accent transition-colors"
          onClick={closeSearch}
        >
          <i className="fas fa-times mr-2"></i>
          <span>Close</span>
        </button>
      </div>
    </motion.div>
  );
}
