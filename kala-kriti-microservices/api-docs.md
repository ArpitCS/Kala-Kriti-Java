Collecting workspace information# Kala-Kriti API Documentation

## Overview

Kala-Kriti is an e-commerce platform for artists built with a microservices architecture. This documentation covers the API endpoints exposed by the backend services through the API Gateway.

## Base Information

- **Base URL**: `http://localhost:8080`
- **Content-Type**: All requests should include `Content-Type: application/json`
- **Authentication**: Most endpoints require a JWT token in the Authorization header: `Authorization: Bearer <token>`

## Service Architecture

![Architecture Diagram](https://via.placeholder.com/800x400?text=Kala-Kriti+Microservices+Architecture)

The backend consists of the following services:
- **API Gateway** (Port 8080): Entry point for all client requests
- **User Service** (Port 8081): User management and authentication
- **Product Service** (Port 8082): Product and category management
- **Order Service** (Port 8083): Order processing
- **Payment Service** (Port 8084): Payment processing
- **Discovery Service** (Port 8761): Service registry (Eureka)
- **Config Service** (Port 8888): Centralized configuration

## Authentication

### Register a new user

**Endpoint**: `POST /api/auth/register`  
**Authentication**: No authentication required

**Request Body**:
```json
{
  "username": "artist1",
  "password": "password123",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "role": "ARTIST"  // ADMIN, ARTIST, or CUSTOMER
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "username": "artist1",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "role": "ARTIST",
  "createdAt": "2025-09-28T09:17:21Z"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 409 Conflict (username or email already exists)

### Login

**Endpoint**: `POST /api/auth/login`  
**Authentication**: No authentication required

**Request Body**:
```json
{
  "username": "artist1",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresAt": "2025-09-29T09:17:21Z",
  "user": {
    "id": 1,
    "username": "artist1",
    "role": "ARTIST"
  }
}
```

**Possible Errors**:
- 401 Unauthorized (invalid credentials)
- 423 Locked (user account disabled)

## User Management

### Get all users

**Endpoint**: `GET /api/users`  
**Authentication**: Requires ADMIN role  
**Query Parameters**:
- `page` (optional): Page number (default 0)
- `size` (optional): Page size (default 20)
- `sort` (optional): Sort field and direction (e.g., "lastName,asc")

**Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "username": "artist1",
      "email": "artist1@example.com",
      "firstName": "Aria",
      "lastName": "Painter",
      "role": "ARTIST",
      "createdAt": "2025-09-28T09:17:21Z"
    },
    // More users...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 42,
  "totalPages": 3,
  "last": false,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

### Get user by ID

**Endpoint**: `GET /api/users/{id}`  
**Authentication**: ADMIN or the user themselves  
**Path Parameters**:
- `id`: User ID

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "artist1",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "role": "ARTIST",
  "createdAt": "2025-09-28T09:17:21Z"
}
```

**Possible Errors**:
- 404 Not Found (user doesn't exist)

### Get users by role

**Endpoint**: `GET /api/users/role/{role}`  
**Authentication**: Requires ADMIN role  
**Path Parameters**:
- `role`: User role (ADMIN, ARTIST, or CUSTOMER)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "username": "artist1",
    "email": "artist1@example.com",
    "firstName": "Aria",
    "lastName": "Painter",
    "role": "ARTIST",
    "createdAt": "2025-09-28T09:17:21Z"
  },
  // More users with the same role...
]
```

### Get current user profile

**Endpoint**: `GET /api/users/me`  
**Authentication**: Any authenticated user

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "artist1",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "role": "ARTIST",
  "createdAt": "2025-09-28T09:17:21Z"
}
```

### Update user

**Endpoint**: `PUT /api/users/{id}`  
**Authentication**: ADMIN or the user themselves  
**Path Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "email": "new.email@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "enabled": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "artist1",
  "email": "new.email@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "role": "ARTIST",
  "createdAt": "2025-09-28T09:17:21Z"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 404 Not Found (user doesn't exist)

### Delete user

**Endpoint**: `DELETE /api/users/{id}`  
**Authentication**: Requires ADMIN role  
**Path Parameters**:
- `id`: User ID

**Response** (204 No Content)

**Possible Errors**:
- 404 Not Found (user doesn't exist)

## Product Management

### Get all products

**Endpoint**: `GET /api/products`  
**Authentication**: Optional (public endpoint)  
**Query Parameters**:
- `page` (optional): Page number (default 0)
- `size` (optional): Page size (default 20)
- `category` (optional): Filter by category ID
- `sort` (optional): Sort field and direction (e.g., "price,desc")

**Response** (200 OK):
```json
{
  "content": [
    {
      "id": 10,
      "title": "Watercolor Landscape",
      "description": "Hand painted 12x16 artwork",
      "price": 199.0,
      "stock": 5,
      "artistId": 7,
      "artistName": "Aria Painter",
      "category": {
        "id": 2,
        "name": "Watercolor"
      },
      "imageUrl": "https://cdn.example.com/art/123.jpg",
      "createdAt": "2025-09-28T08:45:11Z",
      "updatedAt": "2025-09-28T08:45:11Z"
    },
    // More products...
  ],
  "pageable": {
    // Pagination details...
  },
  "totalElements": 120,
  "totalPages": 6,
  // More pagination metadata...
}
```

### Get product by ID

**Endpoint**: `GET /api/products/{id}`  
**Authentication**: Optional (public endpoint)  
**Path Parameters**:
- `id`: Product ID

**Response** (200 OK):
```json
{
  "id": 10,
  "title": "Watercolor Landscape",
  "description": "Hand painted 12x16 artwork",
  "price": 199.0,
  "stock": 5,
  "artistId": 7,
  "artistName": "Aria Painter",
  "category": {
    "id": 2,
    "name": "Watercolor"
  },
  "imageUrl": "https://cdn.example.com/art/123.jpg",
  "createdAt": "2025-09-28T08:45:11Z",
  "updatedAt": "2025-09-28T08:45:11Z"
}
```

**Possible Errors**:
- 404 Not Found (product doesn't exist)

### Get products by artist

**Endpoint**: `GET /api/products/artist/{artistId}`  
**Authentication**: Optional (public endpoint)  
**Path Parameters**:
- `artistId`: Artist user ID

**Response** (200 OK):
```json
[
  {
    "id": 10,
    "title": "Watercolor Landscape",
    "description": "Hand painted 12x16 artwork",
    "price": 199.0,
    "stock": 5,
    "artistId": 7,
    "artistName": "Aria Painter",
    "category": {
      "id": 2,
      "name": "Watercolor"
    },
    "imageUrl": "https://cdn.example.com/art/123.jpg",
    "createdAt": "2025-09-28T08:45:11Z",
    "updatedAt": "2025-09-28T08:45:11Z"
  },
  // More products by the same artist...
]
```

### Get products by category

**Endpoint**: `GET /api/products/category/{categoryId}`  
**Authentication**: Optional (public endpoint)  
**Path Parameters**:
- `categoryId`: Category ID

**Response** (200 OK):
```json
[
  {
    "id": 10,
    "title": "Watercolor Landscape",
    "description": "Hand painted 12x16 artwork",
    "price": 199.0,
    "stock": 5,
    "artistId": 7,
    "artistName": "Aria Painter",
    "category": {
      "id": 2,
      "name": "Watercolor"
    },
    "imageUrl": "https://cdn.example.com/art/123.jpg",
    "createdAt": "2025-09-28T08:45:11Z",
    "updatedAt": "2025-09-28T08:45:11Z"
  },
  // More products in the same category...
]
```

### Search products by name

**Endpoint**: `GET /api/products/search?name={searchTerm}`  
**Authentication**: Optional (public endpoint)  
**Query Parameters**:
- `name`: Search term to match against product names

**Response** (200 OK):
```json
[
  {
    "id": 10,
    "title": "Watercolor Landscape",
    "description": "Hand painted 12x16 artwork",
    "price": 199.0,
    "stock": 5,
    "artistId": 7,
    "artistName": "Aria Painter",
    "category": {
      "id": 2,
      "name": "Watercolor"
    },
    "imageUrl": "https://cdn.example.com/art/123.jpg",
    "createdAt": "2025-09-28T08:45:11Z",
    "updatedAt": "2025-09-28T08:45:11Z"
  },
  // More products matching the search term...
]
```

### Create product

**Endpoint**: `POST /api/products`  
**Authentication**: Requires ARTIST or ADMIN role

**Request Body**:
```json
{
  "title": "Abstract Painting",
  "description": "Beautiful abstract art piece",
  "price": 5000.00,
  "stock": 1,
  "artistId": 1,
  "categoryId": 1,
  "imageUrl": "https://cdn.example.com/art/abstract-123.jpg"
}
```

**Response** (201 Created):
```json
{
  "id": 11,
  "title": "Abstract Painting",
  "description": "Beautiful abstract art piece",
  "price": 5000.00,
  "stock": 1,
  "artistId": 1,
  "artistName": "Aria Painter",
  "category": {
    "id": 1,
    "name": "Oil Painting"
  },
  "imageUrl": "https://cdn.example.com/art/abstract-123.jpg",
  "createdAt": "2025-09-28T10:15:32Z",
  "updatedAt": "2025-09-28T10:15:32Z"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 404 Not Found (category or artist doesn't exist)

### Update product

**Endpoint**: `PUT /api/products/{id}`  
**Authentication**: Owner (ARTIST) or ADMIN  
**Path Parameters**:
- `id`: Product ID

**Request Body**:
```json
{
  "title": "Updated Abstract Painting",
  "description": "Updated description",
  "price": 5500.00,
  "stock": 2,
  "categoryId": 1,
  "imageUrl": "https://cdn.example.com/art/abstract-123-updated.jpg"
}
```

**Response** (200 OK):
```json
{
  "id": 11,
  "title": "Updated Abstract Painting",
  "description": "Updated description",
  "price": 5500.00,
  "stock": 2,
  "artistId": 1,
  "artistName": "Aria Painter",
  "category": {
    "id": 1,
    "name": "Oil Painting"
  },
  "imageUrl": "https://cdn.example.com/art/abstract-123-updated.jpg",
  "createdAt": "2025-09-28T10:15:32Z",
  "updatedAt": "2025-09-28T11:20:15Z"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 404 Not Found (product, category, or artist doesn't exist)
- 403 Forbidden (not the owner or an admin)

### Delete product

**Endpoint**: `DELETE /api/products/{id}`  
**Authentication**: Owner (ARTIST) or ADMIN  
**Path Parameters**:
- `id`: Product ID

**Response** (204 No Content)

**Possible Errors**:
- 404 Not Found (product doesn't exist)
- 403 Forbidden (not the owner or an admin)

## Categories

### Get all categories

**Endpoint**: `GET /api/categories`  
**Authentication**: Optional (public endpoint)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Oil Painting",
    "description": "Oil painting artworks"
  },
  {
    "id": 2,
    "name": "Watercolor",
    "description": "Watercolor painting collection"
  },
  // More categories...
]
```

### Get category by ID

**Endpoint**: `GET /api/categories/{id}`  
**Authentication**: Optional (public endpoint)  
**Path Parameters**:
- `id`: Category ID

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Oil Painting",
  "description": "Oil painting artworks"
}
```

**Possible Errors**:
- 404 Not Found (category doesn't exist)

### Create category

**Endpoint**: `POST /api/categories`  
**Authentication**: Requires ADMIN role

**Request Body**:
```json
{
  "name": "Sculptures",
  "description": "3D art sculptures"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "Sculptures",
  "description": "3D art sculptures"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 409 Conflict (category name already exists)

### Update category

**Endpoint**: `PUT /api/categories/{id}`  
**Authentication**: Requires ADMIN role  
**Path Parameters**:
- `id`: Category ID

**Request Body**:
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 404 Not Found (category doesn't exist)
- 409 Conflict (category name already exists)

### Delete category

**Endpoint**: `DELETE /api/categories/{id}`  
**Authentication**: Requires ADMIN role  
**Path Parameters**:
- `id`: Category ID

**Response** (204 No Content)

**Possible Errors**:
- 404 Not Found (category doesn't exist)
- 400 Bad Request (category is in use by products)

## Order Management

### Get all orders

**Endpoint**: `GET /api/orders`  
**Authentication**: Requires ADMIN role

**Response** (200 OK):
```json
[
  {
    "id": 31,
    "customerId": 4,
    "status": "PLACED",
    "totalAmount": 350.0,
    "shippingAddress": "21 Art Street, Delhi",
    "createdAt": "2025-09-28T10:01:05Z",
    "updatedAt": "2025-09-28T10:01:05Z",
    "items": [
      { "productId": 10, "quantity": 2, "price": 199.0 },
      { "productId": 15, "quantity": 1, "price": 149.0 }
    ]
  },
  // More orders...
]
```

### Get order by ID

**Endpoint**: `GET /api/orders/{id}`  
**Authentication**: Customer (owner) or ADMIN  
**Path Parameters**:
- `id`: Order ID

**Response** (200 OK):
```json
{
  "id": 31,
  "customerId": 4,
  "status": "PLACED",
  "totalAmount": 350.0,
  "shippingAddress": "21 Art Street, Delhi",
  "createdAt": "2025-09-28T10:01:05Z",
  "updatedAt": "2025-09-28T10:01:05Z",
  "items": [
    { "productId": 10, "quantity": 2, "price": 199.0 },
    { "productId": 15, "quantity": 1, "price": 149.0 }
  ]
}
```

**Possible Errors**:
- 404 Not Found (order doesn't exist)
- 403 Forbidden (not the customer or an admin)

### Get orders by customer

**Endpoint**: `GET /api/orders/customer/{customerId}`  
**Authentication**: Customer (self) or ADMIN  
**Path Parameters**:
- `customerId`: Customer user ID

**Response** (200 OK):
```json
[
  {
    "id": 31,
    "customerId": 4,
    "status": "PLACED",
    "totalAmount": 350.0,
    "shippingAddress": "21 Art Street, Delhi",
    "createdAt": "2025-09-28T10:01:05Z",
    "updatedAt": "2025-09-28T10:01:05Z",
    "items": [
      { "productId": 10, "quantity": 2, "price": 199.0 },
      { "productId": 15, "quantity": 1, "price": 149.0 }
    ]
  },
  // More orders by the same customer...
]
```

**Possible Errors**:
- 403 Forbidden (not the customer or an admin)

### Create order

**Endpoint**: `POST /api/orders`  
**Authentication**: Requires CUSTOMER role

**Request Body**:
```json
{
  "customerId": 4,
  "items": [
    { "productId": 10, "quantity": 2 },
    { "productId": 15, "quantity": 1 }
  ],
  "shippingAddress": "21 Art Street, Delhi",
  "totalAmount": 350.0
}
```

**Response** (201 Created):
```json
{
  "id": 32,
  "customerId": 4,
  "status": "PLACED",
  "totalAmount": 350.0,
  "shippingAddress": "21 Art Street, Delhi",
  "createdAt": "2025-09-28T11:30:15Z",
  "updatedAt": "2025-09-28T11:30:15Z",
  "items": [
    { "productId": 10, "quantity": 2, "price": 199.0 },
    { "productId": 15, "quantity": 1, "price": 149.0 }
  ]
}
```

**Possible Errors**:
- 400 Bad Request (validation failed)
- 404 Not Found (product doesn't exist)
- 400 Bad Request (insufficient stock)

### Update order status

**Endpoint**: `PUT /api/orders/{id}/status`  
**Authentication**: Requires ADMIN role  
**Path Parameters**:
- `id`: Order ID

**Request Body**:
```json
{
  "status": "PROCESSING"
}
```

**Response** (200 OK):
```json
{
  "id": 31,
  "customerId": 4,
  "status": "PROCESSING",
  "totalAmount": 350.0,
  "shippingAddress": "21 Art Street, Delhi",
  "createdAt": "2025-09-28T10:01:05Z",
  "updatedAt": "2025-09-28T11:45:22Z",
  "items": [
    { "productId": 10, "quantity": 2, "price": 199.0 },
    { "productId": 15, "quantity": 1, "price": 149.0 }
  ]
}
```

**Possible Errors**:
- 400 Bad Request (invalid status)
- 404 Not Found (order doesn't exist)

### Delete order

**Endpoint**: `DELETE /api/orders/{id}`  
**Authentication**: Customer (owner) or ADMIN  
**Path Parameters**:
- 