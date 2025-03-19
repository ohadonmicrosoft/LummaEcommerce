export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  isDefault: boolean;
  nickname?: string;
  
  // Credit card specific fields
  cardholderName?: string;
  cardNumber?: string;
  maskedCardNumber?: string; // Last 4 digits for display
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardType?: CardType;
  
  // PayPal specific fields
  paypalEmail?: string;
}

export interface PaymentMethodFormData {
  nickname: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
} 
