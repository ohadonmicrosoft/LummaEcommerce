import React, { useEffect } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useCart } from '../../contexts/CartContext';

/**
 * A simple cart implementation with minimal dependencies 
 */
export default function BasicCart() {
  const { isCartOpen, closeCart } = useUI();
  const { cartItems, getTotalItems, removeCartItem } = useCart();
  
  // Debug logging
  useEffect(() => {
    console.log('[BasicCart] Component mounted');
    return () => console.log('[BasicCart] Component unmounted');
  }, []);
  
  useEffect(() => {
    console.log('[BasicCart] isCartOpen changed:', isCartOpen);
  }, [isCartOpen]);
  
  // If cart is not open, don't render anything
  if (!isCartOpen) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end"
      onClick={() => closeCart()}
    >
      {/* Cart panel */}
      <div 
        className="bg-white h-full w-full max-w-md shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Your Cart ({getTotalItems()})</h2>
          <button 
            onClick={() => closeCart()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        
        {/* Items */}
        <div className="flex-1 overflow-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="border-b pb-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded">
                      {item.product?.mainImage && (
                        <img 
                          src={item.product.mainImage} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                      <button 
                        onClick={() => removeCartItem(item.id)}
                        className="text-red-500 text-sm mt-2"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between py-2">
            <p>Subtotal</p>
            <p className="font-medium">
              ${cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
            </p>
          </div>
          <button 
            className="w-full py-2 bg-blue-600 text-white rounded font-medium mt-4"
            onClick={() => {
              console.log('Proceed to checkout');
              closeCart();
              // Here you would typically navigate to checkout
              window.location.href = '/checkout';
            }}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
          <button 
            className="w-full py-2 border border-gray-300 rounded font-medium mt-2"
            onClick={() => closeCart()}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
} 
