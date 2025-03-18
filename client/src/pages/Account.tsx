import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  LogOut,
  Package,
  Truck,
  Check,
  ArrowRight,
  Upload,
  Edit,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fadeIn, slideUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const userData = {
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
  phone: '(555) 123-4567',
  addresses: [
    {
      id: 1,
      type: 'Home',
      street: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
      default: true
    },
    {
      id: 2,
      type: 'Work',
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90012',
      country: 'United States',
      default: false
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'Credit Card',
      cardType: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      default: true
    },
    {
      id: 2,
      type: 'Credit Card',
      cardType: 'Mastercard',
      lastFour: '5678',
      expiryDate: '10/24',
      default: false
    }
  ]
};

// Mock order data
const orders = [
  {
    id: 'ORD-38291',
    date: '2023-11-15T08:30:00',
    status: 'delivered',
    total: 245.99,
    items: [
      { id: 1, name: 'XTR-5 Tactical Backpack', quantity: 1, price: 159.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' },
      { id: 2, name: 'Elite Operator Gloves', quantity: 1, price: 85.99, image: 'https://images.unsplash.com/photo-1573456186324-c7573ea97903?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2xvdmVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60' }
    ],
    trackingInfo: {
      carrier: 'FedEx',
      trackingNumber: 'FD293842930',
      estimatedDelivery: '2023-11-18',
      events: [
        { date: '2023-11-17T16:30:00', description: 'Delivered', location: 'Los Angeles, CA' },
        { date: '2023-11-16T08:15:00', description: 'Out for delivery', location: 'Los Angeles, CA' },
        { date: '2023-11-15T22:40:00', description: 'Arrived at local facility', location: 'Los Angeles, CA' },
        { date: '2023-11-15T18:30:00', description: 'In transit', location: 'Oakland, CA' },
        { date: '2023-11-15T10:45:00', description: 'Shipped', location: 'San Francisco, CA' }
      ]
    }
  },
  {
    id: 'ORD-37142',
    date: '2023-10-30T14:20:00',
    status: 'delivered',
    total: 149.99,
    items: [
      { id: 3, name: 'Tactical Combat Boots', quantity: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vdHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' }
    ],
    trackingInfo: {
      carrier: 'UPS',
      trackingNumber: 'UP839274618',
      estimatedDelivery: '2023-11-05',
      events: [
        { date: '2023-11-03T14:20:00', description: 'Delivered', location: 'Los Angeles, CA' },
        { date: '2023-11-02T09:45:00', description: 'Out for delivery', location: 'Los Angeles, CA' },
        { date: '2023-11-01T22:30:00', description: 'Arrived at local facility', location: 'Los Angeles, CA' },
        { date: '2023-10-31T16:10:00', description: 'In transit', location: 'Denver, CO' },
        { date: '2023-10-30T18:40:00', description: 'Shipped', location: 'Chicago, IL' }
      ]
    }
  },
  {
    id: 'ORD-36103',
    date: '2023-10-12T11:15:00',
    status: 'processing',
    total: 78.99,
    items: [
      { id: 4, name: 'Tactical Flashlight Pro', quantity: 1, price: 78.99, image: 'https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZsYXNobGlnaHR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' }
    ],
    trackingInfo: {
      carrier: 'USPS',
      trackingNumber: 'PS927361834',
      estimatedDelivery: '2023-10-18',
      events: [
        { date: '2023-10-14T09:30:00', description: 'Processing', location: 'Warehouse' },
        { date: '2023-10-12T11:15:00', description: 'Order placed', location: 'Online' }
      ]
    }
  }
];

// Mock wishlist data
const wishlistItems = [
  {
    id: 1,
    name: 'Tactical Utility Belt',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    inStock: true
  },
  {
    id: 2,
    name: 'Advanced Combat Helmet',
    price: 229.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    inStock: false
  },
  {
    id: 3,
    name: 'Tactical Range Bag',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFnfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    inStock: true
  },
  {
    id: 4,
    name: 'Stealth Operator Watch',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdhdGNofGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    inStock: true
  },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to update profile
    setTimeout(() => {
      setEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 800);
  };
  
  const handleRemoveFromWishlist = (id: number) => {
    // Simulate API call to remove from wishlist
    toast({
      title: "Item Removed",
      description: "Item has been removed from your wishlist.",
    });
  };
  
  const handleAddToCart = (id: number) => {
    // Simulate API call to add to cart
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
    });
  };
  
  // Get the selected order details
  const orderDetails = orders.find(order => order.id === selectedOrder);
  
  // Format currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={userData.profilePicture} alt={userData.firstName} />
                <AvatarFallback>{userData.firstName.charAt(0)}{userData.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{userData.firstName} {userData.lastName}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <nav className="space-y-1">
              <Button 
                variant={activeTab === "profile" ? "default" : "ghost"} 
                onClick={() => setActiveTab("profile")}
                className="w-full justify-start rounded-none h-12"
              >
                <User size={18} className="mr-2" />
                Profile
              </Button>
              
              <Button 
                variant={activeTab === "orders" ? "default" : "ghost"} 
                onClick={() => { setActiveTab("orders"); setSelectedOrder(null); }}
                className="w-full justify-start rounded-none h-12"
              >
                <ShoppingBag size={18} className="mr-2" />
                Orders
              </Button>
              
              <Button 
                variant={activeTab === "wishlist" ? "default" : "ghost"} 
                onClick={() => setActiveTab("wishlist")}
                className="w-full justify-start rounded-none h-12"
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </Button>
              
              <Button 
                variant={activeTab === "addresses" ? "default" : "ghost"} 
                onClick={() => setActiveTab("addresses")}
                className="w-full justify-start rounded-none h-12"
              >
                <MapPin size={18} className="mr-2" />
                Addresses
              </Button>
              
              <Button 
                variant={activeTab === "payments" ? "default" : "ghost"} 
                onClick={() => setActiveTab("payments")}
                className="w-full justify-start rounded-none h-12"
              >
                <CreditCard size={18} className="mr-2" />
                Payment Methods
              </Button>
              
              <Button 
                variant="ghost"
                className="w-full justify-start rounded-none h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main content */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                {!editingProfile && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProfile(true)}
                    size="sm"
                  >
                    <Edit size={16} className="mr-2" /> Edit Profile
                  </Button>
                )}
              </CardHeader>
              
              <CardContent>
                {editingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={userData.profilePicture} alt={userData.firstName} />
                          <AvatarFallback>{userData.firstName.charAt(0)}{userData.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" type="button">
                          <Upload size={16} className="mr-2" /> Change Picture
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p>{userData.firstName} {userData.lastName}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                        <p>{userData.username}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p>{userData.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p>{userData.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col items-start border-t pt-6">
                <h3 className="text-sm font-medium mb-2">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Button variant="outline">
                    <Settings size={16} className="mr-2" /> Change Password
                  </Button>
                  <Button variant="outline">
                    <Settings size={16} className="mr-2" /> Two-Factor Authentication
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
          
          {/* Orders Tab */}
          {activeTab === "orders" && !selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              
              <CardContent>
                <motion.div 
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      variants={staggerItem}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{order.id}</h3>
                            <Badge variant={
                              order.status === "delivered" ? "success" : 
                              order.status === "processing" ? "outline" : "secondary"
                            }>
                              {order.status === "delivered" ? "Delivered" : 
                               order.status === "processing" ? "Processing" : 
                               order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">{formatter.format(order.total)}</p>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order.id)}
                            className="ml-auto"
                          >
                            View Details <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Package size={16} /> 
                          <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                          {order.status === "delivered" && (
                            <>
                              <span className="mx-2">•</span>
                              <Truck size={16} /> 
                              <span>
                                Delivered on {new Date(order.trackingInfo.events[0].date).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          )}
          
          {/* Order Details */}
          {activeTab === "orders" && selectedOrder && orderDetails && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedOrder(null)}
                      className="mb-2 -ml-2 text-secondary"
                    >
                      ← Back to Orders
                    </Button>
                    <CardTitle className="flex items-center gap-2">
                      Order {orderDetails.id}
                      <Badge variant={
                        orderDetails.status === "delivered" ? "success" : 
                        orderDetails.status === "processing" ? "outline" : "secondary"
                      }>
                        {orderDetails.status === "delivered" ? "Delivered" : 
                         orderDetails.status === "processing" ? "Processing" : 
                         orderDetails.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Placed on {formatDate(orderDetails.date)}</CardDescription>
                  </div>
                  {orderDetails.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      <ArrowRight size={16} className="mr-2" /> Track Package
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Order items */}
                <div>
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <motion.img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                            whileHover={{ scale: 1.05 }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm">{formatter.format(item.price)}</p>
                            <Button variant="ghost" size="sm">Buy Again</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order tracking */}
                <div>
                  <h3 className="font-medium mb-3">Tracking Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Carrier</p>
                        <p>{orderDetails.trackingInfo.carrier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tracking Number</p>
                        <p>{orderDetails.trackingInfo.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Delivery</p>
                        <p>{new Date(orderDetails.trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-4">
                        {orderDetails.trackingInfo.events.map((event, index) => (
                          <div key={index} className="ml-8 relative">
                            <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full ${
                              index === 0 ? 'bg-primary text-white' : 'bg-gray-200'
                            } flex items-center justify-center`}>
                              {index === 0 ? <Check size={14} /> : null}
                            </div>
                            <div>
                              <p className="font-medium">{event.description}</p>
                              <div className="flex text-sm text-gray-500">
                                <p>{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <span className="mx-1">•</span>
                                <p>{event.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order summary */}
                <div>
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatter.format(orderDetails.total - 15)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatter.format(10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatter.format(5)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>{formatter.format(orderDetails.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              
              <CardContent>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {wishlistItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={staggerItem}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-40 bg-gray-100 relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white hover:bg-red-50 text-red-500"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          <Heart size={16} fill="currentColor" />
                        </Button>
                        {!item.inStock && (
                          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
                            <Badge variant="outline" className="bg-white">Out of Stock</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="font-medium">{formatter.format(item.price)}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddToCart(item.id)}
                            disabled={!item.inStock}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          )}
          
          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </div>
                <Button size="sm">
                  <MapPin size={16} className="mr-2" /> Add New Address
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.default && (
                        <Badge className="absolute top-4 right-4">Default</Badge>
                      )}
                      <h3 className="font-medium mb-1">
                        {address.type}
                      </h3>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-2" /> Edit
                        </Button>
                        {!address.default && (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Payment Methods Tab */}
          {activeTab === "payments" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </div>
                <Button size="sm">
                  <CreditCard size={16} className="mr-2" /> Add Payment Method
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.paymentMethods.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4 relative">
                      {payment.default && (
                        <Badge className="absolute top-4 right-4">Default</Badge>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        {payment.cardType === 'Visa' ? (
                          <div className="h-8 w-12 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                            VISA
                          </div>
                        ) : (
                          <div className="h-8 w-12 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold">
                            MC
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{payment.cardType}</h3>
                          <p className="text-sm text-gray-500">Ending in {payment.lastFour}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500">Expires: {payment.expiryDate}</p>
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-2" /> Edit
                        </Button>
                        {!payment.default && (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}