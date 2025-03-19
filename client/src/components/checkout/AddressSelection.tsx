import React, { useState, useEffect } from 'react';
import { useCheckout, ShippingInfo } from '@/contexts/CheckoutContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MapPin, Plus, Edit, Trash2, Star, StarIcon, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddressSelectionProps {
  className?: string;
  showTitle?: boolean;
}

interface AddressWithId extends ShippingInfo {
  id: string;
  isDefault?: boolean;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({ 
  className, 
  showTitle = true 
}) => {
  const { 
    savedAddresses, 
    setSavedAddresses, 
    shippingInfo,
    setShippingInfo
  } = useCheckout();
  
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressWithId>({
    id: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);
  
  // Populate with sample addresses if none exist
  useEffect(() => {
    if (savedAddresses.length === 0) {
      // Mock data for demonstration
      const mockAddresses: AddressWithId[] = [
        {
          id: '1',
          address: '123 Main St',
          apartment: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          isDefault: true
        },
        {
          id: '2',
          address: '456 Oak Ave',
          apartment: '',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'United States',
          isDefault: false
        }
      ];
      
      setSavedAddresses(mockAddresses as any);
      
      // Set the default address as selected and as shipping info
      const defaultAddress = mockAddresses.find(addr => addr.isDefault) || mockAddresses[0];
      setSelectedAddressId(defaultAddress.id);
      setShippingInfo(defaultAddress);
    } else {
      // Find default address or use the first one
      const typedAddresses = savedAddresses as unknown as AddressWithId[];
      const defaultAddress = typedAddresses.find(addr => addr.isDefault) || typedAddresses[0];
      
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(defaultAddress.id);
        setShippingInfo(defaultAddress);
      }
    }
  }, [savedAddresses]);

  // Validate the address form
  const validateAddress = (address: AddressWithId): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!address.address.trim()) {
      errors.address = 'Street address is required';
    }
    
    if (!address.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!address.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!address.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errors.zipCode = 'Enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }
    
    return errors;
  };

  // Handle input change with validation
  const handleInputChange = (field: keyof AddressWithId, value: string | boolean) => {
    const updatedAddress = { ...newAddress, [field]: value };
    setNewAddress(updatedAddress);
    
    if (formTouched) {
      // Only show validation errors for this field if the form has been touched
      const fieldError = validateAddress(updatedAddress)[field];
      setValidationErrors(prev => ({
        ...prev,
        [field]: fieldError || ''
      }));
    }
  };

  // Handle selecting an address
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    
    // Find the selected address and set it as shipping info
    const selectedAddress = savedAddresses.find(
      (addr: any) => addr.id === addressId
    );
    
    if (selectedAddress) {
      setShippingInfo(selectedAddress);
    }
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    // Validate the form
    const errors = validateAddress(newAddress);
    setValidationErrors(errors);
    setFormTouched(true);
    
    if (Object.keys(errors).length > 0) {
      return; // Don't proceed if there are validation errors
    }
    
    const newId = Date.now().toString();
    const addressWithId = { ...newAddress, id: newId };
    
    // If this is set as default, update other addresses
    let updatedAddresses;
    if (addressWithId.isDefault) {
      updatedAddresses = savedAddresses.map((addr: any) => ({
        ...addr,
        isDefault: false
      }));
    } else {
      updatedAddresses = [...savedAddresses];
    }
    
    setSavedAddresses([...updatedAddresses, addressWithId as any]);
    setSelectedAddressId(newId);
    setShippingInfo(addressWithId);
    setIsAddingAddress(false);
    
    // Reset form
    setNewAddress({
      id: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
    setFormTouched(false);
    setValidationErrors({});
    
    toast({
      title: "Address added",
      description: "Your address has been saved.",
      variant: "default",
    });
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = (addressId: string) => {
    const updatedAddresses = (savedAddresses as unknown as AddressWithId[]).map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    setSavedAddresses(updatedAddresses as any);
    
    toast({
      title: "Default address updated",
      description: "Your default shipping address has been updated.",
      variant: "default",
    });
  };

  // Handle editing an address
  const handleEditAddress = (addressId: string) => {
    const addressToEdit = savedAddresses.find(
      (addr: any) => addr.id === addressId
    );
    
    if (addressToEdit) {
      setNewAddress(addressToEdit as unknown as AddressWithId);
      setIsEditingAddress(true);
      setFormTouched(false);
      setValidationErrors({});
    }
  };

  // Handle saving edited address
  const handleSaveEditedAddress = () => {
    // Validate the form
    const errors = validateAddress(newAddress);
    setValidationErrors(errors);
    setFormTouched(true);
    
    if (Object.keys(errors).length > 0) {
      return; // Don't proceed if there are validation errors
    }
    
    // If this is set as default, update other addresses
    let updatedAddresses;
    if (newAddress.isDefault) {
      updatedAddresses = savedAddresses.map((addr: any) => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    } else {
      updatedAddresses = savedAddresses.map((addr: any) => {
        if (addr.id === newAddress.id) {
          return { ...newAddress };
        }
        return addr;
      });
    }
    
    setSavedAddresses(updatedAddresses);
    setShippingInfo(newAddress);
    setIsEditingAddress(false);
    setFormTouched(false);
    setValidationErrors({});
    
    toast({
      title: "Address updated",
      description: "Your address has been updated.",
      variant: "default",
    });
  };

  // Handle deleting an address
  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = (savedAddresses as unknown as AddressWithId[]).find(
      addr => addr.id === addressId
    );
    
    const updatedAddresses = savedAddresses.filter(
      (addr: any) => addr.id !== addressId
    );
    
    // If we're deleting the default address, make another one default
    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      (updatedAddresses[0] as any).isDefault = true;
    }
    
    setSavedAddresses(updatedAddresses);
    
    // If deleted address was selected, select the first address or clear selection
    if (selectedAddressId === addressId) {
      if (updatedAddresses.length > 0) {
        setSelectedAddressId((updatedAddresses[0] as any).id);
        setShippingInfo(updatedAddresses[0]);
      } else {
        setSelectedAddressId(null);
        setShippingInfo({
          address: '',
          apartment: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        });
      }
    }
    
    toast({
      title: "Address deleted",
      description: "Your address has been removed.",
      variant: "default",
    });
  };

  // Render an input field with validation
  const renderInputField = (
    id: string,
    label: string,
    field: keyof AddressWithId,
    placeholder: string,
    required: boolean = true
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex">
        {label} {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        value={newAddress[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={validationErrors[field] ? "border-destructive" : ""}
      />
      {validationErrors[field] && (
        <p className="text-destructive text-xs mt-1 flex items-center">
          <AlertCircle size={12} className="mr-1" />
          {validationErrors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin size={18} className="mr-2 text-primary" />
            Shipping Address
          </h3>
          
          <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-sm"
              >
                <Plus size={14} className="mr-1" /> Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new shipping address to your account.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {renderInputField(
                  "new-address",
                  "Street Address",
                  "address",
                  "123 Main St",
                  true
                )}
                
                {renderInputField(
                  "new-apartment",
                  "Apartment, Suite, etc. (optional)",
                  "apartment",
                  "Apt 4B",
                  false
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "new-city",
                    "City",
                    "city",
                    "New York",
                    true
                  )}
                  
                  {renderInputField(
                    "new-state",
                    "State / Province",
                    "state",
                    "NY",
                    true
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "new-zipCode",
                    "ZIP / Postal Code",
                    "zipCode",
                    "10001",
                    true
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-country">Country</Label>
                    <Select 
                      value={newAddress.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="new-default"
                    checked={!!newAddress.isDefault}
                    onCheckedChange={(checked) => handleInputChange("isDefault", !!checked)}
                  />
                  <label
                    htmlFor="new-default"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Set as default shipping address
                  </label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddingAddress(false);
                  setFormTouched(false);
                  setValidationErrors({});
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddAddress}>Save Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      {/* Edit address dialog */}
      <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your shipping address details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {renderInputField(
              "edit-address",
              "Street Address",
              "address",
              "123 Main St",
              true
            )}
            
            {renderInputField(
              "edit-apartment",
              "Apartment, Suite, etc. (optional)",
              "apartment",
              "Apt 4B",
              false
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {renderInputField(
                "edit-city",
                "City",
                "city",
                "New York",
                true
              )}
              
              {renderInputField(
                "edit-state",
                "State / Province",
                "state",
                "NY",
                true
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderInputField(
                "edit-zipCode",
                "ZIP / Postal Code",
                "zipCode",
                "10001",
                true
              )}
              
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Select 
                  value={newAddress.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="edit-default"
                checked={!!newAddress.isDefault}
                onCheckedChange={(checked) => handleInputChange("isDefault", !!checked)}
              />
              <label
                htmlFor="edit-default"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as default shipping address
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditingAddress(false);
              setFormTouched(false);
              setValidationErrors({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedAddress}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Address selection */}
      {savedAddresses.length > 0 ? (
        <RadioGroup
          value={selectedAddressId || ''}
          onValueChange={handleSelectAddress}
          className="space-y-3"
        >
          {(savedAddresses as unknown as AddressWithId[]).map((address) => (
            <div
              key={address.id}
              className={cn(
                "border p-4 rounded-lg relative transition-all",
                selectedAddressId === address.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-start">
                <RadioGroupItem
                  value={address.id}
                  id={`address-${address.id}`}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`address-${address.id}`}
                      className="font-medium text-base"
                    >
                      {address.address} {address.apartment && `, ${address.apartment}`}
                    </Label>
                    {address.isDefault && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex items-center">
                        <Star size={10} className="mr-1" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                  
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSetDefaultAddress(address.id);
                      }}
                      className="mt-2 h-7 text-xs px-2 text-primary"
                    >
                      <Star size={12} className="mr-1" /> Set as default
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditAddress(address.id);
                    }}
                    className="h-8 w-8"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAddress(address.id);
                    }}
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    disabled={savedAddresses.length === 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 mb-4">No addresses saved yet</p>
          <Button onClick={() => setIsAddingAddress(true)}>Add New Address</Button>
        </div>
      )}
    </div>
  );
};

export default AddressSelection; 
