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
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  isLoading: false,
  addToCart: async () => {},
  updateCartItemQuantity: async () => {},
  removeCartItem: async () => {},
  clearCart: async () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize session ID on first load
  useEffect(() => {
    const storedSessionId = localStorage.getItem("cartSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
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
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(payload: Omit<AddToCartPayload, "sessionId">) {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/cart", {
        ...payload,
        sessionId
      });
      
      await fetchCartItems(); // Refresh cart after adding item
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartItemQuantity(id: number, quantity: number) {
    try {
      setIsLoading(true);
      const response = await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
      
      await fetchCartItems(); // Refresh cart after updating
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeCartItem(id: number) {
    try {
      setIsLoading(true);
      const response = await apiRequest("DELETE", `/api/cart/${id}`);
      
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
      const response = await apiRequest("DELETE", `/api/cart?sessionId=${sessionId}`);
      
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
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
