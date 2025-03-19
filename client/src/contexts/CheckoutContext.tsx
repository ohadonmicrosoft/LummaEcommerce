import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';
import { PaymentMethod as EnhancedPaymentMethod, PaymentMethodFormData, CardType } from '../types/payment';

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
  id?: string;
  isDefault?: boolean;
}

// Legacy Payment information interface
export interface PaymentInfo {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
  isDefault?: boolean;
  id?: string;
}

// Legacy Payment method interface
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

// Shipping method interface
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDelivery: string;
  price: number;
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
  getDefaultAddress: () => ShippingInfo | undefined;
  setDefaultAddress: (addressId: string) => void;
  
  // Legacy payment methods
  savedPaymentMethods: PaymentMethod[];
  setSavedPaymentMethods: (methods: PaymentMethod[]) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  
  // Enhanced payment methods
  paymentMethods: EnhancedPaymentMethod[];
  selectedPaymentMethodId: string | null;
  setSelectedPaymentMethodId: (id: string | null) => void;
  addPaymentMethod: (paymentMethod: PaymentMethodFormData) => void;
  updatePaymentMethod: (id: string, paymentMethod: Partial<PaymentMethodFormData>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

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
  getDefaultAddress: () => undefined,
  setDefaultAddress: () => {},
  
  savedPaymentMethods: [],
  setSavedPaymentMethods: () => {},
  getDefaultPaymentMethod: () => undefined,
  
  paymentMethods: [],
  selectedPaymentMethodId: null,
  setSelectedPaymentMethodId: () => {},
  addPaymentMethod: () => {},
  updatePaymentMethod: () => {},
  removePaymentMethod: () => {},
  setDefaultPaymentMethod: () => {},
  
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
  const { saveCartAsOrder, clearCart, cartItems, getTotalPrice } = useCart();
  
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
  
  // Enhanced payment methods
  const [paymentMethods, setPaymentMethods] = useState<EnhancedPaymentMethod[]>(() => {
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : [];
  });
  
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  
  // Selected shipping and payment methods
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Order summary
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // Save payment methods to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  // Select default payment method if available and none selected
  useEffect(() => {
    if (!selectedPaymentMethodId && paymentMethods.length > 0) {
      const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);
      setSelectedPaymentMethodId(defaultPaymentMethod?.id || paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  // Update order summary when cart changes
  useEffect(() => {
    if (cartItems.length > 0 && selectedShippingMethod) {
      const subtotal = getTotalPrice();
      const shipping = selectedShippingMethod.price;
      const tax = subtotal * 0.08; // Example: 8% tax rate
      
      setOrderSummary({
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax,
        currency: 'USD'
      });
    } else if (cartItems.length > 0) {
      const subtotal = getTotalPrice();
      const tax = subtotal * 0.08; // Example: 8% tax rate
      
      setOrderSummary({
        subtotal,
        shipping: 0,
        tax,
        total: subtotal + tax,
        currency: 'USD'
      });
    } else {
      setOrderSummary(null);
    }
  }, [cartItems, selectedShippingMethod, getTotalPrice]);
  
  // Get default address function
  const getDefaultAddress = (): ShippingInfo | undefined => {
    return savedAddresses.find(addr => addr.isDefault);
  };
  
  // Set default address function
  const setDefaultAddress = (addressId: string): void => {
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setSavedAddresses(updatedAddresses);
  };
  
  // Get default payment method function
  const getDefaultPaymentMethod = (): PaymentMethod | undefined => {
    return savedPaymentMethods.find(method => method.isDefault);
  };
  
  // Enhanced payment method functions
  const addPaymentMethod = useCallback((paymentData: PaymentMethodFormData) => {
    const newPaymentMethod: EnhancedPaymentMethod = {
      id: generateId(),
      type: 'credit_card',
      isDefault: paymentData.isDefault || paymentMethods.length === 0,
      nickname: paymentData.nickname,
      cardholderName: paymentData.cardholderName,
      cardNumber: paymentData.cardNumber,
      maskedCardNumber: paymentData.cardNumber.slice(-4).padStart(16, '*'),
      expiryMonth: paymentData.expiryMonth,
      expiryYear: paymentData.expiryYear,
      cvv: paymentData.cvv,
      cardType: detectCardType(paymentData.cardNumber),
    };
    
    setPaymentMethods(current => {
      // If this is set as default, update other payment methods
      if (newPaymentMethod.isDefault) {
        return [...current.map(pm => ({ ...pm, isDefault: false })), newPaymentMethod];
      }
      return [...current, newPaymentMethod];
    });
    
    setSelectedPaymentMethodId(newPaymentMethod.id);
  }, [paymentMethods]);

  const updatePaymentMethod = useCallback((id: string, paymentData: Partial<PaymentMethodFormData>) => {
    setPaymentMethods(current => 
      current.map(pm => {
        if (pm.id !== id) {
          // If we're setting a new default, remove default from others
          if (paymentData.isDefault) {
            return { ...pm, isDefault: false };
          }
          return pm;
        }
        
        // Update the current payment method
        const updatedMethod = { ...pm, ...paymentData };
        
        // Update card type if number changed
        if (paymentData.cardNumber) {
          updatedMethod.cardType = detectCardType(paymentData.cardNumber);
          updatedMethod.maskedCardNumber = paymentData.cardNumber.slice(-4).padStart(16, '*');
        }
        
        return updatedMethod;
      })
    );
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    const methodToRemove = paymentMethods.find(pm => pm.id === id);
    
    setPaymentMethods(current => current.filter(pm => pm.id !== id));
    
    // If we removed the selected payment method, select another one
    if (selectedPaymentMethodId === id) {
      if (paymentMethods.length > 1) {
        const remaining = paymentMethods.filter(pm => pm.id !== id);
        const defaultPayment = remaining.find(pm => pm.isDefault);
        setSelectedPaymentMethodId(defaultPayment?.id || remaining[0]?.id || null);
      } else {
        setSelectedPaymentMethodId(null);
      }
    }
    
    // If we removed the default payment method, set a new default
    if (methodToRemove?.isDefault && paymentMethods.length > 1) {
      const remaining = paymentMethods.filter(pm => pm.id !== id);
      setPaymentMethods(current => 
        current.map((pm, index) => index === 0 ? { ...pm, isDefault: true } : pm)
      );
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setPaymentMethods(current => 
      current.map(pm => ({ ...pm, isDefault: pm.id === id }))
    );
  }, []);
  
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
        if (selectedPaymentMethodId) return true;
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
      
      // Get the selected enhanced payment method if available
      const enhancedPaymentMethod = selectedPaymentMethodId 
        ? paymentMethods.find(pm => pm.id === selectedPaymentMethodId)
        : null;
      
      // Save the order to get the order ID
      const orderId = await saveCartAsOrder(
        customerInfo,
        {
          ...shippingInfo,
          shippingMethod: selectedShippingMethod
        },
        selectedPaymentMethod || enhancedPaymentMethod || paymentInfo
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
    setSelectedPaymentMethodId(null);
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
    getDefaultAddress,
    setDefaultAddress,
    
    savedPaymentMethods,
    setSavedPaymentMethods,
    getDefaultPaymentMethod,
    
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    
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

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function detectCardType(cardNumber: string): CardType {
  // Basic regex patterns for card detection
  const digits = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5[0-9]{2})/.test(digits)) return 'discover';
  return 'other';
}

// Custom hook for using the checkout context
export const useCheckout = () => useContext(CheckoutContext); 
