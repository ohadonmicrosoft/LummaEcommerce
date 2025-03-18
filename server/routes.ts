import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage as defaultStorage } from "./storage";
import { insertCartItemSchema, insertInventoryTransactionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express, storageInstance = defaultStorage): Promise<Server> {
  // Create HTTP server
  const server = createServer(app);
  
  // Use the provided storage instance or fall back to the default
  const storage = storageInstance;
  
  // API routes prefix
  const apiPrefix = "/api";

  // Categories endpoints
  app.get(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get(`${apiPrefix}/categories/:slug`, async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products endpoints
  app.get(`${apiPrefix}/products`, async (req: Request, res: Response) => {
    try {
      const { featured, newArrival, bestSeller, categoryId, limit } = req.query;
      
      const options: any = {};
      if (featured !== undefined) options.featured = featured === 'true';
      if (newArrival !== undefined) options.newArrival = newArrival === 'true';
      if (bestSeller !== undefined) options.bestSeller = bestSeller === 'true';
      if (categoryId !== undefined) options.categoryId = parseInt(categoryId as string);
      if (limit !== undefined) options.limit = parseInt(limit as string);
      
      const products = await storage.getProducts(options);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(`${apiPrefix}/products/:slug`, async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get product images
      const images = await storage.getProductImages(product.id);
      
      // Get product variants
      const variants = await storage.getProductVariants(product.id);
      
      // Group variants by type
      const colorVariants = variants.filter(v => v.type === 'color');
      const sizeVariants = variants.filter(v => v.type === 'size');
      
      res.json({
        ...product,
        images,
        colorVariants,
        sizeVariants
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart endpoints
  app.get(`${apiPrefix}/cart`, async (req: Request, res: Response) => {
    try {
      const { userId, sessionId } = req.query;
      
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "Either userId or sessionId is required" });
      }
      
      const cartItems = await storage.getCartItems(
        userId ? parseInt(userId as string) : undefined,
        sessionId as string | undefined
      );
      
      const cartItemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getCartItemWithProduct(item.id);
          return product;
        })
      );
      
      const validCartItems = cartItemsWithProducts.filter(item => item !== undefined);
      
      res.json(validCartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post(`${apiPrefix}/cart`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      // Check if product exists
      const product = await storage.getProductBySlug(req.body.productSlug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Add productId to cart item
      const cartItem = await storage.addToCart({
        ...validatedData,
        productId: product.id
      });
      
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.patch(`${apiPrefix}/cart/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete(`${apiPrefix}/cart/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.removeCartItem(id);
      
      if (!result) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete(`${apiPrefix}/cart`, async (req: Request, res: Response) => {
    try {
      const { userId, sessionId } = req.query;
      
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "Either userId or sessionId is required" });
      }
      
      await storage.clearCart(
        userId ? parseInt(userId as string) : undefined,
        sessionId as string | undefined
      );
      
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Store Locations endpoints
  app.get(`${apiPrefix}/stores`, async (req: Request, res: Response) => {
    try {
      const storeLocations = await storage.getStoreLocations();
      res.json(storeLocations);
    } catch (error) {
      console.error("Error fetching store locations:", error);
      res.status(500).json({ message: "Failed to fetch store locations" });
    }
  });

  app.get(`${apiPrefix}/stores/:slug`, async (req: Request, res: Response) => {
    try {
      const store = await storage.getStoreLocationBySlug(req.params.slug);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error fetching store location:", error);
      res.status(500).json({ message: "Failed to fetch store location" });
    }
  });

  // Inventory endpoints
  app.get(`${apiPrefix}/inventory`, async (req: Request, res: Response) => {
    try {
      const { storeId, productId, variantId, lowStock } = req.query;
      
      const options: any = {};
      if (storeId !== undefined) options.storeId = parseInt(storeId as string);
      if (productId !== undefined) options.productId = parseInt(productId as string);
      if (variantId !== undefined) options.variantId = parseInt(variantId as string);
      if (lowStock !== undefined) options.lowStock = lowStock === 'true';
      
      const inventory = await storage.getInventory(options);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get(`${apiPrefix}/inventory/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const inventoryItem = await storage.getInventoryItem(id);
      
      if (!inventoryItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(inventoryItem);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.get(`${apiPrefix}/products/:id/inventory`, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProducts({ productId });
      
      if (!product || product.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const inventory = await storage.getProductInventory(productId);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching product inventory:", error);
      res.status(500).json({ message: "Failed to fetch product inventory" });
    }
  });

  app.get(`${apiPrefix}/inventory/:id/transactions`, async (req: Request, res: Response) => {
    try {
      const inventoryId = parseInt(req.params.id);
      const inventoryItem = await storage.getInventoryItem(inventoryId);
      
      if (!inventoryItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      const transactions = await storage.getInventoryTransactions(inventoryId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching inventory transactions:", error);
      res.status(500).json({ message: "Failed to fetch inventory transactions" });
    }
  });

  app.post(`${apiPrefix}/inventory/:id/transactions`, async (req: Request, res: Response) => {
    try {
      const inventoryId = parseInt(req.params.id);
      const inventoryItem = await storage.getInventoryItem(inventoryId);
      
      if (!inventoryItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      // Validate transaction data
      const validatedData = insertInventoryTransactionSchema.parse({
        ...req.body,
        inventoryId
      });
      
      const transaction = await storage.createInventoryTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating inventory transaction:", error);
      res.status(500).json({ message: "Failed to create inventory transaction" });
    }
  });
  
  return server;
}
