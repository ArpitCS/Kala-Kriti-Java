# Kala-Kriti API Reference

Base URL via API Gateway: `http://localhost:8080`  
Every request must include `Content-Type: application/json`. Unless stated otherwise, endpoints that mutate state require a valid JWT supplied as `Authorization: Bearer <token>`.

---

## 1. Authentication (User Service)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Create a new user (Admin, Artist, or Customer) | No |
| POST | `/api/auth/login` | Authenticate and receive JWT | No |

### 1.1 Register

**Request body (`RegisterRequest`):**

\`\`\`json
{
  "username": "string (3-50 chars)",
  "password": "string (>=8 chars)",
  "email": "user@example.com",
  "firstName": "string",
  "lastName": "string",
  "role": "ADMIN | ARTIST | CUSTOMER"
}
\`\`\`

**Response `201 Created` (`UserResponse`):**

\`\`\`json
{
  "id": 1,
  "username": "artist1",
  "email": "artist1@example.com",
  "firstName": "Aria",
  "lastName": "Painter",
  "role": "ARTIST",
  "createdAt": "2025-09-28T09:17:21Z"
}
\`\`\`

Possible errors: `400 Bad Request` (validation), `409 Conflict` (duplicate username/email).

### 1.2 Login

**Request body (`LoginRequest`):**

\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**Response `200 OK` (`JwtResponse`):**

\`\`\`json
{
  "token": "jwt-token",
  "tokenType": "Bearer",
  "expiresAt": "2025-09-29T09:17:21Z",
  "user": {
    "id": 1,
    "username": "artist1",
    "role": "ARTIST"
  }
}
\`\`\`

Possible errors: `401 Unauthorized` (invalid credentials), `423 Locked` (disabled user).

---

## 2. Users (User Service)

All endpoints require `ADMIN` role unless noted.

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| GET | `/api/users` | List all users | Supports `page`, `size`, `sort` query params |
| GET | `/api/users/{id}` | Fetch user by ID | 404 if absent |
| GET | `/api/users/role/{role}` | Filter by role | Role = `ADMIN`, `ARTIST`, `CUSTOMER` |
| GET | `/api/users/me` | Current user profile | Requires any authenticated user |
| PUT | `/api/users/{id}` | Update profile | Accepts `UpdateUserRequest` |
| DELETE | `/api/users/{id}` | Delete user | Returns 204 |

**Update request example (`UpdateUserRequest`):**

\`\`\`json
{
  "email": "new@mail.com",
  "firstName": "Updated",
  "lastName": "Name",
  "enabled": true
}
\`\`\`

**Response (`UserResponse`) matches register output.**

---

## 3. Products (Product Service)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/products` | Paged product list | Optional |
| GET | `/api/products/{id}` | Product details | Optional |
| GET | `/api/products/artist/{artistId}` | Products by artist | Optional |
| GET | `/api/products/category/{categoryId}` | Products by category | Optional |
| GET | `/api/products/search?name=term` | Search by name fragment | Optional |
| POST | `/api/products` | Create new product | ARTIST or ADMIN |
| PUT | `/api/products/{id}` | Update product | Owner (ARTIST) or ADMIN |
| DELETE | `/api/products/{id}` | Delete product | Owner (ARTIST) or ADMIN |

**Create / update request (`ProductRequest`):**

\`\`\`json
{
  "title": "Watercolor Landscape",
  "description": "Hand painted 12x16 artwork",
  "price": 199.0,
  "stock": 5,
  "artistId": 7,
  "categoryId": 2,
  "imageUrl": "https://cdn.example.com/art/123.jpg"
}
\`\`\`

**Response (`ProductResponse`):**

\`\`\`json
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
  "createdAt": "2025-09-28T08:45:11Z",
  "updatedAt": "2025-09-28T08:45:11Z"
}
\`\`\`

### Categories

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/categories` | List categories | Optional |
| GET | `/api/categories/{id}` | Category details | Optional |
| POST | `/api/categories` | Create category | ADMIN |
| PUT | `/api/categories/{id}` | Update category | ADMIN |
| DELETE | `/api/categories/{id}` | Delete category | ADMIN |

**Category payload:**

\`\`\`json
{
  "name": "Oil Painting",
  "description": "Oil painting artworks"
}
\`\`\`

---

## 4. Orders (Order Service)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/orders` | List all orders | ADMIN |
| GET | `/api/orders/{id}` | Get order | Customer (owner) or ADMIN |
| GET | `/api/orders/customer/{customerId}` | Orders for a customer | Customer (self) or ADMIN |
| POST | `/api/orders` | Create order | CUSTOMER |
| PUT | `/api/orders/{id}/status` | Update status | ADMIN |
| DELETE | `/api/orders/{id}` | Cancel order | Customer (owner) or ADMIN |

**Create order request (`CreateOrderRequest`):**

\`\`\`json
{
  "customerId": 4,
  "items": [
    { "productId": 10, "quantity": 2 },
    { "productId": 15, "quantity": 1 }
  ],
  "shippingAddress": "21 Art Street, Delhi",
  "totalAmount": 350.0
}
\`\`\`

**Order response (`OrderResponse`):**

\`\`\`json
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
\`\`\`

**Status update (`UpdateOrderStatusRequest`):**

\`\`\`json
{
  "status": "PROCESSING"
}
\`\`\`

---

## 5. Payments (Payment Service)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/payments` | List all payments | ADMIN |
| GET | `/api/payments/{id}` | Payment by ID | Customer (owner) or ADMIN |
| GET | `/api/payments/customer/{customerId}` | Payments by customer | Customer (self) or ADMIN |
| GET | `/api/payments/order/{orderId}` | Payment for order | Customer (owner) or ADMIN |
| POST | `/api/payments/process` | Process payment for order | CUSTOMER |
| PUT | `/api/payments/{id}/status` | Admin override status | ADMIN |
| DELETE | `/api/payments/{id}` | Remove payment record | ADMIN |

**Process payment request (`PaymentRequest`):**

\`\`\`json
{
  "orderId": 31,
  "customerId": 4,
  "amount": 350.0,
  "method": "CREDIT_CARD"
}
\`\`\`

**Process payment response (`PaymentResponse`):**

\`\`\`json
{
  "id": 12,
  "orderId": 31,
  "customerId": 4,
  "amount": 350.0,
  "method": "CREDIT_CARD",
  "status": "SUCCESS",
  "transactionReference": "PAY-20250928-ABCD1234",
  "processedAt": "2025-09-28T10:02:10Z"
}
\`\`\`

**Status update payload (`PaymentStatusUpdateRequest`):**

\`\`\`json
{
  "status": "FAILED",
  "reason": "Card declined"
}
\`\`\`

`status` ENUM values: `PENDING`, `SUCCESS`, `FAILED`.

---

## 6. Common Error Model

All services return a consistent error payload:

\`\`\`json
{
  "timestamp": "2025-09-28T13:00:06.200+00:00",
  "path": "/api/auth/register",
  "status": 404,
  "error": "Not Found",
  "message": "Optional descriptive message",
  "requestId": "03e367af-6"
}
\`\`\`

---

## 7. Service Health

Each service exposes Spring Boot Actuator on `/actuator` (via gateway paths `/api/gateway/actuator`, `/api/users/actuator`, etc.) for health checks, metrics, and info.

---

Use these definitions to craft clients or import into tools such as Postman/Insomnia. Update JWT secrets, database credentials, and role assignments per environment.
