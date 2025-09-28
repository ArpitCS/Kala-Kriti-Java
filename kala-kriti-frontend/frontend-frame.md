# Kala-Kriti Frontend Wireframe & Development Instructions

## Project Overview
Kala-Kriti is a minimalist, modern art marketplace e-commerce platform built with Next.js, focusing on clean black and white aesthetics with seamless backend integration.

## Tech Stack Requirements
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + Shadcn UI Components
- **Icons**: Lucide Icons (included with Shadcn)
- **Theme**: Black & White, Modern, Minimalistic
- **Directory**: `kala-kriti-frontend/`
- **Assets**: Favicon and Logo (present in root)

---

## Site Architecture & Pages Structure

### 1. Authentication Pages

#### `/login`
**Purpose**: User authentication
**Features**:
- Simple centered form with email/username and password fields
- "Remember Me" checkbox
- "Forgot Password?" link
- Role-based redirect (Customer → Home, Artist → Dashboard, Admin → Admin Panel)
- Social auth buttons (future enhancement)
- Link to registration page

**API Integration**:
\`\`\`javascript
POST /api/auth/login
Body: { username, password }
Response: { token, tokenType, expiresAt, user: { id, username, role } }
\`\`\`

#### `/register`
**Purpose**: User registration
**Features**:
- Multi-step form or single form with role selection
- Fields: username, email, password, firstName, lastName, role (CUSTOMER/ARTIST/ADMIN)
- Role-specific onboarding hints
- Terms & conditions checkbox
- Automatic login after successful registration

**API Integration**:
\`\`\`javascript
POST /api/auth/register
Body: { username, password, email, firstName, lastName, role }
Response: { id, username, email, firstName, lastName, role, createdAt }
\`\`\`

### 2. Customer-Facing Pages

#### `/` (Homepage)
**Purpose**: Main landing and product discovery
**Layout**:
- Hero section with featured artwork and call-to-action
- Category navigation (Oil Painting, Watercolor, etc.)
- Featured artists section
- Recently added artworks grid
- Search bar prominently placed

**Features**:
- Responsive product grid (4-3-2-1 columns based on screen size)
- Category filtering
- Quick search functionality
- "View All" links to category pages

#### `/products`
**Purpose**: Main product catalog
**Features**:
- Advanced filtering sidebar (Category, Price Range, Artist, Sort by)
- Product grid with hover effects
- Pagination or infinite scroll
- Sort options (Price: Low to High, Newest, Popular)
- Search results display
- Empty state for no products found

**API Integration**:
\`\`\`javascript
GET /api/products?page=1&size=12&category=2&sort=price_asc
GET /api/products/search?name=landscape
GET /api/categories
\`\`\`

#### `/products/[id]`
**Purpose**: Individual product details
**Layout**:
- Large product image gallery (main image + thumbnails)
- Product information (title, description, price, stock)
- Artist information card
- Add to cart button with quantity selector
- Related products section
- Reviews/ratings (future enhancement)

**Features**:
- Image zoom on hover
- Share product functionality
- Artist profile link
- Stock availability indicator
- Responsive image carousel

#### `/artists/[id]`
**Purpose**: Artist profile and their products
**Features**:
- Artist bio and profile image
- Artist's artwork collection
- Contact artist button
- Social media links
- Artist statistics (total works, years active)

#### `/categories/[id]`
**Purpose**: Category-specific product listings
**Features**:
- Category description
- Category-specific filtering
- Breadcrumb navigation
- Similar to main products page but filtered

#### `/cart`
**Purpose**: Shopping cart management
**Features**:
- Item list with images, titles, prices, quantities
- Quantity adjustment controls
- Remove items functionality
- Order subtotal, tax, shipping calculations
- Checkout button
- Continue shopping link
- Empty cart state

#### `/checkout`
**Purpose**: Order completion
**Layout**:
- Multi-step process (Shipping → Payment → Confirmation)
- Order summary sidebar
- Shipping address form
- Payment method selection
- Order review before submission

**Features**:
- Form validation
- Progress indicator
- Order total breakdown
- Terms acceptance
- Success/error handling

**API Integration**:
\`\`\`javascript
POST /api/orders
Body: { customerId, items, shippingAddress, totalAmount }
POST /api/payments/process
Body: { orderId, customerId, amount, method }
\`\`\`

#### `/profile`
**Purpose**: User account management (Customer)
**Features**:
- Personal information editing
- Order history
- Address book
- Change password
- Account preferences
- Order tracking

**API Integration**:
\`\`\`javascript
GET /api/users/me
PUT /api/users/{id}
GET /api/orders/customer/{customerId}
\`\`\`

### 3. Artist Dashboard Pages

#### `/artist/dashboard`
**Purpose**: Artist control panel
**Features**:
- Sales overview and analytics
- Quick stats (total products, orders, revenue)
- Recent orders
- Product management shortcuts
- Profile completion status

#### `/artist/products`
**Purpose**: Artist product management
**Features**:
- Product list with edit/delete actions
- Add new product button
- Stock status indicators
- Sales data per product
- Bulk actions

**API Integration**:
\`\`\`javascript
GET /api/products/artist/{artistId}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
\`\`\`

#### `/artist/products/new` & `/artist/products/[id]/edit`
**Purpose**: Product creation and editing
**Features**:
- Image upload with preview
- Product details form (title, description, price, stock)
- Category selection
- Save as draft functionality
- Preview before publish

#### `/artist/orders`
**Purpose**: Order management for artists
**Features**:
- Order list with status filters
- Order details view
- Status update capabilities
- Customer communication

#### `/artist/profile`
**Purpose**: Artist profile management
**Features**:
- Bio and description editing
- Profile image upload
- Social media links
- Portfolio showcase settings
- Public profile preview

### 4. Admin Panel Pages

#### `/admin/dashboard`
**Purpose**: Administrative overview
**Features**:
- System-wide statistics
- User registration trends
- Sales analytics
- Recent activities
- System health indicators

#### `/admin/users`
**Purpose**: User management
**Features**:
- User list with role filters
- User details and editing
- Account status management (enable/disable)
- Role assignment
- User activity logs

**API Integration**:
\`\`\`javascript
GET /api/users?page=1&size=20&role=ARTIST
GET /api/users/{id}
PUT /api/users/{id}
DELETE /api/users/{id}
\`\`\`

#### `/admin/products`
**Purpose**: Product oversight
**Features**:
- All products management
- Product approval workflow
- Content moderation
- Category management
- Bulk operations

#### `/admin/orders`
**Purpose**: Order management
**Features**:
- All orders overview
- Order status management
- Dispute resolution
- Refund processing
- Analytics and reporting

#### `/admin/categories`
**Purpose**: Category management
**Features**:
- Category CRUD operations
- Category hierarchy management
- Category analytics

**API Integration**:
\`\`\`javascript
GET /api/categories
POST /api/categories
PUT /api/categories/{id}
DELETE /api/categories/{id}
\`\`\`

### 5. Utility Pages

#### `/search`
**Purpose**: Global search results
**Features**:
- Combined results (products, artists, categories)
- Advanced search filters
- Search suggestions
- Recent searches

#### `/404`
**Purpose**: Error handling
**Features**:
- Minimalist error message
- Navigation suggestions
- Return to home button

---

## Component Structure

### Shared Components

#### `Header/Navbar`
- Logo and brand name
- Main navigation (Home, Products, Artists, Categories)
- Search bar
- User account dropdown
- Cart icon with item count
- Mobile hamburger menu

#### `Footer`
- Company information
- Quick links
- Social media icons
- Newsletter signup
- Legal links (Privacy, Terms)

#### `ProductCard`
- Product image with hover effects
- Product title and artist name
- Price display
- Quick action buttons
- Favorite/wishlist icon

#### `SearchBar`
- Auto-complete suggestions
- Category filter dropdown
- Clear search functionality
- Recent searches

#### `CartSidebar`
- Sliding cart panel
- Mini cart items display
- Quick checkout access
- Cart total

### Page-Specific Components

#### `ProductGallery`
- Main product image
- Thumbnail navigation
- Zoom functionality
- Fullscreen view

#### `ArtistCard`
- Artist profile image
- Basic information
- View profile link
- Follow button (future)

#### `FilterSidebar`
- Category checkboxes
- Price range slider
- Artist selection
- Sort options
- Clear all filters

#### `OrderSummary`
- Item breakdown
- Pricing calculations
- Promo code input
- Total display

---

## Design System Specifications

### Color Palette
\`\`\`css
/* Primary Colors */
--color-white: #ffffff
--color-black: #000000
--color-gray-50: #f9fafb
--color-gray-100: #f3f4f6
--color-gray-200: #e5e7eb
--color-gray-300: #d1d5db
--color-gray-400: #9ca3af
--color-gray-500: #6b7280
--color-gray-600: #4b5563
--color-gray-700: #374151
--color-gray-800: #1f2937
--color-gray-900: #111827

/* Accent Colors */
--color-accent: #f3f4f6 /* Light gray for subtle highlights */
--color-error: #ef4444
--color-success: #10b981
--color-warning: #f59e0b
\`\`\`

### Typography
\`\`\`css
/* Font Families */
font-family: 'Inter', system-ui, sans-serif

/* Font Sizes */
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */
\`\`\`

### Spacing & Layout
\`\`\`css
/* Container Sizes */
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px

/* Spacing Scale */
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
\`\`\`

### Component Styles

#### Buttons
\`\`\`css
/* Primary Button */
.btn-primary {
  background: black;
  color: white;
  border: 2px solid black;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: white;
  color: black;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: black;
  border: 2px solid black;
}

.btn-secondary:hover {
  background: black;
  color: white;
}
\`\`\`

#### Cards
\`\`\`css
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0; /* Sharp corners for minimalist look */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
\`\`\`

---

## Authentication & State Management

### JWT Token Handling
\`\`\`javascript
// Store token in httpOnly cookie for security
// Include token in Authorization header for API calls
// Auto-refresh token before expiration
// Redirect to login on 401 responses
\`\`\`

### User State Management
\`\`\`javascript
// Context for user authentication state
// Role-based component rendering
// Protected route wrapper components
// Persistent login state across sessions
\`\`\`

---

## API Integration Patterns

### HTTP Client Setup
\`\`\`javascript
// Base URL: http://localhost:8080
// Default headers: Content-Type: application/json
// Automatic token attachment
// Error handling and retry logic
// Request/response interceptors
\`\`\`

### Error Handling
\`\`\`javascript
// Consistent error message display
// Network error fallbacks
// Validation error highlighting
// Loading states for all API calls
\`\`\`

---

## Performance Considerations

### Image Optimization
- Next.js Image component for all artwork images
- Responsive image sizing
- Lazy loading implementation
- WebP format preference

### SEO Optimization
- Dynamic meta tags for product pages
- Open Graph tags for social sharing
- Structured data for products
- Sitemap generation

### Loading States
- Skeleton loaders for product grids
- Progressive loading for images
- Loading spinners for form submissions
- Error boundaries for component failures

---

## Mobile Responsiveness

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Mobile-Specific Features
- Touch-friendly buttons (44px minimum)
- Swipeable product galleries
- Mobile-optimized navigation
- Thumb-friendly form inputs

---

## Development Guidelines for Cursor AI

### Folder Structure
\`\`\`
kala-kriti-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (customer)/
│   │   ├── page.tsx (homepage)
│   │   ├── products/
│   │   ├── cart/
│   │   └── profile/
│   ├── (artist)/
│   │   └── artist/
│   └── (admin)/
│       └── admin/
├── components/
│   ├── ui/ (shadcn components)
│   ├── shared/
│   └── forms/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
└── public/
    ├── favicon.ico
    └── logo.png
\`\`\`

### Component Patterns
- Use TypeScript for all components
- Implement proper error boundaries
- Follow Shadcn UI component patterns
- Use Next.js App Router conventions
- Implement proper loading states

### API Integration
- Create typed interfaces for all API responses
- Implement proper error handling
- Use React Query or SWR for data fetching
- Include authentication headers automatically

This wireframe provides a comprehensive foundation for building the Kala-Kriti frontend with proper integration to your existing backend API structure.
