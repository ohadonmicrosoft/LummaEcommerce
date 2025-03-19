import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useUI } from "@/contexts/UIContext";
import { useCart } from "@/contexts/CartContext";
import { slideInRight, fadeIn } from "@/lib/animations";
import { Trash2, X, Minus, Plus, ShoppingBag, ArrowRightCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MiniCart() {
  const { closeCart, miniCartOpen, setMiniCartOpen } = useUI();
  const { 
    cartItems, 
    updateCartItemQuantity, 
    removeCartItem, 
    getTotalItems, 
    getTotalPrice, 
    isLoading,
    lastAddedItemId,
    cartCountChanged,
    resetCartCountChanged
  } = useCart();
  
  // Track quantity changes for animation
  const [changedItemId, setChangedItemId] = useState<number | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<boolean>(false);
  
  // Force a render to ensure the component is responsive
  const [forceRender, setForceRender] = useState(0);
  
  // Ensure UI stays in sync with state
  useEffect(() => {
    // Force a re-render periodically to ensure UI stays fresh
    const interval = setInterval(() => {
      setForceRender(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check for cart changed animations
  useEffect(() => {
    if (cartCountChanged) {
      setRecentlyAdded(true);
      const timer = setTimeout(() => {
        setRecentlyAdded(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cartCountChanged]);
  
  // Format currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Item removal animation
  const itemVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', marginBottom: 16, overflow: 'visible' },
    exit: { opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden', transition: { duration: 0.3 } }
  };
  
  // Cart empty state animation
  const emptyCartVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } }
  };
  
  // Add to cart success pulse animation
  const successPulseVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: { 
      scale: [1, 1.2, 1], 
      opacity: [0, 1, 0], 
      transition: { 
        duration: 1.5, 
        times: [0, 0.5, 1],
        ease: "easeInOut" 
      } 
    }
  };
  
  // Quantity change pulse animation
  const pulseQuantity = (id: number) => {
    setChangedItemId(id);
    setTimeout(() => setChangedItemId(null), 300);
  };
  
  // Handle quantity update with animation
  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    pulseQuantity(id);
    await updateCartItemQuantity(id, newQuantity);
  };
  
  // Calculate summary information
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 10.99;
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const total = subtotal + (subtotal >= 100 ? 0 : shipping) + tax;
  
  // Free shipping threshold calculation
  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // Effect to close the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (miniCartOpen && !target.closest('.mini-cart-container')) {
        setMiniCartOpen(false);
      }
    };

    if (miniCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [miniCartOpen, setMiniCartOpen]);

  // Close mini cart when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && miniCartOpen) {
        setMiniCartOpen(false);
      }
    };

    if (miniCartOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [miniCartOpen, setMiniCartOpen]);

  // Log when miniCartOpen state changes
  useEffect(() => {
    console.log("[MiniCart] miniCartOpen state changed to:", miniCartOpen);
    document.body.classList.toggle('mini-cart-open', miniCartOpen);
  }, [miniCartOpen]);

  // Log cart items when they change
  useEffect(() => {
    console.log("[MiniCart] Cart items updated:", cartItems);
  }, [cartItems]);

  console.log("[MiniCart] Rendering, miniCartOpen:", miniCartOpen, "cartItems:", cartItems.length, "forceRender:", forceRender);

  if (!miniCartOpen) {
    // Don't render anything when closed to save resources
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-testid="mini-cart-overlay">
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          console.log("[MiniCart] Backdrop clicked, closing mini cart");
          setMiniCartOpen(false);
        }}
      />
      
      <motion.div 
        className="mini-cart-container fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-2xl z-10 flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideInRight}
        style={{ 
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.12)',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px'
        }}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="font-heading font-bold text-xl flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            Your Cart 
            <motion.div
              initial={{ scale: 1 }}
              animate={recentlyAdded ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ repeat: recentlyAdded ? 1 : 0, duration: 0.3 }}
            >
              <Badge variant="outline" className={`font-normal ml-1 ${recentlyAdded ? 'bg-accent text-white' : ''}`}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </Badge>
            </motion.div>
            {recentlyAdded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-accent ml-2 font-normal"
              >
                Item added!
              </motion.span>
            )}
          </h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              console.log("[MiniCart] Close button clicked");
              setMiniCartOpen(false);
            }}
            aria-label="Close cart"
            className="rounded-full hover:bg-primary/10"
          >
            <X size={20} className="text-secondary hover:text-primary transition-colors" />
          </Button>
        </header>
        
        {/* Free shipping progress bar */}
        <div className="px-4 py-3 bg-primary/5 border-b">
          {subtotal >= freeShippingThreshold ? (
            <div className="text-center text-sm text-green-600 font-medium flex items-center gap-1 justify-center">
              <span>✓</span> You've unlocked free shipping!
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary">
                  ${(freeShippingThreshold - subtotal).toFixed(2)} away from free shipping
                </span>
                <span className="font-medium">${subtotal.toFixed(2)}/${freeShippingThreshold.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressToFreeShipping}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full text-center p-6"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">Your cart is empty</h4>
                <p className="text-secondary mb-8 max-w-xs">Ready to start shopping? Add some products to your cart to see them here.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 flex-1"
                    onClick={() => setMiniCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                  <Link href="/products?sale=true">
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 flex-1"
                      onClick={() => setMiniCartOpen(false)}
                    >
                      View Sale Items
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col space-y-0"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className={`flex gap-4 pb-4 mb-4 border-b last:border-b-0 relative ${
                        lastAddedItemId === item.id ? 'bg-primary/5 rounded-md' : ''
                      }`}
                      variants={itemVariants}
                      initial="visible"
                      exit="exit"
                      layout
                      animate={lastAddedItemId === item.id ? { 
                        scale: [1, 1.02, 1], 
                        transition: { duration: 0.6 } 
                      } : {}}
                    >
                      <div className="h-24 w-24 flex-shrink-0 bg-neutral-50 rounded-md overflow-hidden shadow-sm">
                        <motion.img 
                          src={item.product.mainImage} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-base mb-1 truncate pr-6">{item.product.name}</h4>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-neutral-100 absolute right-0 top-0"
                            onClick={() => removeCartItem(item.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 size={15} className="text-neutral-500 hover:text-red-600 transition-colors" />
                          </Button>
                        </div>
                        
                        <div className="text-neutral-600 text-sm mb-2">
                          {item.colorVariant && <span className="mr-2">Color: {item.colorVariant}</span>}
                          {item.sizeVariant && <span>Size: {item.sizeVariant}</span>}
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-r hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </Button>
                            <motion.span 
                              className="w-10 text-center"
                              animate={changedItemId === item.id ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {item.quantity}
                            </motion.span>
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-l hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          
                          <div className="font-medium">
                            {formatter.format(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {cartItems.length > 0 && (
          <motion.div 
            className="p-4 border-t bg-gray-50"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
                <span>{formatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Shipping</span>
                <span>{subtotal >= 100 ? "Free" : formatter.format(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Estimated Tax</span>
                <span>{formatter.format(tax)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatter.format(total)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <Button 
                className="w-full bg-accent hover:bg-accent-dark text-white font-medium shadow-md hover:shadow-lg mb-3 transition-all duration-300"
                onClick={() => setMiniCartOpen(false)}
              >
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setMiniCartOpen(false)}
              >
                View Full Cart
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
