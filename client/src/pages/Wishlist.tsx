import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fadeIn, staggerContainer, staggerItem } from '@/lib/animations';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());

  const handleAddToCart = async (id: number) => {
    const item = wishlistItems.find(item => item.product.id === id);
    if (!item) return;

    setProcessingItems(prev => new Set(prev).add(id));
    
    try {
      await addToCart({
        productId: item.product.id,
        quantity: 1
      });
      
      toast({
        title: "Added to cart",
        description: `${item.product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleRemoveFromWishlist = async (id: number) => {
    setProcessingItems(prev => new Set(prev).add(id));
    
    try {
      await removeFromWishlist(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;
    
    try {
      await clearWishlist();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="container px-4 py-12 max-w-6xl mx-auto">
      <motion.div
        className="mb-12 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length === 0
                ? "Your wishlist is empty"
                : `You have ${wishlistItems.length} item${wishlistItems.length === 1 ? "" : "s"} in your wishlist`}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearWishlist} 
              disabled={isLoading}
            >
              Clear Wishlist
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div 
            className="text-center py-20 px-6 bg-gradient-to-b from-muted/20 to-muted/5 rounded-xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto space-y-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-muted/20 text-primary/40"
              >
                <Heart className="w-12 h-12" />
              </motion.div>
              
              <div className="space-y-4">
                <motion.h3 
                  className="text-2xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your wishlist is empty
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground mx-auto max-w-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Save your favorite tactical and outdoor gear items to come back to them later or share with friends and family.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button asChild size="lg" className="font-medium px-8">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer as any}
            initial="initial"
            animate="animate"
          >
            {wishlistItems.map((item) => (
              <motion.div 
                key={item.id}
                variants={staggerItem as any}
                layout
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="overflow-hidden h-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <div className="relative h-64 overflow-hidden group">
                    {/* Overlay effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-60 transition-all duration-500 z-10 mix-blend-overlay"></div>
                    
                    {/* Product badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                      {item.product.newArrival && (
                        <motion.span 
                          className="bg-accent/90 text-white text-xs font-bold rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm border border-white/20"
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          whileHover={{ scale: 1.08, x: 3 }}
                        >
                          NEW
                        </motion.span>
                      )}
                      {item.product.bestSeller && (
                        <motion.span 
                          className="bg-success/90 text-white text-xs font-bold rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm border border-white/20"
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          whileHover={{ scale: 1.08, x: 3 }}
                        >
                          BESTSELLER
                        </motion.span>
                      )}
                      {item.product.salePrice && (
                        <motion.span 
                          className="bg-primary/90 text-white text-xs font-bold rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm border border-white/20"
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          whileHover={{ scale: 1.08, x: 3 }}
                        >
                          SALE
                        </motion.span>
                      )}
                    </div>
                
                    {/* Product image with enhanced animations */}
                    <motion.img 
                      src={item.product.mainImage} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        filter: "brightness(1.1) contrast(1.05)"
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                    
                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 space-y-3 z-20">
                      <motion.button
                        className="h-10 w-10 rounded-full bg-white shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-300 border border-white/20"
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        disabled={processingItems.has(item.product.id) || isLoading}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ 
                          scale: 1.15, 
                          boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
                          y: -2
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 font-heading text-lg font-bold tracking-tight">
                      <Link href={`/products/${item.product.slug}`}>
                        <motion.span 
                          className="hover:text-primary transition-colors duration-300 cursor-pointer"
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.product.name}
                        </motion.span>
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Added on {new Date(item.dateAdded).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        className="font-bold text-lg"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-primary tracking-tight">
                          {formatter.format(item.product.salePrice || item.product.price)}
                        </span>
                        {item.product.salePrice && (
                          <span className="text-secondary line-through ml-2 text-sm opacity-75 font-normal">
                            {formatter.format(item.product.price)}
                          </span>
                        )}
                      </motion.div>
                      <div className="text-sm">
                        {item.product.inStock ? (
                          <span className="text-success font-medium px-2 py-1 bg-success/10 rounded-md">In Stock</span>
                        ) : (
                          <span className="text-destructive font-medium px-2 py-1 bg-destructive/10 rounded-md">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <motion.div className="w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full gap-2 font-medium"
                        onClick={() => handleAddToCart(item.product.id)}
                        disabled={processingItems.has(item.product.id) || isLoading || !item.product.inStock}
                        size="lg"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}