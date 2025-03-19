import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCart } from './CartContext';

// Define checkout step types
export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review' | 'confirmation';

// Customer information interface
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Shipping information interface
export interface ShippingInfo {
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Payment information interface
export interface PaymentInfo {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

// Shipping method interface
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDelivery: string;
  price: number;
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// Order summary interface
export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  trackingNumber?: string;
  orderNumber?: string;
}

// Checkout context interface
interface CheckoutContextType {
  // Current step
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  
  // Form data
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
  
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  
  // Saved addresses and payment methods
  savedAddresses: ShippingInfo[];
  setSavedAddresses: (addresses: ShippingInfo[]) => void;
  
  savedPaymentMethods: PaymentMethod[];
  setSavedPaymentMethods: (methods: PaymentMethod[]) => void;

  // Selected shipping and payment methods
  selectedShippingMethod: ShippingMethod | null;
  setSelectedShippingMethod: (method: ShippingMethod | null) => void;
  
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  
  // Order summary and tracking
  orderSummary: OrderSummary | null;
  setOrderSummary: (summary: OrderSummary | null) => void;
  
  // Navigation helpers
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Steps info
  getSteps: () => { id: CheckoutStep; label: string; icon: React.ReactNode; progress: number }[];
  
  // Validation
  validateStep: (step: CheckoutStep) => boolean;
  
  // Process order
  processOrder: () => Promise<void>;
  
  // Reset checkout
  resetCheckout: () => void;
}

// Create context with default values
export const CheckoutContext = createContext<CheckoutContextType>({
  currentStep: 'information',
  setCurrentStep: () => {},
  
  customerInfo: { firstName: '', lastName: '', email: '', phone: '' },
  setCustomerInfo: () => {},
  
  shippingInfo: { address: '', apartment: '', city: '', state: '', zipCode: '', country: 'United States' },
  setShippingInfo: () => {},
  
  paymentInfo: { cardNumber: '', nameOnCard: '', expiryDate: '', cvv: '' },
  setPaymentInfo: () => {},
  
  savedAddresses: [],
  setSavedAddresses: () => {},
  
  savedPaymentMethods: [],
  setSavedPaymentMethods: () => {},
  
  selectedShippingMethod: null,
  setSelectedShippingMethod: () => {},
  
  selectedPaymentMethod: null,
  setSelectedPaymentMethod: () => {},
  
  orderSummary: null,
  setOrderSummary: () => {},
  
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  
  getSteps: () => [],
  
  validateStep: () => false,
  
  processOrder: async () => {},
  
  resetCheckout: () => {}
});

// Provider component
export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { saveCartAsOrder, clearCart } = useCart();
  
  // Steps definition with icons and progress
  const getSteps = () => {
    return [
      { id: 'information' as CheckoutStep, label: 'Information', icon: <span>📋</span>, progress: 25 },
      { id: 'shipping' as CheckoutStep, label: 'Shipping', icon: <span>🚚</span>, progress: 50 },
      { id: 'payment' as CheckoutStep, label: 'Payment', icon: <span>💳</span>, progress: 75 },
      { id: 'review' as CheckoutStep, label: 'Review', icon: <span>📦</span>, progress: 90 },
      { id: 'confirmation' as CheckoutStep, label: 'Confirmation', icon: <span>✅</span>, progress: 100 }
    ];
  };
  
  // State for current step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  
  // Form states
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Saved addresses and payment methods
  const [savedAddresses, setSavedAddresses] = useState<ShippingInfo[]>([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Selected shipping and payment methods
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Order summary
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  
  // Navigation functions
  const goToNextStep = () => {
    const steps = getSteps();
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    if (currentStepIndex < steps.length - 1 && validateStep(currentStep)) {
      setCurrentStep(steps[currentStepIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    const steps = getSteps();
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  // Validation function
  const validateStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case 'information':
        return !!customerInfo.firstName && !!customerInfo.lastName && !!customerInfo.email;
      
      case 'shipping':
        return !!shippingInfo.address && !!shippingInfo.city && !!shippingInfo.state && 
               !!shippingInfo.zipCode && !!shippingInfo.country && !!selectedShippingMethod;
      
      case 'payment':
        if (selectedPaymentMethod) return true;
        return !!paymentInfo.cardNumber && !!paymentInfo.nameOnCard && 
               !!paymentInfo.expiryDate && !!paymentInfo.cvv;
      
      case 'review':
        return true;
      
      default:
        return false;
    }
  };
  
  // Process order function
  const processOrder = async (): Promise<void> => {
    try {
      console.log('Processing order...');
      
      // Save the order to get the order ID
      const orderId = await saveCartAsOrder(
        customerInfo,
        {
          ...shippingInfo,
          shippingMethod: selectedShippingMethod
        },
        selectedPaymentMethod || paymentInfo
      );
      
      // Generate a mock tracking number
      const trackingNumber = `LUMA-${Math.floor(Math.random() * 1000000)}`;
      
      // Update order summary with tracking number and order ID
      if (orderSummary) {
        setOrderSummary({
          ...orderSummary,
          trackingNumber,
          orderNumber: orderId
        });
      }
      
      // Move to confirmation step
      setCurrentStep('confirmation');
      
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  };
  
  // Reset checkout
  const resetCheckout = () => {
    setCurrentStep('information');
    setCustomerInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setShippingInfo({
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    });
    setPaymentInfo({
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: ''
    });
    setSelectedShippingMethod(null);
    setSelectedPaymentMethod(null);
    setOrderSummary(null);
    clearCart();
  };
  
  // Provide the context value
  const contextValue: CheckoutContextType = {
    currentStep,
    setCurrentStep,
    
    customerInfo,
    setCustomerInfo,
    
    shippingInfo,
    setShippingInfo,
    
    paymentInfo,
    setPaymentInfo,
    
    savedAddresses,
    setSavedAddresses,
    
    savedPaymentMethods,
    setSavedPaymentMethods,
    
    selectedShippingMethod,
    setSelectedShippingMethod,
    
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    
    orderSummary,
    setOrderSummary,
    
    goToNextStep,
    goToPreviousStep,
    
    getSteps,
    
    validateStep,
    
    processOrder,
    
    resetCheckout
  };
  
  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook for using the checkout context
export const useCheckout = () => useContext(CheckoutContext); 
