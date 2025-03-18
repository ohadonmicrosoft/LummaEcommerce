import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: number;
  product: Product;
  dateAdded: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  isLoading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearWishlist: async () => {},
  isInWishlist: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  async function fetchWishlistItems() {
    setIsLoading(true);
    try {
      // In a real application, you would fetch from API
      // For now, we're just using localStorage
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wishlist items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addToWishlist(product: Product) {
    if (!isInWishlist(product.id)) {
      setIsLoading(true);
      try {
        // In a real application, you would call API
        // For now, we're just updating state and localStorage
        const newItem: WishlistItem = {
          id: Date.now(), // Use timestamp as unique ID
          product,
          dateAdded: new Date().toISOString(),
        };
        
        setWishlistItems(prev => [...prev, newItem]);
        
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
          variant: "default",
        });
      } catch (error) {
        console.error('Error adding item to wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to add item to wishlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      await removeFromWishlist(product.id);
    }
  }

  async function removeFromWishlist(productId: number) {
    setIsLoading(true);
    try {
      // In a real application, you would call API
      // For now, we're just updating state and localStorage
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function clearWishlist() {
    setIsLoading(true);
    try {
      // In a real application, you would call API
      // For now, we're just updating state and localStorage
      setWishlistItems([]);
      localStorage.removeItem('wishlist');
      
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function isInWishlist(productId: number): boolean {
    return wishlistItems.some(item => item.product.id === productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}