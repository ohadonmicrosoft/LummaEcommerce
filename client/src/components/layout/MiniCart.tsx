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
  const { closeCart } = useUI();
  const { cartItems, updateCartItemQuantity, removeCartItem, getTotalPrice, isLoading } = useCart();
  
  // Track quantity changes for animation
  const [changedItemId, setChangedItemId] = useState<number | null>(null);
  
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
      />
      
      <motion.div 
        className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-2xl z-10 flex flex-col"
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
            <Badge variant="outline" className="font-normal ml-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full hover:bg-primary/10"
          >
            <X size={20} className="text-secondary hover:text-primary transition-colors" />
          </Button>
        </header>
        
        {/* Progress bar for free shipping */}
        {cartItems.length > 0 && subtotal < freeShippingThreshold && (
          <div className="px-4 py-3 bg-primary/5 border-b">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Free shipping progress</span>
              <span>{formatter.format(subtotal)} of {formatter.format(freeShippingThreshold)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToFreeShipping}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs mt-1.5 text-secondary">
              {subtotal < freeShippingThreshold 
                ? `Add ${formatter.format(freeShippingThreshold - subtotal)} more to get FREE shipping!` 
                : "You've unlocked FREE shipping!"}
            </p>
          </div>
        )}
          
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 pb-4 border-b animate-pulse">
                  <div className="h-20 w-20 flex-shrink-0 bg-gray-200 rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
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
              <Button 
                className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                onClick={closeCart}
                size="lg"
              >
                Continue Shopping
                <ArrowRightCircle size={18} className="ml-2" />
              </Button>
            </motion.div>
          ) : (
            <div className="p-4 space-y-0">
              <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex gap-4 pb-4 mb-4 border-b last:border-b-0 relative"
                    variants={itemVariants}
                    initial="visible"
                    exit="exit"
                    layout
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
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                      {(item.colorVariant || item.sizeVariant) && (
                        <div className="flex gap-2 my-1">
                          {item.colorVariant && (
                            <Badge variant="outline" className="text-xs bg-white">
                              {item.colorVariant}
                            </Badge>
                          )}
                          {item.sizeVariant && (
                            <Badge variant="outline" className="text-xs bg-white">
                              {item.sizeVariant}
                            </Badge>
                          )}
                        </div>
                      )}
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
                        <div className="text-right">
                          <div className="font-medium">
                            {formatter.format((item.product.salePrice || item.product.price) * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-secondary">
                              {formatter.format(item.product.salePrice || item.product.price)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-white border shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-500"
                      onClick={() => removeCartItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
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
              <Button className="w-full bg-accent hover:bg-accent-dark text-white font-medium shadow-md hover:shadow-lg mb-3 transition-all duration-300">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                onClick={closeCart}
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
