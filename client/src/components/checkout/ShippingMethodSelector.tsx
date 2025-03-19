import React, { useState, useEffect } from 'react';
import { useCheckout, ShippingMethod } from '../../contexts/CheckoutContext';
import { cn } from '../../lib/utils';
import { Truck, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShippingMethodSelectorProps {
  className?: string;
  onMethodSelected?: (method: ShippingMethod) => void;
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({ 
  className,
  onMethodSelected
}) => {
  const { selectedShippingMethod, setSelectedShippingMethod } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to determine if a method is eligible for free shipping
  const isEligibleForFreeShipping = (method: ShippingMethod): boolean => {
    return method.id === 'standard' && calculateCartTotal() > 75;
  };
  
  // Mock function to calculate cart total - this would normally come from CartContext
  const calculateCartTotal = (): number => {
    // For demo purposes only
    return 99.99;
  };
  
  // Simulating API call to fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoading(true);
      setError(null);
      
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
            description: 'Next day delivery, order by 2 PM',
            price: 24.99,
            estimatedDelivery: 'Next business day'
          },
          {
            id: 'international',
            name: 'International Shipping',
            description: 'Delivery to select countries',
            price: 39.99,
            estimatedDelivery: '7-14 business days'
          }
        ];
        
        setShippingMethods(mockShippingMethods);
        
        // If no shipping method is selected yet, select the first one by default
        if (!selectedShippingMethod && mockShippingMethods.length > 0) {
          setSelectedShippingMethod(mockShippingMethods[0]);
          if (onMethodSelected) {
            onMethodSelected(mockShippingMethods[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
        setError('Unable to load shipping methods. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShippingMethods();
  }, []);
  
  const handleSelectMethod = (method: ShippingMethod) => {
    setSelectedShippingMethod(method);
    if (onMethodSelected) {
      onMethodSelected(method);
    }
    
    // Display updated price in shipping method if eligible for free shipping
    if (isEligibleForFreeShipping(method)) {
      method.price = 0;
    }
  };
  
  // Get expected delivery date range
  const getDeliveryDateRange = (method: ShippingMethod): string => {
    const today = new Date();
    
    switch (method.id) {
      case 'standard':
        const standardMin = new Date(today);
        standardMin.setDate(today.getDate() + 3);
        const standardMax = new Date(today);
        standardMax.setDate(today.getDate() + 5);
        return `${formatDate(standardMin)} - ${formatDate(standardMax)}`;
        
      case 'express':
        const expressMin = new Date(today);
        expressMin.setDate(today.getDate() + 1);
        const expressMax = new Date(today);
        expressMax.setDate(today.getDate() + 2);
        return `${formatDate(expressMin)} - ${formatDate(expressMax)}`;
        
      case 'overnight':
        const overnight = new Date(today);
        overnight.setDate(today.getDate() + 1);
        return formatDate(overnight);
        
      case 'international':
        const intlMin = new Date(today);
        intlMin.setDate(today.getDate() + 7);
        const intlMax = new Date(today);
        intlMax.setDate(today.getDate() + 14);
        return `${formatDate(intlMin)} - ${formatDate(intlMax)}`;
        
      default:
        return 'Estimated date not available';
    }
  };
  
  // Format date as Month Day (e.g., "Mar 15")
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Render shipping method card with features and benefits
  const renderShippingMethodCard = (method: ShippingMethod) => {
    const isFreeShipping = isEligibleForFreeShipping(method);
    const actualPrice = isFreeShipping ? 0 : method.price;
    
    return (
      <div
        key={method.id}
        className={cn(
          "border p-4 rounded-lg cursor-pointer transition-all duration-200",
          selectedShippingMethod?.id === method.id
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        )}
        onClick={() => handleSelectMethod(method)}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="radio"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              checked={selectedShippingMethod?.id === method.id}
              onChange={() => handleSelectMethod(method)}
              name="shipping-method"
              id={`shipping-method-${method.id}`}
            />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`shipping-method-${method.id}`}
                className="block font-medium cursor-pointer"
              >
                <div className="flex items-center">
                  {method.name}
                  {isFreeShipping && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      FREE
                    </Badge>
                  )}
                  {method.id === 'express' && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                      FAST
                    </Badge>
                  )}
                </div>
              </label>
              
              <div className="text-right">
                {isFreeShipping ? (
                  <div>
                    <span className="line-through text-gray-400 text-sm">${method.price.toFixed(2)}</span>
                    <span className="font-medium text-green-600 ml-1">FREE</span>
                  </div>
                ) : (
                  <span className="font-medium">${actualPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
            
            <div className="mt-2 flex items-center text-sm">
              <Clock size={14} className="text-gray-400 mr-1" />
              <span>Estimated delivery: {getDeliveryDateRange(method)}</span>
            </div>
            
            {method.id === 'standard' && (
              <div className="mt-2 text-sm text-primary">
                {calculateCartTotal() < 75 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center text-xs underline cursor-help">
                        <ShieldCheck size={14} className="mr-1" />
                        Add ${(75 - calculateCartTotal()).toFixed(2)} more for free shipping
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Orders over $75 qualify for free standard shipping</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="flex items-center text-green-600">
                    <ShieldCheck size={14} className="mr-1" />
                    Free shipping on orders over $75
                  </div>
                )}
              </div>
            )}
            
            {method.id === 'overnight' && (
              <div className="mt-2 text-xs text-amber-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Order within 3 hours to get it by tomorrow
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className={cn("p-4 bg-white rounded-lg shadow-sm border", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-sm border", className)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Truck size={18} className="mr-2 text-primary" />
        Shipping Method
      </h3>
      
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle size={16} className="mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {shippingMethods.map(renderShippingMethodCard)}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Shipping times are estimates and are not guaranteed. International orders may be subject to customs duties and taxes.</p>
      </div>
    </div>
  );
};

export default ShippingMethodSelector; 
