import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useCheckout, PaymentMethod } from '../../contexts/CheckoutContext';
import { cn } from '../../lib/utils';

interface PaymentMethodSelectorProps {
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ className }) => {
  const { savedPaymentMethods, selectedPaymentMethod, setSelectedPaymentMethod } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
      case 'paypal':
      case 'apple':
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm border", className)}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard size={20} className="mr-2 text-primary" />
        Payment Method
      </h2>
      
      <div className="space-y-3">
        {savedPaymentMethods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "border rounded-md p-4 cursor-pointer transition-all",
              selectedPaymentMethod?.id === method.id 
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handlePaymentMethodSelect(method)}
          >
            <div className="flex items-center">
              <div className="mr-3 text-gray-500">
                {getPaymentIcon(method.icon)}
              </div>
              <div>
                <p className="font-medium">{method.name}</p>
              </div>
              <div className="ml-auto">
                <div className={cn(
                  "w-5 h-5 rounded-full border border-gray-300",
                  selectedPaymentMethod?.id === method.id && "border-primary bg-primary/20"
                )}>
                  {selectedPaymentMethod?.id === method.id && (
                    <div className="w-3 h-3 bg-primary rounded-full m-auto mt-1"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="mt-4 flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-gray-600">Processing payment...</span>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector; 
