# LUMA E-commerce Platform - Technical Architecture

## 1. System Architecture Overview

The LUMA E-commerce Platform employs a modern full-stack JavaScript architecture designed for performance, maintainability, and scalability. The system follows a client-server architecture with a clear separation of concerns between frontend and backend components.

### 1.1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Application                        │
│                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │     React     │    │     State     │    │  UI Library   │   │
│  │  Components   │◄──►│   Management  │◄──►│  (Shadcn UI)  │   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│           ▲                    ▲                   ▲           │
│           │                    │                   │           │
│           ▼                    ▼                   ▼           │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │    Routing    │    │  Data Fetching│    │  Animations   │   │
│  │   (Wouter)    │◄──►│(TanStack Query)◄──►│(Framer Motion)│   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│           ▲                    ▲                               │
└───────────┼────────────────────┼───────────────────────────────┘
            │                    │
            ▼                    ▼
┌───────────────────────────────────────────────────────────────┐
│                          API Layer                             │
│                                                               │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐  │
│  │   Express     │    │    Routing    │    │   Middleware  │  │
│  │   Server      │◄──►│   & Controllers  ◄──►│   Pipeline   │  │
│  └───────────────┘    └───────────────┘    └───────────────┘  │
│           ▲                    ▲                  ▲           │
└───────────┼────────────────────┼──────────────────┼───────────┘
            │                    │                  │
            ▼                    ▼                  ▼
┌───────────────────────────────────────────────────────────────┐
│                         Data Layer                             │
│                                                               │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐  │
│  │  Data Models  │    │  Storage      │    │  Validation   │  │
│  │  & Schema     │◄──►│  Interface    │◄──►│  (Zod)        │  │
│  └───────────────┘    └───────────────┘    └───────────────┘  │
│           ▲                    ▲                  ▲           │
└───────────┼────────────────────┼──────────────────┼───────────┘
            │                    │                  │
            ▼                    ▼                  ▼
┌───────────────────────────────────────────────────────────────┐
│                    Persistence Layer                           │
│                                                               │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐  │
│  │  In-Memory    │    │  Drizzle ORM  │    │  Future DB    │  │
│  │  Storage      │◄──►│  Interface    │◄──►│  Adapters     │  │
│  └───────────────┘    └───────────────┘    └───────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 1.2. System Components

1. **Client Application**: React-based frontend with TypeScript
2. **API Layer**: Express.js server handling HTTP requests
3. **Data Layer**: Shared schemas and models between frontend and backend
4. **Persistence Layer**: Storage implementation with ORM abstraction

### 1.3. Communication Flow

1. Client initiates requests through React components and hooks
2. TanStack Query manages API request state and caching
3. Express API routes receive and process requests
4. Storage interface performs data operations through the ORM
5. Data flows back through the API to the client
6. React Context API manages global state

## 2. Frontend Architecture

### 2.1. Technology Stack

- **Core Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn UI components
- **Routing**: Wouter
- **State Management**: 
  - React Context API for global state
  - TanStack Query for server state
  - Local component state for UI state
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Built into TanStack Query (fetch API)

### 2.2. Directory Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   ├── home/         # Home page components
│   │   └── product/      # Product-specific components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
└── ...
```

### 2.3. Component Architecture

#### 2.3.1. Component Hierarchy

- **Page Components**: Top-level routes (Home, ProductListing, etc.)
  - **Layout Components**: Header, Footer, Sidebar, etc.
    - **Feature Components**: ProductCard, CategoryCard, etc.
      - **UI Components**: Button, Input, Card, etc.

#### 2.3.2. Component Design Principles

- **Composition Over Inheritance**: Components built from smaller, focused pieces
- **Props for Configuration**: Component behavior configured through props
- **Controlled Components**: Form elements maintain state through React
- **Component State Isolation**: Each component manages only its necessary state
- **Presentational and Container Components**: Separation of display and logic

### 2.4. State Management

#### 2.4.1. Context Providers

- **CartContext**: Shopping cart state and operations
- **WishlistContext**: Wishlist state and operations
- **UIContext**: UI state like modals, drawers, and navigation
- **LanguageContext**: Internationalization state and functions
- **AuthContext**: User authentication state (future implementation)

#### 2.4.2. Query and Mutation Patterns

- **useQuery**: Data fetching with automatic caching
- **useMutation**: Data updates with cache invalidation
- **Query Keys**: Structured for easy cache management
- **Query Invalidation**: Strategic cache updates after mutations

#### 2.4.3. Local Component State

- Used for UI state that doesn't need to be shared
- Form field values, validation states
- Toggle states, animation states
- Component-specific display settings

### 2.5. Routing System

- **Wouter**: Lightweight routing solution
- **Route Definitions**: Centralized in App.tsx
- **Route Parameters**: For dynamic paths (product slugs, etc.)
- **Lazy Loading**: Route-based code splitting
- **Navigation**: Programmatic and declarative navigation

## 3. Backend Architecture

### 3.1. Technology Stack

- **Core Framework**: Node.js with Express.js
- **Type Safety**: TypeScript
- **Data Validation**: Zod schemas
- **Database Abstraction**: Drizzle ORM
- **Storage**: In-memory implementation (expandable to PostgreSQL)
- **API Design**: RESTful endpoints

### 3.2. Directory Structure

```
server/
├── index.ts             # Server entry point
├── routes.ts            # API route definitions
├── storage.ts           # Storage interface implementation
├── vite.ts              # Vite integration for development
└── ...

shared/
├── schema.ts            # Shared data schema definitions
└── ...
```

### 3.3. API Design

#### 3.3.1. RESTful Endpoints

- **Resource-Based Routes**: /api/products, /api/categories, etc.
- **HTTP Methods**: GET, POST, PATCH, DELETE for CRUD operations
- **Status Codes**: Appropriate response status codes
- **Query Parameters**: For filtering, sorting, and pagination
- **Request Validation**: Input validation with Zod schemas

#### 3.3.2. Response Format

```json
{
  "data": { /* Response data */ },
  "meta": {
    "pagination": { /* Pagination info */ },
    "timestamps": { /* Timing information */ }
  },
  "error": { /* Error information if applicable */ }
}
```

### 3.4. Data Layer

#### 3.4.1. Storage Interface

- **IStorage Interface**: Defines all data operations
- **MemStorage Implementation**: In-memory storage for development
- **Future DB Adapters**: PostgreSQL adapter planned

#### 3.4.2. Data Models

Shared schema definitions for:
- Users
- Products
- Categories
- Product Images
- Product Variants
- Store Locations
- Inventory
- Cart Items
- Wishlist Items

### 3.5. Middleware Pipeline

- **Request Logging**: Log incoming requests
- **Error Handling**: Centralized error processing
- **CORS**: Cross-origin resource sharing
- **Body Parsing**: JSON request body parsing
- **Authentication**: Token validation (future implementation)
- **Request Validation**: Input validation with Zod

## 4. Data Schema

### 4.1. Core Entities

#### 4.1.1. User

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at", { mode: "date" }),
});
```

#### 4.1.2. Category

```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});
```

#### 4.1.3. Product

```typescript
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  salePrice: numeric("sale_price"),
  categoryId: integer("category_id").references(() => categories.id),
  inStock: boolean("in_stock"),
  featured: boolean("featured"),
  newArrival: boolean("new_arrival"),
  bestSeller: boolean("best_seller"),
  mainImage: text("main_image"),
  createdAt: timestamp("created_at", { mode: "date" }),
});
```

#### 4.1.4. Product Image

```typescript
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  order: integer("order"),
});
```

#### 4.1.5. Product Variant

```typescript
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(),
  inStock: boolean("in_stock"),
});
```

#### 4.1.6. Store Location

```typescript
export const storeLocations = pgTable("store_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  storeHours: text("store_hours"),
  active: boolean("active"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at", { mode: "date" }),
});
```

#### 4.1.7. Inventory

```typescript
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => storeLocations.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  lowStockThreshold: integer("low_stock_threshold"),
  sku: text("sku"),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated", { mode: "date" }),
});
```

#### 4.1.8. Cart Item

```typescript
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  colorVariant: text("color_variant"),
  sizeVariant: text("size_variant"),
  createdAt: timestamp("created_at", { mode: "date" }),
});
```

### 4.2. Schema Relationships

- **Products belong to Categories**: One-to-many relationship
- **Products have multiple Images**: One-to-many relationship
- **Products have multiple Variants**: One-to-many relationship
- **Inventory links Products to Stores**: Many-to-many relationship
- **Cart Items reference Products**: Many-to-one relationship
- **Inventory has Transactions**: One-to-many relationship

### 4.3. Data Validation

- **Insert Schemas**: Created with `createInsertSchema` from drizzle-zod
- **Validation Rules**: Defined in Zod schemas
- **Type Inference**: Using `z.infer<typeof schema>` for TypeScript types
- **Runtime Validation**: Used in API endpoints to validate request data

## 5. State Management

### 5.1. Client-Side State

#### 5.1.1. UI State

- **UI Context**: Manages global UI state
  - Modal visibility
  - Sidebar status
  - Header scroll state
  - Mobile menu visibility
  - Search overlay state

```typescript
interface UIContextType {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMegaMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // ...other state and methods
}
```

#### 5.1.2. Cart State

- **Cart Context**: Manages shopping cart
  - Cart items array
  - Add/remove/update methods
  - Cart totals calculation
  - Persistence across sessions

```typescript
interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateCartItemQuantity: (id: number, quantity: number) => Promise<void>;
  // ...other methods
}
```

#### 5.1.3. Wishlist State

- **Wishlist Context**: Manages wishlist
  - Wishlist items array
  - Add/remove methods
  - Item checking

```typescript
interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  // ...other methods
}
```

#### 5.1.4. Language State

- **Language Context**: Manages internationalization
  - Current language
  - Translation function
  - Direction (LTR/RTL)
  - Accessibility mode

```typescript
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  accessibilityMode: AccessibilityMode;
  // ...other properties and methods
}
```

### 5.2. Server State Management

#### 5.2.1. TanStack Query Implementation

- **Query Keys**: Structured for effective caching
  - Array format: [entity, id, params]
  - Example: ['products', productId]

- **Query Functions**: API request abstraction
  - Built on fetch API
  - Error handling
  - Response parsing

- **Query Options**: Configuration for each query
  - Stale time
  - Cache time
  - Retry behavior
  - Refetch on window focus

#### 5.2.2. Mutation Patterns

- **Mutation Functions**: Data update abstraction
  - HTTP method selection
  - Request body formatting
  - Error handling

- **Optimistic Updates**: Immediate UI updates before server confirmation
  - Previous state saving
  - Rollback on error
  - Success state application

- **Cache Invalidation**: Strategic cache updates after mutations
  - Query key invalidation
  - Refetching related queries
  - Updating related query data

## 6. Authentication and Authorization

### 6.1. Authentication Strategy

- **Current Implementation**: Session-based (development)
- **Future Implementation**: JWT token-based

#### 6.1.1. Authentication Flow

1. User submits credentials
2. Server validates credentials
3. JWT token generated and returned
4. Token stored in secure cookie or localStorage
5. Token attached to subsequent requests
6. Server validates token on protected endpoints

### 6.2. Authorization Strategy

- **Role-Based Access Control**: Future implementation
  - Customer role
  - Administrator role
  - Store manager role

- **Permission-Based Actions**: Future implementation
  - Resource-specific permissions
  - Action-specific permissions
  - Permission checking middleware

## 7. Internationalization (i18n)

### 7.1. Translation System

- **Translation Storage**: JSON objects by language
- **Translation Function**: Key-based lookup with fallback
- **Translation Context**: React context for language state
- **Language Detection**: Browser language detection
- **Language Persistence**: Local storage for user preference

```typescript
// Translation data structure
export const translations: Record<Language, Record<string, string>> = {
  en: {
    "home.welcome": "Welcome to LUMA",
    // ...more translations
  },
  he: {
    "home.welcome": "ברוכים הבאים ל-LUMA",
    // ...more translations
  },
};
```

### 7.2. RTL Support

- **Direction Management**: HTML dir attribute control
- **CSS Logical Properties**: Using start/end instead of left/right
- **Mirrored Layout**: Automatic layout mirroring
- **Component Adaptation**: RTL-aware component design
- **Icon Mirroring**: Selective icon mirroring

### 7.3. Cultural Adaptations

- **Date Formatting**: Locale-specific date display
- **Number Formatting**: Locale-specific number display
- **Currency Formatting**: Locale-specific currency display
- **Address Formatting**: Country-specific address forms

## 8. Accessibility Implementation

### 8.1. Technical Approach

- **Semantic HTML**: Proper element usage for meaning
- **ARIA Attributes**: Enhanced semantics where needed
- **Keyboard Navigation**: Complete keyboard control
- **Focus Management**: Logical focus flow and trapping
- **Screen Reader Announcements**: Dynamic content notifications

### 8.2. Accessibility Modes

- **Standard Mode**: Default experience
- **Screen Reader Mode**: Optimized for screen readers
  - Additional descriptions
  - Enhanced navigation
  - Simplified layouts

- **High Contrast Mode**: Enhanced visual contrast
  - Increased color contrast ratios
  - Thicker borders
  - Enhanced focus indicators

- **Reduced Motion Mode**: Minimized animations
  - Fewer motion effects
  - Shorter transitions
  - Static alternatives

### 8.3. Implementation Details

- **Accessibility Context**: React context for mode switching
- **Mode-specific Styling**: CSS variations based on mode
- **User Preference Detection**: prefers-reduced-motion and prefers-contrast media queries
- **Preference Persistence**: Local storage for user settings

## 9. Performance Optimization

### 9.1. Frontend Optimizations

- **Code Splitting**: Route-based splitting for reduced bundle size
- **Lazy Loading**: Component and route lazy loading
- **Image Optimization**: Responsive images and lazy loading
- **CSS Optimization**: Purging unused styles
- **JavaScript Optimization**: Tree shaking and minification

### 9.2. Backend Optimizations

- **Query Optimization**: Efficient database queries
- **Caching**: Response caching for frequent requests
- **Compression**: Response compression for reduced payload size
- **Connection Pooling**: Reuse database connections
- **Pagination**: Limit result sets for large collections

### 9.3. Network Optimizations

- **HTTP/2**: Multiplexed connections
- **Content Compression**: gzip/brotli compression
- **Cache Headers**: Proper cache control headers
- **Minimized Payloads**: Sending only necessary data
- **Reduced Round Trips**: Batch requests where possible

## 10. Security Considerations

### 10.1. Frontend Security

- **XSS Prevention**: Content sanitization
- **CSRF Protection**: Anti-CSRF tokens
- **Secure Cookies**: HttpOnly and Secure flags
- **Content Security Policy**: Restrict resource origins
- **Subresource Integrity**: Verify external resources

### 10.2. Backend Security

- **Input Validation**: Validate all user inputs
- **Parameter Sanitization**: Clean potentially dangerous inputs
- **SQL Injection Prevention**: Parameterized queries
- **Authentication**: Secure credential handling
- **Authorization**: Proper access controls

### 10.3. Data Security

- **Sensitive Data Handling**: Proper storage of sensitive information
- **Transport Security**: HTTPS for all communications
- **Password Handling**: Secure password hashing
- **API Security**: Rate limiting and request validation
- **Error Handling**: Non-revealing error messages

## 11. Testing Strategy

### 11.1. Unit Testing

- **Component Testing**: Individual component functionality
- **Hook Testing**: Custom hook behavior
- **Utility Testing**: Helper function correctness
- **State Testing**: State management logic

### 11.2. Integration Testing

- **Component Integration**: Interaction between components
- **API Integration**: Backend communication
- **State Integration**: State changes across components
- **Workflow Testing**: Multi-step processes

### 11.3. End-to-End Testing

- **User Flows**: Complete user journeys
- **Critical Paths**: High-importance workflows
- **Edge Cases**: Unusual user behavior
- **Regression Testing**: Previous functionality

### 11.4. Specialized Testing

- **Accessibility Testing**: WCAG compliance verification
- **Performance Testing**: Load time and responsiveness
- **Security Testing**: Vulnerability scanning
- **Cross-browser Testing**: Browser compatibility
- **Responsive Testing**: Device adaptation

## 12. Deployment Architecture

### 12.1. Build Process

- **Frontend Build**: Vite production build
  - Asset optimization
  - Code splitting
  - CSS minification
  - Source maps generation

- **Backend Build**: TypeScript compilation
  - Type checking
  - Transpilation to JavaScript
  - Bundle optimization

### 12.2. Deployment Environments

- **Development**: Local development environment
  - Hot module replacement
  - Development server
  - Non-minified code
  - Debug tools

- **Staging**: Pre-production testing environment
  - Production-like configuration
  - Test data
  - QA access
  - Performance monitoring

- **Production**: Live environment
  - Optimized builds
  - CDN integration
  - Scaling configuration
  - Enhanced security

### 12.3. CI/CD Pipeline

- **Continuous Integration**: Automated testing on commits
  - Code linting
  - Unit tests
  - Build verification
  - Type checking

- **Continuous Deployment**: Automated deployment process
  - Environment-specific configuration
  - Deployment verification
  - Rollback capability
  - Release notes generation

## 13. Monitoring and Analytics

### 13.1. Application Monitoring

- **Error Tracking**: Capture and report errors
- **Performance Monitoring**: Track page load and API response times
- **User Experience Monitoring**: Track UI interactions and flows
- **Resource Monitoring**: Track resource usage (CPU, memory)

### 13.2. Business Analytics

- **User Behavior**: Track user navigation and interaction
- **Conversion Tracking**: Monitor checkout and purchase funnel
- **Feature Usage**: Track feature adoption and usage
- **Search Analytics**: Monitor search terms and results
- **Product Performance**: Track product views and purchases

### 13.3. Infrastructure Monitoring

- **Server Health**: Monitor server performance and availability
- **Database Performance**: Track query performance and connection health
- **API Health**: Monitor endpoint response times and error rates
- **Network Performance**: Track latency and throughput
- **Resource Utilization**: Monitor CPU, memory, and disk usage

## 14. Future Technical Roadmap

### 14.1. Near-term Technical Enhancements

- **PostgreSQL Integration**: Replace in-memory storage with PostgreSQL
- **Authentication System**: Implement JWT-based authentication
- **Advanced Search**: Implement full-text search capabilities
- **Image Optimization**: Add dynamic image resizing and optimization
- **Performance Optimization**: Implement caching and response compression

### 14.2. Mid-term Technical Goals

- **Server-Side Rendering**: Add SSR for improved initial load
- **PWA Features**: Add progressive web app capabilities
- **Payment Integration**: Implement payment gateway integration
- **Order Management**: Add comprehensive order processing
- **Admin Interface**: Build administration dashboard

### 14.3. Long-term Technical Vision

- **Microservices Architecture**: Transition to microservices for scaling
- **GraphQL API**: Add GraphQL support for flexible data querying
- **Machine Learning Integration**: Product recommendations and search
- **Internationalization Expansion**: Support for additional languages
- **Voice Search Integration**: Add voice-based product search

## 15. Appendices

### 15.1. Glossary of Technical Terms

- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **SSR**: Server-Side Rendering
- **CSR**: Client-Side Rendering
- **PWA**: Progressive Web Application
- **CI/CD**: Continuous Integration/Continuous Deployment
- **RTL**: Right-to-Left (text direction)
- **WCAG**: Web Content Accessibility Guidelines
- **i18n**: Internationalization

### 15.2. External Dependencies

- **Framer Motion**: Animation library
- **TanStack Query**: Data fetching and state management
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema validation library
- **Drizzle ORM**: TypeScript ORM for SQL databases

### 15.3. Code Standards

- **ESLint Configuration**: Code linting rules
- **Prettier Configuration**: Code formatting rules
- **TypeScript Configuration**: Type checking rules
- **Git Workflow**: Branch naming and commit message conventions
- **Documentation Standards**: Code documentation requirements

### 15.4. Performance Benchmarks

- **Time to First Byte**: < 200ms
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Performance Score**: > 90
- **API Response Time**: < 200ms