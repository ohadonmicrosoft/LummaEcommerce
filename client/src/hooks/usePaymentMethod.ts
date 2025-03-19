import { useCheckout } from '../contexts/CheckoutContext';
import { validateCardNumber, validateExpiryDate, validateCVV } from '../lib/validation';
import { PaymentMethod, PaymentMethodFormData, CardType } from '../types/payment';

export function usePaymentMethod() {
  const {
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  } = useCheckout();

  // Get the currently selected payment method
  const selectedPaymentMethod = paymentMethods.find(
    (method: PaymentMethod) => method.id === selectedPaymentMethodId
  );

  // Detect card type from number
  const detectCardType = (cardNumber: string): CardType => {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(digits)) return 'visa';
    if (/^5[1-5]/.test(digits)) return 'mastercard';
    if (/^3[47]/.test(digits)) return 'amex';
    if (/^6(?:011|5[0-9]{2})/.test(digits)) return 'discover';
    return 'other';
  };

  // Validate a payment method form
  const validatePaymentForm = (formData: PaymentMethodFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    
    if (!validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }
    
    if (!validateExpiryDate(formData.expiryMonth, formData.expiryYear)) {
      errors.expiryDate = 'Invalid expiration date';
    }
    
    if (!validateCVV(formData.cvv, detectCardType(formData.cardNumber))) {
      errors.cvv = 'Invalid CVV';
    }
    
    if (!formData.nickname.trim()) {
      errors.nickname = 'Please provide a name for this card';
    }
    
    return errors;
  };

  return {
    paymentMethods,
    selectedPaymentMethodId,
    selectedPaymentMethod,
    setSelectedPaymentMethodId,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    detectCardType,
    validatePaymentForm
  };
} 
