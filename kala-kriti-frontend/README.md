# Kala-Kriti Frontend

A modern e-commerce platform for artists built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Customer, Artist, Admin)
- **Artwork Marketplace**: Browse, search, and filter artworks with advanced filtering options
- **Shopping Cart**: Add items to cart, manage quantities, and proceed to checkout
- **Order Management**: Complete checkout process with multiple payment methods
- **Artist Dashboard**: Artists can manage their products, view statistics, and track sales
- **Admin Panel**: Comprehensive admin tools for managing users, orders, and payments
- **Responsive Design**: Mobile-first design with black and white aesthetic using shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Hooks + Local Storage
- **API Integration**: RESTful API with Spring Boot backend

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Spring Boot backend running on `http://localhost:8080`

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create environment file:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Update the API URL in `.env.local` if needed:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8080
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin management pages
│   ├── artworks/          # Artwork listing and detail pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── dashboard/         # Artist dashboard
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Main navigation
│   └── footer.tsx        # Footer component
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── auth.ts           # Authentication utilities
│   ├── cart.ts           # Cart management
│   └── types.ts          # TypeScript types
└── hooks/                 # Custom React hooks
    ├── use-auth.ts       # Authentication hook
    └── use-cart.ts       # Cart management hook
\`\`\`

## API Integration

The frontend seamlessly integrates with the Spring Boot microservices backend:

- **User Service**: Authentication and user management
- **Product Service**: Artwork listings and categories
- **Order Service**: Order processing and management
- **Payment Service**: Payment processing

All API calls are made through the centralized API Gateway at `http://localhost:8080`.

## User Roles

### Customer
- Browse and search artworks
- Add items to cart and checkout
- View order history
- Manage profile

### Artist
- All customer features
- Add and manage artworks
- View sales dashboard
- Track product performance

### Admin
- All artist features
- Manage all users
- Manage all orders and payments
- View platform-wide statistics

## Design System

The application uses a clean black and white design with:
- Primary color: Black (#000000)
- Background: White (#FFFFFF)
- Accents: Gray shades
- Typography: Inter font family
- Consistent spacing and rounded corners

## License

© 2025 Kala-Kriti. All rights reserved.
