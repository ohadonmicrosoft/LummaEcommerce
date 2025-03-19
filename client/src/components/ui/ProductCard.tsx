import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, ShoppingCart, BarChart2, Heart } from "lucide-react";
import { Star } from "lucide-react";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { openCart, setMiniCartOpen } = useUI();
  const { isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [isHovered, setIsHovered] = useState(false);
  const productInWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("[ProductCard] Add to cart clicked for product:", product.name);
    
    try {
      await addToCart({
        productId: product.id,
        quantity: 1
      });
      
      console.log("[ProductCard] Product added to cart successfully");
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "default",
      });
      
      // Add a delay before opening the mini cart to ensure cart state is updated
      setTimeout(() => {
        console.log("[ProductCard] Opening mini cart after adding product");
        setMiniCartOpen(true);
      }, 300);
      
    } catch (error) {
      console.error("[ProductCard] Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const ProductCard = (
    <div className="relative overflow-hidden group aspect-square">
      {/* Multiple layered effects for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-sky-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-sky-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
      />
      <motion.div
        className="absolute inset-0 bg-sky-400/10 opacity-0 group-hover:opacity-60 transition-all duration-500 z-10 mix-blend-overlay"
      />
      
      {/* Product image with enhanced animations */}
      <motion.div className="absolute inset-0 overflow-hidden bg-sky-50">
        <motion.img 
          src={product.mainImage} 
          alt={product.name}
          className="w-full h-full object-cover object-center"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? "brightness(1.1) contrast(1.05)" : "brightness(1) contrast(1)"
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            transformOrigin: "center center"
          }}
        />
      </motion.div>
      <div className="absolute top-4 right-4 space-y-3 z-20">
        <motion.button 
          className="h-11 w-11 rounded-full bg-white/95 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 border border-sky-100" 
          aria-label="Quick view"
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3, delay: 0 }}
          onClick={(e) => e.stopPropagation()}
          whileHover={{ 
            scale: 1.15, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)",
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered || productInWishlist ? 1 : 0,
            y: isHovered || productInWishlist ? 0 : -10,
            scale: isHovered || productInWishlist ? 1 : 0.8
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={(e) => e.stopPropagation()}
          whileHover={{ 
            scale: 1.15, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)",
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          className={productInWishlist ? "wishlist-active" : ""}
        >
          <WishlistButton 
            product={product} 
            variant="icon" 
            size="md" 
            className={productInWishlist ? "bg-accent text-white hover:bg-accent/90 border-accent" : ""}
          />
        </motion.div>
        <motion.button 
          className="h-11 w-11 rounded-full bg-white/95 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 border border-sky-100" 
          aria-label="Compare"
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          whileHover={{ 
            scale: 1.15, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)",
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart2 className="w-4 h-4" />
        </motion.button>
      </div>
      {/* Product badges removed as requested */}
    </div>
  );

  const RenderStars = () => (
    <div className="flex items-center text-warning">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none'}`} 
        />
      ))}
      <span className="text-secondary text-sm ml-1">({product.reviewCount})</span>
    </div>
  );

  return (
    <motion.div 
      className="product-card bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl border border-sky-100 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -10,
        scale: 1.03,
        boxShadow: "0 25px 40px rgba(59, 130, 246, 0.15)",
        transition: { duration: 0.5, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Show wishlist status badge when not hovering */}
      {productInWishlist && !isHovered && (
        <motion.div 
          className="absolute top-4 right-4 z-30 bg-rose-500 text-white rounded-full p-2 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Heart className="h-4 w-4 fill-current" />
        </motion.div>
      )}
      <Link href={`/products/${product.slug}`}>
        <div className="cursor-pointer">
          {ProductCard}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <motion.h3 
                className="font-heading text-lg font-bold tracking-tight line-clamp-2 group-hover:text-sky-600 transition-colors duration-300"
                initial={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {product.name}
              </motion.h3>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <RenderStars />
              </motion.div>
            </div>
            <div className="flex justify-between items-center mt-5">
              <motion.div
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sky-700 font-bold text-xl tracking-tight">
                  {formatter.format(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="text-slate-500 line-through ml-2 text-sm opacity-75">
                    {formatter.format(product.price)}
                  </span>
                )}
              </motion.div>
              <motion.button 
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300 shadow-lg border border-sky-400/20" 
                onClick={handleAddToCart}
                aria-label="Add to cart"
                whileTap={{ scale: 0.9 }}
                whileHover={{ 
                  scale: 1.12,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.25)",
                  y: -2
                }}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
