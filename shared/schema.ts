import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  salePrice: doublePrecision("sale_price"),
  categoryId: integer("category_id").references(() => categories.id),
  inStock: boolean("in_stock").default(true),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  newArrival: boolean("new_arrival").default(false),
  bestSeller: boolean("best_seller").default(false),
  mainImage: text("main_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Images table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  order: integer("order").default(0),
});

// Product Variants (colors, sizes)
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(), // 'color' or 'size'
  inStock: boolean("in_stock").default(true),
});

// Store Locations
export const storeLocations = pgTable("store_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  email: text("email"),
  storeHours: text("store_hours"),
  active: boolean("active").default(true),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => storeLocations.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  lastUpdated: timestamp("last_updated").defaultNow(),
  sku: text("sku"),
  notes: text("notes"),
}, (table) => {
  return {
    storeProductVariantUnique: unique().on(table.storeId, table.productId, table.variantId),
  };
});

// Inventory Transactions (for tracking history)
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: serial("id").primaryKey(),
  inventoryId: integer("inventory_id").references(() => inventory.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'receive', 'sell', 'adjust', 'transfer'
  quantity: integer("quantity").notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  userId: integer("user_id").references(() => users.id),
  notes: text("notes"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  referenceNumber: text("reference_number"),
  sourceLocation: integer("source_location").references(() => storeLocations.id),
  destinationLocation: integer("destination_location").references(() => storeLocations.id),
});

// Cart Items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For guest users
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  colorVariant: text("color_variant"),
  sizeVariant: text("size_variant"),
  storeId: integer("store_id").references(() => storeLocations.id), // For store-specific purchases
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  salePrice: true,
  categoryId: true,
  inStock: true,
  featured: true,
  newArrival: true,
  bestSeller: true,
  mainImage: true,
});

export const insertProductImageSchema = createInsertSchema(productImages).pick({
  productId: true,
  imageUrl: true,
  altText: true,
  order: true,
});

export const insertProductVariantSchema = createInsertSchema(productVariants).pick({
  productId: true,
  name: true,
  value: true,
  type: true,
  inStock: true,
});

export const insertStoreLocationSchema = createInsertSchema(storeLocations).pick({
  name: true,
  slug: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  phone: true,
  email: true,
  storeHours: true,
  active: true,
  latitude: true,
  longitude: true,
});

export const insertInventorySchema = createInsertSchema(inventory).pick({
  storeId: true,
  productId: true,
  variantId: true,
  quantity: true,
  lowStockThreshold: true,
  sku: true,
  notes: true,
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).pick({
  inventoryId: true,
  transactionType: true,
  quantity: true,
  previousQuantity: true,
  newQuantity: true,
  userId: true,
  notes: true,
  referenceNumber: true,
  sourceLocation: true,
  destinationLocation: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  sessionId: true,
  productId: true,
  quantity: true,
  colorVariant: true,
  sizeVariant: true,
  storeId: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

export type StoreLocation = typeof storeLocations.$inferSelect;
export type InsertStoreLocation = z.infer<typeof insertStoreLocationSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
