import { CardType } from '../types/payment';

// Luhn algorithm for credit card validation
export function validateCardNumber(cardNumber: string): boolean {
  if (!cardNumber) return false;
  
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function validateExpiryDate(month: string, year: string): boolean {
  if (!month || !year) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10) + 2000; // Convert 2-digit year to 4-digit
  
  // Check if month is valid
  if (expMonth < 1 || expMonth > 12) return false;
  
  // Check if already expired
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  
  return true;
}

export function validateCVV(cvv: string, cardType: CardType = 'other'): boolean {
  if (!cvv) return false;
  
  // Remove all non-digit characters
  const digits = cvv.replace(/\D/g, '');
  
  // AMEX CVVs are 4 digits, all others are 3
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  return digits.length === expectedLength;
}

export function formatCardNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  
  // Format based on card type
  if (/^3[47]/.test(digits)) { // AMEX
    return digits.replace(/^(\d{4})(\d{6})(\d{5})$/, '$1 $2 $3').trim();
  } else {
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  }
} 
