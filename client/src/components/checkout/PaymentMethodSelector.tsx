import React, { useState, useEffect } from 'react';
import { CreditCard, Trash2, Plus, Edit, AlertCircle, Check } from 'lucide-react';
import { useCheckout } from '../../contexts/CheckoutContext';
import { usePaymentMethod } from '../../hooks/usePaymentMethod';
import { CardType } from '../../types/payment';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethodSelectorProps {
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ className }) => {
  const { 
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    detectCardType,
    validatePaymentForm,
  } = usePaymentMethod();

  const [activeTab, setActiveTab] = useState<'saved' | 'new'>(
    paymentMethods.length > 0 ? 'saved' : 'new'
  );
  
  const [formData, setFormData] = useState<{
    nickname: string;
    cardholderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    isDefault: boolean;
  }>({
    nickname: '',
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'cardNumber') {
      // Format card number as user types
      const digits = value.replace(/\D/g, '');
      let formattedValue = '';
      
      // Format based on potential card type
      if (/^3[47]/.test(digits)) { // AMEX
        formattedValue = digits
          .replace(/(\d{4})/, '$1 ')
          .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
          .substring(0, 17);
      } else {
        formattedValue = digits
          .replace(/(\d{4})/g, '$1 ')
          .trim()
          .substring(0, 19);
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Get card icon based on type
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

  // Validate the form
  const validateForm = (): boolean => {
    const errors = validatePaymentForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (editMode) {
        updatePaymentMethod(editMode, formData);
        setEditMode(null);
      } else {
        addPaymentMethod(formData);
      }
      
      // Reset form
      setFormData({
        nickname: '',
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
      
      // Switch to saved tab if we have payment methods
      setActiveTab('saved');
    } catch (error) {
      console.error('Error saving payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit mode
  const handleEdit = (id: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    if (!paymentMethod) return;
    
    setFormData({
      nickname: paymentMethod.nickname || '',
      cardholderName: paymentMethod.cardholderName || '',
      cardNumber: paymentMethod.cardNumber || '',
      expiryMonth: paymentMethod.expiryMonth || '',
      expiryYear: paymentMethod.expiryYear || '',
      cvv: paymentMethod.cvv || '',
      isDefault: paymentMethod.isDefault || false
    });
    
    setEditMode(id);
    setActiveTab('new');
  };

  return (
    <div className={cn("bg-white", className)}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard size={20} className="mr-2 text-primary" />
        Payment Method
      </h2>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'saved' | 'new')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="saved" 
            disabled={paymentMethods.length === 0}
          >
            Saved Payment Methods
          </TabsTrigger>
          <TabsTrigger value="new">
            {editMode ? 'Edit Payment Method' : 'Add New Payment Method'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No saved payment methods</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            <RadioGroup 
              value={selectedPaymentMethodId || undefined}
              onValueChange={setSelectedPaymentMethodId}
              className="space-y-4"
            >
              <AnimatePresence>
                {paymentMethods.map(method => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={cn(
                      "relative overflow-hidden border-2",
                      selectedPaymentMethodId === method.id ? "border-primary" : "border-gray-200"
                    )}>
                      {method.isDefault && (
                        <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs">
                          Default
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                          <Label 
                            htmlFor={method.id}
                            className="flex items-center text-lg font-medium cursor-pointer"
                          >
                            <div className="flex items-center">
                              {getCardIcon(method.cardType || 'other')}
                              <span className="ml-2">{method.nickname}</span>
                            </div>
                          </Label>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(method.id)}
                              className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removePaymentMethod(method.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Label 
                          htmlFor={method.id}
                          className="flex flex-col cursor-pointer"
                        >
                          <div className="text-gray-500 text-sm">
                            •••• •••• •••• {method.maskedCardNumber?.slice(-4)}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Expires: {method.expiryMonth}/{method.expiryYear}
                          </div>
                          {!method.isDefault && (
                            <Button
                              variant="link"
                              className="text-primary p-0 h-auto mt-2 self-start"
                              onClick={(e) => {
                                e.preventDefault();
                                setDefaultPaymentMethod(method.id);
                              }}
                            >
                              Set as default
                            </Button>
                          )}
                        </Label>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </RadioGroup>
          )}
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setEditMode(null);
              setFormData({
                nickname: '',
                cardholderName: '',
                cardNumber: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                isDefault: false
              });
              setActiveTab('new');
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>{editMode ? 'Edit Payment Method' : 'Add New Payment Method'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nickname">Card Nickname</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    placeholder="e.g. My Personal Card"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className={formErrors.nickname ? 'border-red-500' : ''}
                  />
                  {formErrors.nickname && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.nickname}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    name="cardholderName"
                    placeholder="Name as it appears on card"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className={formErrors.cardholderName ? 'border-red-500' : ''}
                  />
                  {formErrors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.cardholderName}</p>
                  )}
                </div>
                
                <div className="relative">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`${formErrors.cardNumber ? 'border-red-500' : ''} pl-10`}
                      maxLength={19}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {getCardIcon(detectCardType(formData.cardNumber))}
                    </div>
                  </div>
                  {formErrors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiration Date</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="expiryMonth"
                        name="expiryMonth"
                        placeholder="MM"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className={formErrors.expiryDate ? 'border-red-500' : ''}
                        maxLength={2}
                      />
                      <Input
                        id="expiryYear"
                        name="expiryYear"
                        placeholder="YY"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className={formErrors.expiryDate ? 'border-red-500' : ''}
                        maxLength={2}
                      />
                    </div>
                    {formErrors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">Security Code (CVV)</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder={detectCardType(formData.cardNumber) === 'amex' ? '4 digits' : '3 digits'}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={formErrors.cvv ? 'border-red-500' : ''}
                      maxLength={detectCardType(formData.cardNumber) === 'amex' ? 4 : 3}
                    />
                    {formErrors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({ ...prev, isDefault: checked === true }));
                    }}
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default payment method
                  </Label>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMode(null);
                      setFormData({
                        nickname: '',
                        cardholderName: '',
                        cardNumber: '',
                        expiryMonth: '',
                        expiryYear: '',
                        cvv: '',
                        isDefault: false
                      });
                      if (paymentMethods.length > 0) {
                        setActiveTab('saved');
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                        Processing...
                      </>
                    ) : editMode ? (
                      'Update Payment Method'
                    ) : (
                      'Save Payment Method'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default PaymentMethodSelector; 
