import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'icon' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function WishlistButton({
  product,
  className,
  variant = 'default',
  size = 'md',
  showText = false
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const isActive = isInWishlist(product.id);
  
  // Handle toggle wishlist
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };
  
  // Define heart animation
  const heartVariants = {
    initial: { scale: 1 },
    active: { scale: [1, 1.3, 1], transition: { duration: 0.3 } }
  };
  
  // Render different button variants
  if (variant === 'icon') {
    const sizeClasses = {
      'sm': 'h-7 w-7',
      'md': 'h-9 w-9',
      'lg': 'h-11 w-11'
    };
    
    return (
      <motion.button
        onClick={handleToggleWishlist}
        className={cn(
          'rounded-full flex items-center justify-center',
          'bg-white border shadow-sm hover:shadow-md transition-shadow',
          isActive ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-50',
          sizeClasses[size],
          className
        )}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      >
        <motion.div
          variants={heartVariants}
          animate={isActive ? 'active' : 'initial'}
        >
          <Heart size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} fill={isActive ? "currentColor" : "none"} />
        </motion.div>
      </motion.button>
    );
  }
  
  if (variant === 'subtle') {
    return (
      <motion.button
        onClick={handleToggleWishlist}
        className={cn(
          'flex items-center gap-1.5 py-1 px-2 rounded-md',
          isActive ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100',
          className
        )}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      >
        <motion.div
          variants={heartVariants}
          animate={isActive ? 'active' : 'initial'}
        >
          <Heart size={16} fill={isActive ? "currentColor" : "none"} />
        </motion.div>
        {showText && (
          <span className="text-sm font-medium">
            {isActive ? "Saved" : "Save"}
          </span>
        )}
      </motion.button>
    );
  }
  
  // Default button style
  return (
    <Button
      variant={isActive ? "destructive" : "outline"}
      size="sm"
      onClick={handleToggleWishlist}
      className={cn(
        'gap-1.5',
        className
      )}
      disabled={isLoading}
    >
      <motion.div
        variants={heartVariants}
        animate={isActive ? 'active' : 'initial'}
      >
        <Heart size={16} fill={isActive ? "currentColor" : "none"} />
      </motion.div>
      {showText && (
        <span>
          {isActive ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
}