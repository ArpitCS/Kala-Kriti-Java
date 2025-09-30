// Type definitions for API responses

export type UserRole = "ADMIN" | "ARTIST" | "CUSTOMER"
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"
export type ProductStatus = "ACTIVE" | "INACTIVE" | "SOLD"
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "NET_BANKING" | "WALLET"

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: UserRole
  status: UserStatus
  bio?: string
  specialization?: string
  portfolioUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
  role: UserRole
  username: string
  userId: number
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: UserRole
  bio?: string
  specialization?: string
  portfolioUrl?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  artistId: number
  categoryId: number
  stockQuantity: number
  status: ProductStatus
  dimensions?: string
  medium?: string
  yearCreated?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface OrderItem {
  id?: number
  productId: number
  quantity: number
  price: number
  productName?: string
  artistId?: number
}

export interface Order {
  id: number
  customerId: number
  totalAmount: number
  status: OrderStatus
  shippingAddress: string
  billingAddress: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  customerId: number
  totalAmount: number
  shippingAddress: string
  billingAddress: string
  items: OrderItem[]
}

export interface Payment {
  id: number
  orderId: number
  customerId: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  transactionId?: string
  gatewayResponse?: string
  createdAt: string
  updatedAt: string
}

export interface ProcessPaymentRequest {
  orderId: number
  customerId: number
  amount: number
  method: PaymentMethod
  transactionId?: string
  gatewayResponse?: string
}

export interface CartItem {
  product: Product
  quantity: number
}
