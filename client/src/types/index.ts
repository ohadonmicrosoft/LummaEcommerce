// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  mainImage: string;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  order: number;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  value: string;
  type: string;
  inStock: boolean;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
  colorVariants: ProductVariant[];
  sizeVariants: ProductVariant[];
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

// Cart Types
export interface CartItem {
  id: number;
  userId?: number;
  sessionId?: string;
  productId: number;
  quantity: number;
  colorVariant?: string;
  sizeVariant?: string;
  createdAt: string;
  product: Product;
}

export interface AddToCartPayload {
  userId?: number;
  sessionId?: string;
  productId: number;
  quantity: number;
  colorVariant?: string;
  sizeVariant?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

// Testimonial Type
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
}
