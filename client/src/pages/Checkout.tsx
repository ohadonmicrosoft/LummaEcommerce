import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ChevronRight, ChevronLeft, CreditCard, Truck, MapPin, ShoppingBag, User } from 'lucide-react';
import { fadeIn, slideInRight, slideInLeft } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Define checkout step types
type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review' | 'confirmation';

export default function Checkout() {
  // Get translations
  const { t } = useLanguage();
  
  // Get cart context
  const { cartItems, getTotalPrice, clearCart } = useCart();
  
  // Router
  const [, navigate] = useLocation();
  
  // Toast
  const { toast } = useToast();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  
  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Calculate order summary
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 10.99;
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const total = subtotal + shipping + tax;
  
  // Format currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  
  // Step definitions with progress percentage
  const steps: { id: CheckoutStep; label: string; icon: React.ReactNode; progress: number }[] = [
    { id: 'information', label: 'Customer Information', icon: <User size={18} />, progress: 25 },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} />, progress: 50 },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} />, progress: 75 },
    { id: 'review', label: 'Review Order', icon: <ShoppingBag size={18} />, progress: 90 },
    { id: 'confirmation', label: 'Confirmation', icon: <CheckCircle size={18} />, progress: 100 }
  ];
  
  // Get current step index for navigation
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentProgress = steps[currentStepIndex].progress;
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  // Submit handlers for each step
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
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      goToNextStep();
    }, 1500);
  };
  
  const handleFinishCheckout = () => {
    toast({
      title: "Order Complete",
      description: "Thank you for your purchase! You'll receive a confirmation email shortly.",
    });
    navigate('/');
  };
  
  // Check if cart is empty
  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <motion.div 
        className="container max-w-6xl mx-auto py-16 px-4"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-secondary mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-secondary mb-8">Add items to your cart before proceeding to checkout.</p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Browse Products
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-center ${index <= currentStepIndex ? 'text-primary' : 'text-gray-400'}`}
            >
              <div className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                index < currentStepIndex ? 'bg-primary text-white' : 
                index === currentStepIndex ? 'border-2 border-primary' : 'border-2 border-gray-300'
              }`}>
                {index < currentStepIndex ? <CheckCircle size={16} /> : index + 1}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
              {/* Mobile version just shows icon */}
              <div className={`sm:hidden flex items-center justify-center w-8 h-8 rounded-full ${
                index < currentStepIndex ? 'bg-primary text-white' : 
                index === currentStepIndex ? 'border-2 border-primary text-primary' : 'border-2 border-gray-300'
              }`}>
                {index < currentStepIndex ? <CheckCircle size={16} /> : step.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-primary h-2.5 rounded-full" 
            initial={{ width: '0%' }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
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
                variants={currentStepIndex > 0 ? slideInLeft : slideInRight}
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
                variants={currentStepIndex > 1 ? slideInLeft : slideInRight}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Truck size={20} className="mr-2 text-primary" />
                    Shipping Information
                  </h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium">
                        Street Address
                      </label>
                      <Input
                        id="address"
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        placeholder="123 Main St."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="apartment" className="block text-sm font-medium">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <Input
                        id="apartment"
                        type="text"
                        value={shippingInfo.apartment}
                        onChange={(e) => setShippingInfo({...shippingInfo, apartment: e.target.value})}
                        placeholder="Apt #123"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-medium">
                          City
                        </label>
                        <Input
                          id="city"
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          placeholder="Los Angeles"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="state" className="block text-sm font-medium">
                          State
                        </label>
                        <Input
                          id="state"
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          placeholder="CA"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium">
                          ZIP Code
                        </label>
                        <Input
                          id="zipCode"
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          placeholder="90001"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="country" className="block text-sm font-medium">
                        Country
                      </label>
                      <Input
                        id="country"
                        type="text"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        placeholder="United States"
                        required
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="border-primary text-primary"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back
                      </Button>
                      
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Continue to Payment
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={currentStepIndex > 2 ? slideInLeft : slideInRight}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard size={20} className="mr-2 text-primary" />
                    Payment Information
                  </h2>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium">
                        Card Number
                      </label>
                      <Input
                        id="cardNumber"
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="cardName" className="block text-sm font-medium">
                        Name on Card
                      </label>
                      <Input
                        id="cardName"
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="expiryDate" className="block text-sm font-medium">
                          Expiration Date (MM/YY)
                        </label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          placeholder="12/25"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="cvv" className="block text-sm font-medium">
                          Security Code (CVV)
                        </label>
                        <Input
                          id="cvv"
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="border-primary text-primary"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back
                      </Button>
                      
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Review Order
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
                variants={slideInRight}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Customer Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary">Name</p>
                          <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Contact</p>
                          <p>{customerInfo.email}</p>
                          <p>{customerInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Shipping Information</h3>
                      <p>{shippingInfo.address}</p>
                      {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p>{shippingInfo.country}</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <CreditCard size={18} className="mr-2 text-secondary" />
                        <p>
                          Credit Card ending in {paymentInfo.cardNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.mainImage}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product.name}</p>
                              <div className="flex text-sm text-secondary">
                                <p className="truncate">
                                  {item.colorVariant && `${item.colorVariant}`}{' '}
                                  {item.colorVariant && item.sizeVariant && '/'}{' '}
                                  {item.sizeVariant && `${item.sizeVariant}`}
                                </p>
                                <span className="mx-1">·</span>
                                <p>Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatter.format(
                                  (item.product.salePrice || item.product.price) * item.quantity
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleReviewSubmit} className="mt-6">
                    <div className="space-y-2 mb-6">
                      <label htmlFor="notes" className="block text-sm font-medium">
                        Order Notes (Optional)
                      </label>
                      <Textarea
                        id="notes"
                        placeholder="Add any special instructions or notes about your order"
                        className="min-h-24"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="border-primary text-primary"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back to Payment
                      </Button>
                      
                      <Button type="submit" className="bg-accent hover:bg-accent-dark text-white">
                        Place Order
                        <CheckCircle size={16} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial="initial"
                animate="animate"
                variants={fadeIn}
              >
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-primary" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been received and is being processed.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-md inline-block mb-6 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-secondary">Order Number</p>
                        <p className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary">Date</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary">Total</p>
                        <p className="font-medium">{formatter.format(total)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary">Payment Method</p>
                        <p className="font-medium">Credit Card</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-8">
                    A confirmation email has been sent to <span className="font-medium">{customerInfo.email}</span>.
                  </p>
                  
                  <Button 
                    onClick={handleFinishCheckout}
                    className="bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Order summary */}
        <div className="col-span-1">
          {currentStep !== 'confirmation' && (
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border"
              variants={fadeIn}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <div className="flex text-xs text-secondary">
                        <span>
                          {item.colorVariant && `${item.colorVariant}`}{' '}
                          {item.colorVariant && item.sizeVariant && '/'}{' '}
                          {item.sizeVariant && `${item.sizeVariant}`}
                        </span>
                        <span className="mx-1">·</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="font-medium text-sm mt-1">
                        {formatter.format(
                          (item.product.salePrice || item.product.price) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
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
              
              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm">
                  <p>
                    Add <span className="font-medium">{formatter.format(100 - subtotal)}</span> more to get free shipping!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}