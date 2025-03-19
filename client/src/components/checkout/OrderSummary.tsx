import React, { useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import { cn } from '../../lib/utils';

interface OrderSummaryProps {
  className?: string;
  showDetails?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ className, showDetails = true }) => {
  const { cartItems, getTotalItems, getTotalPrice } = useCart();
  const { orderSummary, setOrderSummary, selectedShippingMethod } = useCheckout();
  
  // Calculate order summary whenever cart items or shipping method changes
  useEffect(() => {
    const subtotal = getTotalPrice();
    const shipping = selectedShippingMethod?.price || 0;
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + shipping + tax;
    
    setOrderSummary({
      subtotal,
      shipping,
      tax,
      total,
      currency: 'USD'
    });
  }, [cartItems, selectedShippingMethod, getTotalPrice, setOrderSummary]);
  
  if (!orderSummary) {
    return (
      <div className={cn("p-4 bg-white rounded-lg shadow animate-pulse", className)}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("p-4 bg-white rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      {showDetails && (
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart
          </div>
          
          <div className="max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden mr-3">
                  {item.product.mainImage && (
                    <img 
                      src={item.product.mainImage} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-sm font-medium ml-2">${(item.product.salePrice || item.product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <p>Qty: {item.quantity}</p>
                    <p className="ml-2">${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${orderSummary.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${orderSummary.shipping.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${orderSummary.tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {(orderSummary.trackingNumber || orderSummary.orderNumber) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-sm font-medium text-green-800">Order Confirmed</p>
          {orderSummary.orderNumber && (
            <p className="text-xs text-green-700 mt-1">Order Number: {orderSummary.orderNumber}</p>
          )}
          {orderSummary.trackingNumber && (
            <p className="text-xs text-green-700 mt-1">Tracking Number: {orderSummary.trackingNumber}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary; 
