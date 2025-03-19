import React, { useState, useEffect } from 'react';
import { useCheckout, ShippingMethod } from '../../contexts/CheckoutContext';
import { cn } from '../../lib/utils';

interface ShippingMethodSelectorProps {
  className?: string;
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({ className }) => {
  const { selectedShippingMethod, setSelectedShippingMethod } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  
  // Simulating API call to fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock shipping methods
        const mockShippingMethods: ShippingMethod[] = [
          {
            id: 'standard',
            name: 'Standard Shipping',
            description: 'Delivery in 3-5 business days',
            price: 5.99,
            estimatedDelivery: '3-5 business days'
          },
          {
            id: 'express',
            name: 'Express Shipping',
            description: 'Delivery in 1-2 business days',
            price: 14.99,
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'overnight',
            name: 'Overnight Shipping',
            description: 'Next day delivery',
            price: 24.99,
            estimatedDelivery: 'Next business day'
          }
        ];
        
        setShippingMethods(mockShippingMethods);
        
        // If no shipping method is selected yet, select the first one by default
        if (!selectedShippingMethod && mockShippingMethods.length > 0) {
          setSelectedShippingMethod(mockShippingMethods[0]);
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShippingMethods();
  }, [selectedShippingMethod, setSelectedShippingMethod]);
  
  const handleSelectMethod = (method: ShippingMethod) => {
    setSelectedShippingMethod(method);
  };
  
  if (isLoading) {
    return (
      <div className={cn("p-4 bg-white rounded-lg shadow", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("p-4 bg-white rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
      
      <div className="space-y-3">
        {shippingMethods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "border p-3 rounded-lg cursor-pointer transition-all duration-200",
              selectedShippingMethod?.id === method.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handleSelectMethod(method)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  checked={selectedShippingMethod?.id === method.id}
                  onChange={() => handleSelectMethod(method)}
                  name="shipping-method"
                  id={`shipping-method-${method.id}`}
                />
                <label
                  htmlFor={`shipping-method-${method.id}`}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </label>
              </div>
              <div className="text-right">
                <span className="font-medium">${method.price.toFixed(2)}</span>
                <p className="text-xs text-gray-500">{method.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingMethodSelector; 
