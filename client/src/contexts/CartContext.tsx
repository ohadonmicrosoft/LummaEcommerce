import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, AddToCartPayload } from "../types";
import { apiRequest } from "@/lib/queryClient";
import { v4 as uuidv4 } from "uuid";

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (payload: Omit<AddToCartPayload, "sessionId">) => Promise<void>;
  updateCartItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  saveCartAsOrder: (customerInfo: any, shippingInfo: any, paymentInfo: any) => Promise<string>;
  lastAddedItemId: number | null;
  cartCountChanged: boolean;
  resetCartCountChanged: () => void;
}

// Create a mock cart item for testing purposes
const createMockCartItem = (id = 9999) => ({
  id: id,
  productId: 1,
  quantity: 1,
  createdAt: new Date().toISOString(),
  product: {
    id: 1,
    name: "XTR-5 Tactical Backpack",
    slug: "xtr-5-tactical-backpack",
    description: "Military-grade tactical backpack with MOLLE system",
    price: 129.99,
    categoryId: 1,
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    featured: true,
    newArrival: true,
    bestSeller: false,
    mainImage: "/images/products/tactical-backpack.jpg",
    createdAt: new Date().toISOString()
  }
});

const mockCartItem = createMockCartItem();

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  isLoading: false,
  addToCart: async () => {},
  updateCartItemQuantity: async () => {},
  removeCartItem: async () => {},
  clearCart: async () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  saveCartAsOrder: async () => "",
  lastAddedItemId: null,
  cartCountChanged: false,
  resetCartCountChanged: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const [lastAddedItemId, setLastAddedItemId] = useState<number | null>(null);
  const [cartCountChanged, setCartCountChanged] = useState(false);
  
  // Function to reset cart count changed state after animation completes
  const resetCartCountChanged = () => {
    setCartCountChanged(false);
  };
  
  // Mock cart for development if the API is not returning items
  const [useMockCart, setUseMockCart] = useState(process.env.NODE_ENV === 'development');

  // Initialize with mock data in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && useMockCart && cartItems.length === 0) {
      console.log("[CartContext] Initializing with mock data in development mode");
      setCartItems([createMockCartItem()]);
    }
  }, [useMockCart, cartItems.length]);

  // Initialize session ID on first load
  useEffect(() => {
    const storedSessionId = localStorage.getItem("cartSessionId");
    console.log("[CartContext] Stored session ID:", storedSessionId);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      console.log("[CartContext] Generated new session ID:", newSessionId);
      localStorage.setItem("cartSessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Fetch cart items whenever sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchCartItems();
    }
  }, [sessionId]);

  async function fetchCartItems() {
    try {
      setIsLoading(true);
      
      // Log the session ID used for debugging
      console.log("[CartContext] Fetching cart with sessionId:", sessionId);
      
      if (!sessionId) {
        console.log("[CartContext] No session ID available, using mock data");
        if (process.env.NODE_ENV === 'development') {
          setCartItems([mockCartItem]);
        }
        return;
      }
      
      // First try to fetch from API
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      
      const data = await response.json();
      console.log("[CartContext] Cart items fetched:", data);
      
      // If data is empty array and we're in development, use mock data
      if (data.length === 0 && process.env.NODE_ENV === 'development') {
        if (useMockCart) {
          console.log("[CartContext] Using mock cart data for development");
          setCartItems([mockCartItem]);
        } else {
          setCartItems(data);
        }
      } else {
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // If fetch fails and we're in development, use mock data
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        console.log("[CartContext] Using mock cart data due to error");
        setCartItems([mockCartItem]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(payload: Omit<AddToCartPayload, "sessionId">) {
    try {
      setIsLoading(true);
      console.log("[CartContext] Adding item to cart:", payload);
      
      // Track previous cart count for animation
      const previousCount = getTotalItems();
      
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        // For development: simulate adding to cart
        console.log("[CartContext] Development mode: simulating add to cart");
        const newItem = createMockCartItem(Date.now());
        const updatedItem = {
          ...newItem, 
          productId: payload.productId,
          quantity: payload.quantity || 1,
          colorVariant: payload.colorVariant,
          sizeVariant: payload.sizeVariant
        };
        
        setCartItems(prev => [...prev, updatedItem]);
        
        // Set the last added item ID for highlighting
        setLastAddedItemId(updatedItem.id);
        // Trigger cart count changed animation
        setCartCountChanged(true);
        
        // Reset animation state after a delay
        setTimeout(() => {
          setCartCountChanged(false);
          // Keep last added item highlighted a bit longer
          setTimeout(() => {
            setLastAddedItemId(null);
          }, 2000);
        }, 1500);
        
        return;
      }
      
      await apiRequest("POST", "/api/cart", {
        ...payload,
        sessionId
      });
      
      await fetchCartItems(); // Refresh cart after adding item
      
      // Check if cart count changed to trigger animation
      const newCount = getTotalItems();
      if (newCount > previousCount) {
        setCartCountChanged(true);
        
        // Reset animation state after a delay
        setTimeout(() => {
          setCartCountChanged(false);
        }, 1500);
      }
      
      console.log("[CartContext] Cart updated after adding item, total items:", getTotalItems());
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        // For development: simulate adding to cart even if API fails
        const newItem = createMockCartItem(Date.now());
        const updatedItem = {
          ...newItem, 
          productId: payload.productId,
          quantity: payload.quantity || 1,
          colorVariant: payload.colorVariant,
          sizeVariant: payload.sizeVariant
        };
        
        setCartItems(prev => [...prev, updatedItem]);
        setLastAddedItemId(updatedItem.id);
        setCartCountChanged(true);
        
        setTimeout(() => {
          setCartCountChanged(false);
          setTimeout(() => {
            setLastAddedItemId(null);
          }, 2000);
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartItemQuantity(id: number, quantity: number) {
    try {
      setIsLoading(true);
      
      // Set the last updated item for highlighting
      setLastAddedItemId(id);
      
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        // For development: simulate updating cart
        setCartItems(prev => 
          prev.map(item => item.id === id ? {...item, quantity} : item)
        );
        
        // Trigger animation for quantity change
        setCartCountChanged(true);
        
        // Reset animation states after delays
        setTimeout(() => {
          setCartCountChanged(false);
          setTimeout(() => {
            setLastAddedItemId(null);
          }, 1000);
        }, 1000);
        
        return;
      }
      
      await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
      
      setCartCountChanged(true);
      setTimeout(() => setCartCountChanged(false), 1000);
      
      await fetchCartItems(); // Refresh cart after updating
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setIsLoading(false);
      // Ensure we reset the highlighted item after a timeout
      setTimeout(() => {
        setLastAddedItemId(null);
      }, 2000);
    }
  }

  async function removeCartItem(id: number) {
    try {
      setIsLoading(true);
      
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        // For development: simulate removing from cart
        setCartItems(prev => prev.filter(item => item.id !== id));
        return;
      }
      
      await apiRequest("DELETE", `/api/cart/${id}`);
      
      await fetchCartItems(); // Refresh cart after removing item
    } catch (error) {
      console.error("Error removing cart item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function clearCart() {
    try {
      setIsLoading(true);
      
      if (process.env.NODE_ENV === 'development' && useMockCart) {
        // For development: simulate clearing cart
        setCartItems([]);
        return;
      }
      
      await apiRequest("DELETE", `/api/cart?sessionId=${sessionId}`);
      
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalPrice() {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  }

  // Save cart as an order and return order ID
  async function saveCartAsOrder(customerInfo: any, shippingInfo: any, paymentInfo: any) {
    try {
      setIsLoading(true);
      // Create the order data from cart and customer information
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price,
          colorVariant: item.colorVariant,
          sizeVariant: item.sizeVariant
        })),
        customerInfo,
        shippingInfo,
        paymentInfo: {
          // Don't include sensitive data like card numbers
          method: 'credit_card',
          lastFour: paymentInfo?.cardNumber ? paymentInfo.cardNumber.slice(-4) : undefined
        },
        totalAmount: getTotalPrice(),
        sessionId,
        createdAt: new Date().toISOString()
      };
      
      // In a real app, this would call an API endpoint to create the order
      // For now, simulate it with a local mock
      console.log("Creating order with data:", orderData);
      
      // Generate a mock order ID for now
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // In a real implementation, we would send this to a server endpoint
      // const response = await apiRequest("POST", "/api/orders", orderData);
      // const { orderId } = await response.json();
      
      return orderId;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Toggle mock cart for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Toggle mock cart with keyboard shortcut (Ctrl+Alt+M)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.key === 'm') {
          setUseMockCart(prev => !prev);
          console.log("[CartContext] Mock cart " + (!useMockCart ? "enabled" : "disabled"));
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [useMockCart]);

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        getTotalItems,
        getTotalPrice,
        saveCartAsOrder,
        lastAddedItemId,
        cartCountChanged,
        resetCartCountChanged
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
