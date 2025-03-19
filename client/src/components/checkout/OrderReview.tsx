import React from 'react';
import { CreditCard, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCheckout } from '../../contexts/CheckoutContext';
import { usePaymentMethod } from '../../hooks/usePaymentMethod';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import OrderSummary from './OrderSummary';
import { CardType } from '../../types/payment';

interface OrderReviewProps {
  className?: string;
}

const OrderReview: React.FC<OrderReviewProps> = ({ className }) => {
  const { 
    customerInfo,
    shippingInfo,
    selectedShippingMethod,
    goToNextStep,
    processOrder,
    currentStep
  } = useCheckout();

  const { 
    paymentMethods, 
    selectedPaymentMethodId,
    selectedPaymentMethod
  } = usePaymentMethod();

  const handlePlaceOrder = async () => {
    try {
      await processOrder();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  // Helper function to get card icon based on type
  const getCardIcon = (type: CardType) => {
    switch (type) {
      case 'visa':
        return <span className="text-blue-600 font-bold">VISA</span>;
      case 'mastercard':
        return <span className="text-orange-600 font-bold">MC</span>;
      case 'amex':
        return <span className="text-blue-800 font-bold">AMEX</span>;
      case 'discover':
        return <span className="text-orange-500 font-bold">DISC</span>;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
          
          {/* Customer Information */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-2">Contact Information</h3>
                  <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                  <p>{customerInfo.email}</p>
                  {customerInfo.phone && <p>{customerInfo.phone}</p>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-primary"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping Information */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-2 flex items-center">
                    <MapPin size={18} className="mr-1" />
                    Shipping Address
                  </h3>
                  <p>{shippingInfo.address}</p>
                  {shippingInfo.apartment && <p>Apt/Suite: {shippingInfo.apartment}</p>}
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-primary"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping Method */}
          {selectedShippingMethod && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Shipping Method</h3>
                    <p className="font-medium">{selectedShippingMethod.name}</p>
                    <p className="text-sm text-gray-600">{selectedShippingMethod.description}</p>
                    <p className="text-sm text-gray-600">Estimated delivery: {selectedShippingMethod.estimatedDelivery}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {selectedShippingMethod.price === 0 
                        ? 'Free' 
                        : `$${selectedShippingMethod.price.toFixed(2)}`}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-primary"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Payment Method */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-2 flex items-center">
                    <CreditCard size={18} className="mr-1" />
                    Payment Method
                  </h3>
                  {selectedPaymentMethod ? (
                    <div className="flex items-center">
                      <div className="mr-2">
                        {getCardIcon(selectedPaymentMethod.cardType || 'other')}
                      </div>
                      <div>
                        <p className="font-medium">{selectedPaymentMethod.nickname}</p>
                        <p className="text-sm text-gray-600">
                          •••• •••• •••• {selectedPaymentMethod.maskedCardNumber?.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires: {selectedPaymentMethod.expiryMonth}/{selectedPaymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment method selected</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-primary"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <OrderSummary />
          
          <div className="mt-6">
            <Button 
              onClick={handlePlaceOrder} 
              className="w-full py-6"
              size="lg"
              disabled={!selectedPaymentMethodId}
            >
              Place Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {!selectedPaymentMethodId && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Please select a payment method to continue
              </p>
            )}
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview; 
