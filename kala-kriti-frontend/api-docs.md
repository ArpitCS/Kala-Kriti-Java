# Kala-Kriti API Documentation - CURL Commands

## Overview

Kala-Kriti is an e-commerce platform for artists built with Spring Boot microservices architecture. This documentation provides comprehensive curl commands for all API endpoints.

## Base Information

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json` for all requests
- **Authentication**: JWT token required for most endpoints: `Authorization: Bearer <token>`

## Service Architecture

- **API Gateway** (Port 8080): Entry point for all client requests
- **User Service** (Port 8081): User management and authentication
- **Product Service** (Port 8082): Product and category management
- **Order Service** (Port 8083): Order processing
- **Payment Service** (Port 8084): Payment processing
- **Discovery Service** (Port 8761): Service registry (Eureka)
- **Config Service** (Port 8888): Centralized configuration

---

## Authentication Endpoints

### Register a New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "artist1",
    "password": "password123",
    "email": "artist1@example.com",
    "firstName": "Aria",
    "lastName": "Painter",
    "phoneNumber": "+91-9876543210",
    "role": "ARTIST",
    "bio": "Professional watercolor artist",
    "specialization": "Watercolor Paintings",
    "portfolioUrl": "https://portfolio.artist1.com"
  }'
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "artist1",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "phoneNumber": "+91-9876543210",
  "role": "ARTIST",
  "status": "ACTIVE",
  "bio": "Professional watercolor artist",
  "specialization": "Watercolor Paintings",
  "portfolioUrl": "https://portfolio.artist1.com"
}
```

### User Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "artist1",
    "password": "password123"
  }'
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ARTIST",
  "username": "artist1",
  "userId": 1
}
```

---

## User Management Endpoints

### Get All Users (Admin Only)

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <admin_token>"
```

### Get User by ID

```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <token>"
```

### Get Users by Role (Admin Only)

```bash
curl -X GET http://localhost:8080/api/users/role/ARTIST \
  -H "Authorization: Bearer <admin_token>"
```

**Available roles:** `ADMIN`, `ARTIST`, `CUSTOMER`

### Update User

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "email": "newemail@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "phoneNumber": "+91-9876543211",
    "bio": "Updated bio",
    "specialization": "Oil Paintings",
    "portfolioUrl": "https://newportfolio.com"
  }'
```

### Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

## Product Management Endpoints

### Get All Products (Public)

```bash
curl -X GET http://localhost:8080/api/products
```

### Get Product by ID (Public)

```bash
curl -X GET http://localhost:8080/api/products/1
```

### Get Products by Artist (Public)

```bash
curl -X GET http://localhost:8080/api/products/artist/1
```

### Get Products by Category (Public)

```bash
curl -X GET http://localhost:8080/api/products/category/1
```

### Search Products by Name (Public)

```bash
curl -X GET "http://localhost:8080/api/products/search?name=landscape"
```

### Create Product (Artist/Admin)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <artist_token>" \
  -d '{
    "name": "Sunset Landscape",
    "description": "Beautiful sunset landscape painting with vibrant colors",
    "price": 15000.00,
    "imageUrl": "https://cdn.example.com/art/sunset-landscape.jpg",
    "artistId": 1,
    "categoryId": 2,
    "stockQuantity": 1,
    "dimensions": "24x18 inches",
    "medium": "Oil on Canvas",
    "yearCreated": 2024
  }'
```

**Response (201 Created):**
```json
{
  "id": 10,
  "name": "Sunset Landscape",
  "description": "Beautiful sunset landscape painting with vibrant colors",
  "price": 15000.00,
  "imageUrl": "https://cdn.example.com/art/sunset-landscape.jpg",
  "artistId": 1,
  "categoryId": 2,
  "stockQuantity": 1,
  "status": "ACTIVE",
  "dimensions": "24x18 inches",
  "medium": "Oil on Canvas",
  "yearCreated": 2024,
  "createdAt": "2025-09-30T10:15:32Z",
  "updatedAt": "2025-09-30T10:15:32Z"
}
```

### Update Product (Owner/Admin)

```bash
curl -X PUT http://localhost:8080/api/products/10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <artist_token>" \
  -d '{
    "name": "Updated Sunset Landscape",
    "description": "Updated description with new details",
    "price": 18000.00,
    "stockQuantity": 1,
    "categoryId": 2,
    "dimensions": "24x18 inches",
    "medium": "Oil on Canvas",
    "yearCreated": 2024
  }'
```

### Delete Product (Owner/Admin)

```bash
curl -X DELETE http://localhost:8080/api/products/10 \
  -H "Authorization: Bearer <artist_token>"
```

---

## Category Management Endpoints

### Get All Categories (Public)

```bash
curl -X GET http://localhost:8080/api/categories
```

### Get Category by ID (Public)

```bash
curl -X GET http://localhost:8080/api/categories/1
```

### Create Category (Admin Only)

```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Sculptures",
    "description": "3D art sculptures and installations"
  }'
```

**Response (201 Created):**
```json
{
  "id": 5,
  "name": "Sculptures",
  "description": "3D art sculptures and installations"
}
```

### Update Category (Admin Only)

```bash
curl -X PUT http://localhost:8080/api/categories/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Modern Sculptures",
    "description": "Contemporary 3D art sculptures and installations"
  }'
```

### Delete Category (Admin Only)

```bash
curl -X DELETE http://localhost:8080/api/categories/5 \
  -H "Authorization: Bearer <admin_token>"
```

---

## Order Management Endpoints

### Get All Orders (Admin Only)

```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer <admin_token>"
```

### Get Order by ID (Customer/Admin)

```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer <customer_token>"
```

### Get Orders by Customer (Customer/Admin)

```bash
curl -X GET http://localhost:8080/api/orders/customer/4 \
  -H "Authorization: Bearer <customer_token>"
```

### Create Order (Customer)

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "customerId": 4,
    "totalAmount": 33000.00,
    "shippingAddress": "123 Art Street, Mumbai, Maharashtra 400001",
    "billingAddress": "123 Art Street, Mumbai, Maharashtra 400001",
    "items": [
      {
        "productId": 10,
        "quantity": 1,
        "price": 15000.00,
        "productName": "Sunset Landscape",
        "artistId": 1
      },
      {
        "productId": 11,
        "quantity": 1,
        "price": 18000.00,
        "productName": "Mountain View",
        "artistId": 2
      }
    ]
  }'
```

**Response (201 Created):**
```json
{
  "id": 32,
  "customerId": 4,
  "totalAmount": 33000.00,
  "status": "PENDING",
  "shippingAddress": "123 Art Street, Mumbai, Maharashtra 400001",
  "billingAddress": "123 Art Street, Mumbai, Maharashtra 400001",
  "items": [
    {
      "id": 45,
      "productId": 10,
      "quantity": 1,
      "price": 15000.00,
      "productName": "Sunset Landscape",
      "artistId": 1
    },
    {
      "id": 46,
      "productId": 11,
      "quantity": 1,
      "price": 18000.00,
      "productName": "Mountain View",
      "artistId": 2
    }
  ],
  "createdAt": "2025-09-30T11:30:15Z",
  "updatedAt": "2025-09-30T11:30:15Z"
}
```

### Update Order Status (Admin Only)

```bash
curl -X PUT http://localhost:8080/api/orders/32/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "status": "CONFIRMED"
  }'
```

**Available order statuses:** `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### Delete Order (Customer/Admin)

```bash
curl -X DELETE http://localhost:8080/api/orders/32 \
  -H "Authorization: Bearer <customer_token>"
```

---

## Payment Management Endpoints

### Get All Payments (Admin Only)

```bash
curl -X GET http://localhost:8080/api/payments \
  -H "Authorization: Bearer <admin_token>"
```

### Get Payment by ID (Customer/Admin)

```bash
curl -X GET http://localhost:8080/api/payments/1 \
  -H "Authorization: Bearer <customer_token>"
```

### Get Payments by Customer (Customer/Admin)

```bash
curl -X GET http://localhost:8080/api/payments/customer/4 \
  -H "Authorization: Bearer <customer_token>"
```

### Get Payment by Order ID (Customer/Admin)

```bash
curl -X GET http://localhost:8080/api/payments/order/32 \
  -H "Authorization: Bearer <customer_token>"
```

### Process Payment (Customer)

```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "orderId": 32,
    "customerId": 4,
    "amount": 33000.00,
    "method": "UPI",
    "transactionId": "TXN123456789",
    "gatewayResponse": "Payment successful via UPI"
  }'
```

**Response (201 Created):**
```json
{
  "id": 15,
  "orderId": 32,
  "customerId": 4,
  "amount": 33000.00,
  "status": "PENDING",
  "method": "UPI",
  "transactionId": "TXN123456789",
  "gatewayResponse": "Payment successful via UPI",
  "createdAt": "2025-09-30T11:35:20Z",
  "updatedAt": "2025-09-30T11:35:20Z"
}
```

**Available payment methods:** `CREDIT_CARD`, `DEBIT_CARD`, `UPI`, `NET_BANKING`, `WALLET`

### Update Payment Status (Admin Only)

```bash
curl -X PUT http://localhost:8080/api/payments/15/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "status": "COMPLETED"
  }'
```

**Available payment statuses:** `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`

### Delete Payment (Admin Only)

```bash
curl -X DELETE http://localhost:8080/api/payments/15 \
  -H "Authorization: Bearer <admin_token>"
```

---

## Common HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests (resource created)
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Authentication required or invalid credentials
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (duplicate)

---

## Sample Complete Workflow

### 1. Register as an Artist
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "artist_demo",
    "password": "demo123",
    "email": "demo@artist.com",
    "firstName": "Demo",
    "lastName": "Artist",
    "role": "ARTIST"
  }'
```

### 2. Login to Get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "artist_demo",
    "password": "demo123"
  }'
```

### 3. Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <received_token>" \
  -d '{
    "name": "Demo Artwork",
    "description": "Sample artwork for demo",
    "price": 5000.00,
    "artistId": 1,
    "categoryId": 1,
    "stockQuantity": 1
  }'
```

### 4. Register as a Customer and Place Order
```bash
# Register customer
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer_demo",
    "password": "demo123",
    "email": "demo@customer.com",
    "firstName": "Demo",
    "lastName": "Customer",
    "role": "CUSTOMER"
  }'

# Login as customer
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer_demo",
    "password": "demo123"
  }'

# Place order
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "customerId": 2,
    "totalAmount": 5000.00,
    "shippingAddress": "Demo Address",
    "items": [
      {
        "productId": 1,
        "quantity": 1,
        "price": 5000.00
      }
    ]
  }'
```

---

## Notes

1. Replace `<token>`, `<admin_token>`, `<artist_token>`, `<customer_token>` with actual JWT tokens received from login
2. All prices are in INR (Indian Rupees)
3. Timestamps are in ISO 8601 format (UTC)
4. IDs are auto-generated Long values
5. Required fields must be provided in requests
6. Optional fields can be omitted from request bodies
