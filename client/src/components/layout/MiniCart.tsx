// At the beginning of the file, add console trace to debug mounting
console.log("[MiniCart] Module loaded");

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useUI } from "@/contexts/UIContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function MiniCart() {
  const { miniCartOpen, setMiniCartOpen } = useUI();
  const { 
    cartItems, 
    updateCartItemQuantity, 
    removeCartItem, 
    getTotalItems, 
    getTotalPrice,
    cartCountChanged 
  } = useCart();
  
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  useEffect(() => {
    console.log("[MiniCart] Component mounted");
    return () => console.log("[MiniCart] Component unmounted");
  }, []);
  
  useEffect(() => {
    console.log("[MiniCart] miniCartOpen state changed:", miniCartOpen);
  }, [miniCartOpen]);
  
  // Handle quantity changes
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      // Highlight item briefly to indicate change
      setHighlightedItem(itemId);
      setTimeout(() => setHighlightedItem(null), 1000);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  // Handle remove item
  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  
  // Calculate summary values
  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 12.99;
  const total = subtotal + shipping;
  
  // Free shipping progress
  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = subtotal >= freeShippingThreshold ? 0 : freeShippingThreshold - subtotal;
  
  // Close cart on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setMiniCartOpen(false);
      }
    };
    
    if (miniCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [miniCartOpen, setMiniCartOpen]);
  
  // Close cart on ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMiniCartOpen(false);
      }
    };
    
    if (miniCartOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [miniCartOpen, setMiniCartOpen]);
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const panelVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { x: "100%", transition: { duration: 0.3 } }
  };
  
  // Empty state animation
  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
  };
  
  return (
    <AnimatePresence>
      {miniCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMiniCartOpen(false)}
          />
          
          {/* Cart panel */}
          <motion.div
            ref={cartRef}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Your Cart ({getTotalItems()})
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMiniCartOpen(false)}
                className="rounded-full hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {cartItems.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center py-8"
                  variants={emptyStateVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6 max-w-xs">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <Button
                    onClick={() => setMiniCartOpen(false)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {/* Cart items */}
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-3 rounded-lg transition-colors duration-300 ${
                        highlightedItem === item.id ? "bg-blue-50" : ""
                      }`}
                    >
                      {/* Product image */}
                      <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.product?.mainImage && (
                          <img
                            src={item.product.mainImage}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {item.colorVariant && (
                            <span className="mr-2">Color: {item.colorVariant}</span>
                          )}
                          {item.sizeVariant && (
                            <span>Size: {item.sizeVariant}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">
                            {formatCurrency(item.product.price)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Quantity controls */}
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-2 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            
                            {/* Remove button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Free shipping progress */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    {subtotal < freeShippingThreshold ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to free shipping</span>
                          <span className="font-medium">
                            {formatCurrency(subtotal)} of {formatCurrency(freeShippingThreshold)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progressToFreeShipping}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Add {formatCurrency(amountToFreeShipping)} more to get FREE shipping!
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-1.5">
                        <p className="text-primary font-medium">
                          🎉 You've unlocked FREE shipping!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer with checkout */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-primary">FREE</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button
                    onClick={() => setMiniCartOpen(false)}
                    className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                
                <button
                  onClick={() => setMiniCartOpen(false)}
                  className="w-full text-center mt-3 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
