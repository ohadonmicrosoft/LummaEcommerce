import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  User, Truck, CreditCard, ShoppingBag, CheckCircle,
  ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext';
import { useToast } from '@/hooks/use-toast';
import CheckoutStepIndicator from '@/components/checkout/CheckoutStepIndicator';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import AddressSelection from '@/components/checkout/AddressSelection';

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.2 } }
};

const slideInLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: 20, opacity: 0, transition: { duration: 0.2 } }
};

const CheckoutContent = () => {
  const [, navigate] = useLocation();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const { 
    currentStep, 
    goToNextStep,
    goToPreviousStep,
    customerInfo,
    setCustomerInfo,
    shippingInfo,
    setShippingInfo,
    paymentInfo,
    setPaymentInfo,
    processOrder,
    resetCheckout
  } = useCheckout();
  
  // Handle form submissions for each step
  const handleInformationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processOrder();
      // This will automatically navigate to confirmation 
      // because processOrder sets currentStep to 'confirmation'
      toast({
        title: "Order Successful",
        description: "Your order has been placed successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleFinishCheckout = () => {
    resetCheckout(); // Reset the checkout state
    toast({
      title: "Order Complete",
      description: "Thank you for your order!",
      variant: "default"
    });
    navigate('/'); // Go back to home page
  };
  
  // If cart is empty, show message
  if (cartItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to your cart to proceed with checkout.</p>
          <Button onClick={() => navigate('/products')} className="bg-primary hover:bg-primary/90 text-white">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <CheckoutStepIndicator className="mb-8" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout content */}
        <div className="col-span-1 lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 'information' && (
              <motion.div
                key="information"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User size={20} className="mr-2 text-primary" />
                    Customer Information
                  </h2>
                  
                  <form onSubmit={handleInformationSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          value={customerInfo.firstName}
                          onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                          placeholder="John"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          value={customerInfo.lastName}
                          onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Continue to Shipping
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
            {currentStep === 'shipping' && (
              <motion.div
                key="shipping"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Truck size={20} className="mr-2 text-primary" />
                    Shipping Address
                  </h2>
                  
                  <AddressSelection showTitle={false} />

                  <div className="mt-6 pt-4 border-t flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      className="flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-2" />
                      Back to Information
                    </Button>
                    
                    <Button 
                      type="button"
                      onClick={handleShippingSubmit}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Continue to Payment
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
                
                <ShippingMethodSelector className="mb-6" />
              </motion.div>
            )}
            
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <PaymentMethodSelector className="mb-6" />
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard size={20} className="mr-2 text-primary" />
                    Billing Address
                  </h2>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-4">
                      <input
                        id="same-as-shipping"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked={true}
                      />
                      <label htmlFor="same-as-shipping" className="ml-2 block text-sm text-gray-700">
                        Same as shipping address
                      </label>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        onClick={goToPreviousStep}
                        variant="outline"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Continue to Review
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-2 flex items-center">
                        <User size={16} className="mr-2 text-primary" />
                        Customer Information
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                        <p>{customerInfo.email}</p>
                        <p>{customerInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2 flex items-center">
                        <Truck size={16} className="mr-2 text-primary" />
                        Shipping Information
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{shippingInfo.address}</p>
                        {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Special Instructions (Optional)</h3>
                      <Textarea 
                        placeholder="Add any special instructions for delivery or order"
                        className="resize-none h-24"
                      />
                    </div>
                    
                    <form onSubmit={handleReviewSubmit} className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        onClick={goToPreviousStep}
                        variant="outline"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Place Order
                        <Check size={16} className="ml-2" />
                      </Button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
            
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
                  <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. You will receive a confirmation email shortly.
                  </p>
                  
                  <div className="max-w-md mx-auto mb-6">
                    <OrderSummary showDetails={false} />
                  </div>
                  
                  <div className="mt-8">
                    <Button onClick={handleFinishCheckout} className="bg-primary hover:bg-primary/90 text-white">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Order summary sidebar */}
        <div className="col-span-1">
          <AnimatePresence>
            {(currentStep !== 'confirmation') && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
              >
                <OrderSummary className="sticky top-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Wrapper component that provides the CheckoutContext
export default function Checkout() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
