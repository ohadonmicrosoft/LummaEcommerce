import { 
  users, categories, products, productImages, productVariants, cartItems,
  storeLocations, inventory, inventoryTransactions,
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type ProductImage, type InsertProductImage,
  type ProductVariant, type InsertProductVariant,
  type StoreLocation, type InsertStoreLocation,
  type Inventory, type InsertInventory,
  type InventoryTransaction, type InsertInventoryTransaction,
  type CartItem, type InsertCartItem
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(options?: { 
    featured?: boolean, 
    newArrival?: boolean, 
    bestSeller?: boolean,
    categoryId?: number,
    limit?: number
  }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Product Image operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  
  // Product Variant operations
  getProductVariants(productId: number): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  
  // Store Location operations
  getStoreLocations(): Promise<StoreLocation[]>;
  getStoreLocationBySlug(slug: string): Promise<StoreLocation | undefined>;
  getStoreLocation(id: number): Promise<StoreLocation | undefined>;
  createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation>;
  updateStoreLocation(id: number, location: Partial<InsertStoreLocation>): Promise<StoreLocation | undefined>;
  
  // Inventory operations
  getInventory(options?: { 
    storeId?: number,
    productId?: number,
    variantId?: number,
    lowStock?: boolean
  }): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  getProductInventory(productId: number): Promise<(Inventory & { store: StoreLocation })[]>;
  createInventory(item: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, item: Partial<InsertInventory>): Promise<Inventory | undefined>;
  
  // Inventory Transaction operations
  getInventoryTransactions(inventoryId: number): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  
  // Cart operations
  getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]>;
  getCartItemWithProduct(id: number): Promise<(CartItem & { product: Product }) | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private productVariants: Map<number, ProductVariant>;
  private storeLocations: Map<number, StoreLocation>;
  private inventory: Map<number, Inventory>;
  private inventoryTransactions: Map<number, InventoryTransaction>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private productImageId: number;
  private productVariantId: number;
  private storeLocationId: number;
  private inventoryId: number;
  private inventoryTransactionId: number;
  private cartItemId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.productVariants = new Map();
    this.storeLocations = new Map();
    this.inventory = new Map();
    this.inventoryTransactions = new Map();
    this.cartItems = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.productImageId = 1;
    this.productVariantId = 1;
    this.storeLocationId = 1;
    this.inventoryId = 1;
    this.inventoryTransactionId = 1;
    this.cartItemId = 1;
    
    // Seed some initial data
    this.seedData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt, profilePicture: null };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getProducts(options: { 
    featured?: boolean, 
    newArrival?: boolean, 
    bestSeller?: boolean,
    categoryId?: number,
    limit?: number
  } = {}): Promise<Product[]> {
    let filteredProducts = Array.from(this.products.values());
    
    if (options.featured !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.featured === options.featured);
    }
    
    if (options.newArrival !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.newArrival === options.newArrival);
    }
    
    if (options.bestSeller !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.bestSeller === options.bestSeller);
    }
    
    if (options.categoryId !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === options.categoryId);
    }
    
    if (options.limit !== undefined) {
      filteredProducts = filteredProducts.slice(0, options.limit);
    }
    
    return filteredProducts;
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt, 
      rating: 0, 
      reviewCount: 0 
    };
    this.products.set(id, product);
    return product;
  }
  
  // Product Image operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values())
      .filter(image => image.productId === productId)
      .sort((a, b) => a.order - b.order);
  }
  
  async createProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    const id = this.productImageId++;
    const image: ProductImage = { ...insertImage, id };
    this.productImages.set(id, image);
    return image;
  }
  
  // Product Variant operations
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values())
      .filter(variant => variant.productId === productId);
  }
  
  async createProductVariant(insertVariant: InsertProductVariant): Promise<ProductVariant> {
    const id = this.productVariantId++;
    const variant: ProductVariant = { ...insertVariant, id };
    this.productVariants.set(id, variant);
    return variant;
  }
  
  // Store Location operations
  async getStoreLocations(): Promise<StoreLocation[]> {
    return Array.from(this.storeLocations.values());
  }
  
  async getStoreLocationBySlug(slug: string): Promise<StoreLocation | undefined> {
    return Array.from(this.storeLocations.values()).find(location => location.slug === slug);
  }
  
  async getStoreLocation(id: number): Promise<StoreLocation | undefined> {
    return this.storeLocations.get(id);
  }
  
  async createStoreLocation(insertLocation: InsertStoreLocation): Promise<StoreLocation> {
    const id = this.storeLocationId++;
    const location: StoreLocation = { 
      ...insertLocation,
      id, 
      address: insertLocation.address || null,
      city: insertLocation.city || null,
      state: insertLocation.state || null,
      zipCode: insertLocation.zipCode || null,
      country: insertLocation.country || null,
      phone: insertLocation.phone || null,
      email: insertLocation.email || null,
      storeHours: insertLocation.storeHours || null,
      active: insertLocation.active ?? true,
      latitude: insertLocation.latitude || null,
      longitude: insertLocation.longitude || null
    };
    this.storeLocations.set(id, location);
    return location;
  }
  
  async updateStoreLocation(id: number, partialLocation: Partial<InsertStoreLocation>): Promise<StoreLocation | undefined> {
    const location = this.storeLocations.get(id);
    if (!location) return undefined;
    
    const updatedLocation: StoreLocation = {
      ...location,
      ...partialLocation,
      // Ensure nulls are preserved if fields are not provided
      address: partialLocation.address !== undefined ? partialLocation.address : location.address,
      city: partialLocation.city !== undefined ? partialLocation.city : location.city,
      state: partialLocation.state !== undefined ? partialLocation.state : location.state,
      zipCode: partialLocation.zipCode !== undefined ? partialLocation.zipCode : location.zipCode,
      country: partialLocation.country !== undefined ? partialLocation.country : location.country,
      phone: partialLocation.phone !== undefined ? partialLocation.phone : location.phone,
      email: partialLocation.email !== undefined ? partialLocation.email : location.email,
      storeHours: partialLocation.storeHours !== undefined ? partialLocation.storeHours : location.storeHours,
      active: partialLocation.active !== undefined ? partialLocation.active : location.active,
      latitude: partialLocation.latitude !== undefined ? partialLocation.latitude : location.latitude,
      longitude: partialLocation.longitude !== undefined ? partialLocation.longitude : location.longitude
    };
    
    this.storeLocations.set(id, updatedLocation);
    return updatedLocation;
  }
  
  // Inventory operations
  async getInventory(options: { 
    storeId?: number,
    productId?: number,
    variantId?: number,
    lowStock?: boolean
  } = {}): Promise<Inventory[]> {
    let filteredInventory = Array.from(this.inventory.values());
    
    if (options.storeId !== undefined) {
      filteredInventory = filteredInventory.filter(item => item.storeId === options.storeId);
    }
    
    if (options.productId !== undefined) {
      filteredInventory = filteredInventory.filter(item => item.productId === options.productId);
    }
    
    if (options.variantId !== undefined) {
      filteredInventory = filteredInventory.filter(item => item.variantId === options.variantId);
    }
    
    if (options.lowStock === true) {
      filteredInventory = filteredInventory.filter(item => 
        item.quantity !== null && 
        item.lowStockThreshold !== null && 
        item.quantity <= item.lowStockThreshold
      );
    }
    
    return filteredInventory;
  }
  
  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }
  
  async getProductInventory(productId: number): Promise<(Inventory & { store: StoreLocation })[]> {
    const inventoryItems = Array.from(this.inventory.values())
      .filter(item => item.productId === productId);
      
    return inventoryItems.map(item => {
      const store = this.storeLocations.get(item.storeId);
      if (!store) {
        throw new Error(`Store with id ${item.storeId} not found`);
      }
      return { ...item, store };
    });
  }
  
  async createInventory(insertItem: InsertInventory): Promise<Inventory> {
    const id = this.inventoryId++;
    const inventory: Inventory = { 
      ...insertItem,
      id,
      storeId: insertItem.storeId,
      productId: insertItem.productId,
      variantId: insertItem.variantId || null,
      quantity: insertItem.quantity || 0,
      lowStockThreshold: insertItem.lowStockThreshold || 5,
      sku: insertItem.sku || null,
      notes: insertItem.notes || null
    };
    this.inventory.set(id, inventory);
    return inventory;
  }
  
  async updateInventory(id: number, partialItem: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;
    
    const updatedItem: Inventory = {
      ...item,
      ...partialItem,
      // Ensure nulls are preserved if fields are not provided
      variantId: partialItem.variantId !== undefined ? partialItem.variantId : item.variantId,
      quantity: partialItem.quantity !== undefined ? partialItem.quantity : item.quantity,
      lowStockThreshold: partialItem.lowStockThreshold !== undefined ? partialItem.lowStockThreshold : item.lowStockThreshold,
      sku: partialItem.sku !== undefined ? partialItem.sku : item.sku,
      notes: partialItem.notes !== undefined ? partialItem.notes : item.notes
    };
    
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }
  
  // Inventory Transaction operations
  async getInventoryTransactions(inventoryId: number): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values())
      .filter(transaction => transaction.inventoryId === inventoryId)
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = this.inventoryTransactionId++;
    const createdAt = new Date();
    
    const transaction: InventoryTransaction = {
      ...insertTransaction,
      id,
      createdAt,
      userId: insertTransaction.userId || null,
      notes: insertTransaction.notes || null,
      referenceNumber: insertTransaction.referenceNumber || null,
      sourceLocation: insertTransaction.sourceLocation || null,
      destinationLocation: insertTransaction.destinationLocation || null
    };
    
    this.inventoryTransactions.set(id, transaction);
    
    // Update inventory quantity based on the transaction
    const inventory = this.inventory.get(transaction.inventoryId);
    if (inventory) {
      const oldQuantity = inventory.quantity || 0;
      let newQuantity = oldQuantity;
      
      switch(transaction.transactionType) {
        case 'receive':
          newQuantity = oldQuantity + transaction.quantity;
          break;
        case 'adjust':
          newQuantity = transaction.newQuantity;
          break;
        case 'transfer_out':
          newQuantity = oldQuantity - transaction.quantity;
          break;
        case 'transfer_in':
          newQuantity = oldQuantity + transaction.quantity;
          break;
        case 'sale':
          newQuantity = oldQuantity - transaction.quantity;
          break;
        case 'return':
          newQuantity = oldQuantity + transaction.quantity;
          break;
      }
      
      // Update the inventory with the new quantity
      this.updateInventory(inventory.id, { quantity: newQuantity });
    }
    
    return transaction;
  }
  
  // Cart operations
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => 
        (userId !== undefined && item.userId === userId) || 
        (sessionId !== undefined && item.sessionId === sessionId)
      );
  }
  
  async getCartItemWithProduct(id: number): Promise<(CartItem & { product: Product }) | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const product = this.products.get(cartItem.productId);
    if (!product) return undefined;
    
    return { ...cartItem, product };
  }
  
  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const createdAt = new Date();
    const item: CartItem = { 
      ...insertItem, 
      id, 
      createdAt,
      userId: insertItem.userId || null,
      sessionId: insertItem.sessionId || null,
      quantity: insertItem.quantity || 1,
      colorVariant: insertItem.colorVariant || null,
      sizeVariant: insertItem.sizeVariant || null,
      storeId: insertItem.storeId || null
    };
    this.cartItems.set(id, item);
    return item;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => 
        (userId !== undefined && item.userId === userId) || 
        (sessionId !== undefined && item.sessionId === sessionId)
      );
    
    for (const item of itemsToRemove) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }
  
  // Seed data method
  private seedData() {
    // Seed categories
    const tacticalCategory = this.seedCategory({
      name: "Tactical Gear",
      slug: "tactical-gear",
      description: "Professional-grade equipment for tactical operations",
      imageUrl: "https://images.unsplash.com/photo-1585498514138-5c1dee5ea6eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRhY3RpY2FsJTIwZ2VhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&h=600&q=60"
    });
    
    const outdoorCategory = this.seedCategory({
      name: "Outdoor Equipment",
      slug: "outdoor-equipment",
      description: "Durable gear for your wilderness adventures",
      imageUrl: "https://images.unsplash.com/photo-1598153346810-860daa814c4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b3V0ZG9vciUyMGdlYXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=600&h=600&q=60"
    });
    
    const apparelCategory = this.seedCategory({
      name: "Tactical Apparel",
      slug: "tactical-apparel",
      description: "Performance clothing for extreme conditions",
      imageUrl: "https://images.unsplash.com/photo-1521223344201-d169129f7b7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dGFjdGljYWwlMjBhcHBhcmVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=60"
    });
    
    // Seed products
    const backpack = this.seedProduct({
      name: "XTR-5 Tactical Backpack",
      slug: "xtr-5-tactical-backpack",
      description: "The XTR-5 Tactical Backpack represents the pinnacle of modern tactical equipment design, engineered for professionals who demand the highest standards of performance and reliability in high-stress environments.",
      price: 189.99,
      categoryId: tacticalCategory.id,
      inStock: true,
      featured: true,
      newArrival: true,
      bestSeller: false,
      mainImage: "https://images.unsplash.com/photo-1594767215098-1e2d2d8a2957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80",
      rating: 4.5,
      reviewCount: 42
    });
    
    const plateCarrier = this.seedProduct({
      name: "Alpha-7 Plate Carrier",
      slug: "alpha-7-plate-carrier",
      description: "The Alpha-7 Plate Carrier combines advanced material science with tactical functionality. Designed for professionals who require high mobility without compromising protection. Features adjustable straps, quick-release system, and MOLLE webbing for maximum customization.",
      price: 249.99,
      categoryId: tacticalCategory.id,
      inStock: true,
      featured: true,
      newArrival: false,
      bestSeller: true,
      mainImage: "https://images.unsplash.com/photo-1603807008857-ad66b70431e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80",
      rating: 5.0,
      reviewCount: 87
    });
    
    const boots = this.seedProduct({
      name: "Ranger Pro Tactical Boots",
      slug: "ranger-pro-tactical-boots",
      description: "Professional-grade tactical boots designed for maximum comfort and durability in extreme conditions. Features waterproof construction, slip-resistant soles, and reinforced toe protection.",
      price: 179.99,
      categoryId: apparelCategory.id,
      inStock: true,
      featured: true,
      newArrival: false,
      bestSeller: false,
      mainImage: "https://images.unsplash.com/photo-1515355758951-8d4b420945ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80",
      rating: 4.0,
      reviewCount: 29
    });
    
    const tent = this.seedProduct({
      name: "Expedition Ultra Tent",
      slug: "expedition-ultra-tent",
      description: "All-season expedition tent designed for extreme environments. Features a durable, weather-resistant construction, reinforced poles for stability in high winds, and multiple ventilation options.",
      price: 349.99,
      salePrice: 429.99,
      categoryId: outdoorCategory.id,
      inStock: true,
      featured: true,
      newArrival: false,
      bestSeller: false,
      mainImage: "https://images.unsplash.com/photo-1543966888-7c1dc482a810?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80",
      rating: 4.5,
      reviewCount: 54
    });
    
    // Seed product images for plate carrier
    this.seedProductImage({
      productId: plateCarrier.id,
      imageUrl: "https://images.unsplash.com/photo-1603807008857-ad66b70431e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80",
      altText: "Alpha-7 Plate Carrier - Front view",
      order: 0
    });
    
    this.seedProductImage({
      productId: plateCarrier.id,
      imageUrl: "https://images.unsplash.com/photo-1541756694115-6eafc1d89b6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80",
      altText: "Alpha-7 Plate Carrier - Side view",
      order: 1
    });
    
    this.seedProductImage({
      productId: plateCarrier.id,
      imageUrl: "https://images.unsplash.com/photo-1624123914029-9ce1e45e6d35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80",
      altText: "Alpha-7 Plate Carrier - Back view",
      order: 2
    });
    
    this.seedProductImage({
      productId: plateCarrier.id,
      imageUrl: "https://images.unsplash.com/photo-1603807008749-d1a230fdb704?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000&q=80",
      altText: "Alpha-7 Plate Carrier - Detail view",
      order: 3
    });
    
    // Seed product variants for plate carrier
    const blackVariant = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "Black",
      value: "#232323",
      type: "color",
      inStock: true
    });
    
    const oliveVariant = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "Olive",
      value: "#5B5D43",
      type: "color",
      inStock: true
    });
    
    const coyoteVariant = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "Coyote",
      value: "#79624A",
      type: "color",
      inStock: true
    });
    
    const grayVariant = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "Gray",
      value: "#758283",
      type: "color",
      inStock: true
    });
    
    const sizeSmall = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "S",
      value: "S",
      type: "size",
      inStock: true
    });
    
    const sizeMedium = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "M",
      value: "M",
      type: "size",
      inStock: true
    });
    
    const sizeLarge = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "L",
      value: "L",
      type: "size",
      inStock: true
    });
    
    const sizeXL = this.seedProductVariant({
      productId: plateCarrier.id,
      name: "XL",
      value: "XL",
      type: "size",
      inStock: true
    });
    
    // Seed store locations
    const flagshipStore = this.seedStoreLocation({
      name: "Luma Flagship Store",
      slug: "luma-flagship-store",
      address: "123 Tactical Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (212) 555-7890",
      email: "flagship@lumatactical.com",
      storeHours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
      active: true,
      latitude: 40.7128,
      longitude: -74.0060
    });
    
    const westCoastStore = this.seedStoreLocation({
      name: "Luma West Coast",
      slug: "luma-west-coast",
      address: "456 Outdoor Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      phone: "+1 (310) 555-1234",
      email: "westcoast@lumatactical.com",
      storeHours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
      active: true,
      latitude: 34.0522,
      longitude: -118.2437
    });
    
    const texasStore = this.seedStoreLocation({
      name: "Luma Texas",
      slug: "luma-texas",
      address: "789 Ranger Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
      phone: "+1 (512) 555-6789",
      email: "texas@lumatactical.com",
      storeHours: "Mon-Sat: 9AM-9PM, Sun: 11AM-6PM",
      active: true,
      latitude: 30.2672,
      longitude: -97.7431
    });
    
    const warehouseLocation = this.seedStoreLocation({
      name: "Main Distribution Center",
      slug: "main-distribution-center",
      address: "1000 Logistics Way",
      city: "Columbus",
      state: "OH",
      zipCode: "43219",
      country: "USA",
      phone: "+1 (614) 555-9000",
      email: "warehouse@lumatactical.com",
      storeHours: "Mon-Fri: 8AM-5PM",
      active: true,
      latitude: 39.9612,
      longitude: -82.9988
    });
    
    // Seed inventory
    const flagshipPlateCarrierBlackInventory = this.seedInventory({
      storeId: flagshipStore.id,
      productId: plateCarrier.id,
      variantId: blackVariant.id,
      quantity: 25,
      lowStockThreshold: 5,
      sku: "PCBLK-FS-001",
      notes: "Best-selling color in flagship store"
    });
    
    const flagshipPlateCarrierOliveInventory = this.seedInventory({
      storeId: flagshipStore.id,
      productId: plateCarrier.id,
      variantId: oliveVariant.id,
      quantity: 15,
      lowStockThreshold: 5,
      sku: "PCOLI-FS-002",
      notes: "Popular with military customers"
    });
    
    const warehousePlateCarrierAllColors = [
      this.seedInventory({
        storeId: warehouseLocation.id,
        productId: plateCarrier.id,
        variantId: blackVariant.id,
        quantity: 150,
        lowStockThreshold: 30,
        sku: "PCBLK-WH-001",
        notes: "Main warehouse stock"
      }),
      this.seedInventory({
        storeId: warehouseLocation.id,
        productId: plateCarrier.id,
        variantId: oliveVariant.id,
        quantity: 100,
        lowStockThreshold: 25,
        sku: "PCOLI-WH-002",
        notes: "Main warehouse stock"
      }),
      this.seedInventory({
        storeId: warehouseLocation.id,
        productId: plateCarrier.id,
        variantId: coyoteVariant.id,
        quantity: 75,
        lowStockThreshold: 20,
        sku: "PCCOY-WH-003",
        notes: "Main warehouse stock"
      }),
      this.seedInventory({
        storeId: warehouseLocation.id,
        productId: plateCarrier.id,
        variantId: grayVariant.id,
        quantity: 50,
        lowStockThreshold: 15,
        sku: "PCGRY-WH-004",
        notes: "Main warehouse stock"
      })
    ];
    
    // Add some transactions
    this.seedInventoryTransaction({
      inventoryId: flagshipPlateCarrierBlackInventory.id,
      transactionType: "receive",
      quantity: 25,
      previousQuantity: 0,
      newQuantity: 25,
      notes: "Initial inventory",
      referenceNumber: "RCV-001",
      sourceLocation: warehouseLocation.id
    });
    
    this.seedInventoryTransaction({
      inventoryId: flagshipPlateCarrierBlackInventory.id,
      transactionType: "sale",
      quantity: 2,
      previousQuantity: 25,
      newQuantity: 23,
      notes: "In-store purchase",
      referenceNumber: "SALE-001"
    });
    
    // Add back 2 for testing purposes to return to 25
    this.seedInventoryTransaction({
      inventoryId: flagshipPlateCarrierBlackInventory.id,
      transactionType: "adjust",
      quantity: 2,
      previousQuantity: 23,
      newQuantity: 25,
      notes: "Inventory adjustment",
      referenceNumber: "ADJ-001"
    });
  }
  
  private seedStoreLocation(location: InsertStoreLocation): StoreLocation {
    const id = this.storeLocationId++;
    const storeLocation: StoreLocation = {
      ...location,
      id,
      address: location.address || null,
      city: location.city || null,
      state: location.state || null,
      zipCode: location.zipCode || null,
      country: location.country || null,
      phone: location.phone || null,
      email: location.email || null,
      storeHours: location.storeHours || null,
      active: location.active ?? true,
      latitude: location.latitude || null,
      longitude: location.longitude || null,
      createdAt: new Date()
    };
    this.storeLocations.set(id, storeLocation);
    return storeLocation;
  }
  
  private seedInventory(item: InsertInventory): Inventory {
    const id = this.inventoryId++;
    const lastUpdated = new Date();
    const inventoryItem: Inventory = {
      ...item,
      id,
      storeId: item.storeId,
      productId: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity ?? 0,
      lowStockThreshold: item.lowStockThreshold ?? 5,
      sku: item.sku || null,
      notes: item.notes || null,
      lastUpdated
    };
    this.inventory.set(id, inventoryItem);
    return inventoryItem;
  }
  
  private seedInventoryTransaction(transaction: Omit<InsertInventoryTransaction, "userId" | "sourceLocation" | "destinationLocation"> & { 
    userId?: number, 
    sourceLocation?: number, 
    destinationLocation?: number 
  }): InventoryTransaction {
    const id = this.inventoryTransactionId++;
    const transactionDate = new Date();
    
    const inventoryTransaction: InventoryTransaction = {
      ...transaction,
      id,
      userId: transaction.userId || null,
      sourceLocation: transaction.sourceLocation || null,
      destinationLocation: transaction.destinationLocation || null,
      transactionDate
    };
    this.inventoryTransactions.set(id, inventoryTransaction);
    return inventoryTransaction;
  }
  
  private seedCategory(category: InsertCategory): Category {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  private seedProduct(product: InsertProduct & { rating: number, reviewCount: number }): Product {
    const id = this.productId++;
    const createdAt = new Date();
    const newProduct: Product = { ...product, id, createdAt };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  private seedProductImage(image: InsertProductImage): ProductImage {
    const id = this.productImageId++;
    const newImage: ProductImage = { ...image, id };
    this.productImages.set(id, newImage);
    return newImage;
  }
  
  private seedProductVariant(variant: InsertProductVariant): ProductVariant {
    const id = this.productVariantId++;
    const newVariant: ProductVariant = { ...variant, id };
    this.productVariants.set(id, newVariant);
    return newVariant;
  }
}

// Create and export the default storage instance
export const storage = new MemStorage();

// Export the MemStorage class for direct instantiation in serverless environments
export { MemStorage };
