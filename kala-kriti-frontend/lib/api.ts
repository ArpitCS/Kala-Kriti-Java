const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: "ADMIN" | "ARTIST" | "CUSTOMER"
  createdAt: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  stock: number
  artistId: number
  artistName: string
  category: {
    id: number
    name: string
  }
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Order {
  id: number
  customerId: number
  status: string
  totalAmount: number
  shippingAddress: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  productId: number
  quantity: number
  price: number
}

export interface Payment {
  id: number
  orderId: number
  customerId: number
  amount: number
  method: string
  status: "PENDING" | "SUCCESS" | "FAILED"
  transactionReference: string
  processedAt: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_token_expiry")
      localStorage.removeItem("user_data")
    }
  }

  private buildHeaders(initHeaders?: HeadersInit, body?: BodyInit): Headers {
    const headers = new Headers(initHeaders)

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData

    if (!headers.has("Content-Type") && !isFormData) {
      headers.set("Content-Type", "application/json")
    }

    if (this.token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${this.token}`)
    }

    return headers
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T | undefined

    try {
      const text = await response.text()
      if (text) {
        data = JSON.parse(text) as T
      }
    } catch (error) {
      // Ignore JSON parse errors for empty bodies
    }

    return {
      data,
      status: response.status,
      error: !response.ok ? ((data as unknown as { message?: string })?.message || response.statusText) : undefined,
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const body = options.body
    const headers = this.buildHeaders(options.headers, body || undefined)

    const requestInit: RequestInit = {
      ...options,
      headers,
      body,
    }

    try {
      const response = await fetch(url, requestInit)
      if (response.status === 401) {
        // Automatically clear token on unauthorized responses
        this.clearToken()
      }
      return this.parseResponse<T>(response)
    } catch (error) {
      return {
        status: 0,
        error: "Network error occurred",
      }
    }
  }

  private normaliseListResponse<T>(response: ApiResponse<T[] | { content?: T[] } | undefined>): ApiResponse<T[]> {
    if (!response.data) {
      return { ...response, data: [] }
    }

    if (Array.isArray(response.data)) {
      return { ...response, data: response.data }
    }

    if (typeof response.data === "object" && "content" in response.data) {
      const content = (response.data as { content?: T[] }).content || []
      return { ...response, data: content }
    }

    return { ...response, data: [] }
  }

  async get<T>(endpoint: string, init?: RequestInit) {
    return this.request<T>(endpoint, { ...init, method: "GET" })
  }

  async post<T>(endpoint: string, body?: unknown, init?: RequestInit) {
    const options: RequestInit = { ...init, method: "POST" }
    if (body !== undefined) {
      options.body = body instanceof FormData ? body : JSON.stringify(body)
    }
    return this.request<T>(endpoint, options)
  }

  async put<T>(endpoint: string, body?: unknown, init?: RequestInit) {
    const options: RequestInit = { ...init, method: "PUT" }
    if (body !== undefined) {
      options.body = body instanceof FormData ? body : JSON.stringify(body)
    }
    return this.request<T>(endpoint, options)
  }

  async patch<T>(endpoint: string, body?: unknown, init?: RequestInit) {
    const options: RequestInit = { ...init, method: "PATCH" }
    if (body !== undefined) {
      options.body = body instanceof FormData ? body : JSON.stringify(body)
    }
    return this.request<T>(endpoint, options)
  }

  async delete<T>(endpoint: string, init?: RequestInit) {
    return this.request<T>(endpoint, { ...init, method: "DELETE" })
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.post<{
      token: string
      tokenType: string
      expiresAt: string
      user: User
    }>("/api/auth/login", { username, password })
  }

  async register(userData: {
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    role: "ADMIN" | "ARTIST" | "CUSTOMER"
  }) {
    return this.post<User>("/api/auth/register", userData)
  }

  async getCurrentUser() {
    return this.get<User>("/api/users/me")
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number
    size?: number
    category?: number
    sort?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.size) searchParams.set("size", params.size.toString())
    if (params?.category) searchParams.set("category", params.category.toString())
    if (params?.sort) searchParams.set("sort", params.sort)

    const query = searchParams.toString()
    const response = await this.get<Product[] | { content?: Product[] }>(
      `/api/products${query ? `?${query}` : ""}`,
    )
    return this.normaliseListResponse<Product>(response)
  }

  async getProduct(id: number) {
    return this.get<Product>(`/api/products/${id}`)
  }

  async searchProducts(name: string) {
    const response = await this.get<Product[] | { content?: Product[] }>(
      `/api/products/search?name=${encodeURIComponent(name)}`,
    )
    return this.normaliseListResponse<Product>(response)
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.get<Category[] | { content?: Category[] }>("/api/categories")
    return this.normaliseListResponse<Category>(response)
  }

  // Users endpoints
  async getUsers(params?: { page?: number; size?: number; sort?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.set("page", params.page.toString())
    if (params?.size !== undefined) searchParams.set("size", params.size.toString())
    if (params?.sort) searchParams.set("sort", params.sort)

    const query = searchParams.toString()
    const response = await this.get<User[] | { content?: User[] }>(`/api/users${query ? `?${query}` : ""}`)
    return this.normaliseListResponse<User>(response)
  }

  async getUserById(id: number) {
    return this.get<User>(`/api/users/${id}`)
  }

  async getUsersByRole(role: User["role"]) {
    const response = await this.get<User[] | { content?: User[] }>(`/api/users/role/${role}`)
    return this.normaliseListResponse<User>(response)
  }

  async updateUser(id: number, payload: Partial<Omit<User, "id" | "createdAt" | "role" | "username">> & {
    email?: string
    firstName?: string
    lastName?: string
    enabled?: boolean
  }) {
    return this.put<User>(`/api/users/${id}`, payload)
  }

  async deleteUser(id: number) {
    return this.delete<undefined>(`/api/users/${id}`)
  }

  // Orders endpoints
  async createOrder(orderData: {
    customerId: number
    items: { productId: number; quantity: number }[]
    shippingAddress: string
    totalAmount: number
  }) {
    return this.post<Order>("/api/orders", orderData)
  }

  async getCustomerOrders(customerId: number) {
    const response = await this.get<Order[] | { content?: Order[] }>(`/api/orders/customer/${customerId}`)
    return this.normaliseListResponse<Order>(response)
  }

  async getOrder(id: number) {
    return this.get<Order>(`/api/orders/${id}`)
  }

  async getOrders(params?: { page?: number; size?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.set("page", params.page.toString())
    if (params?.size !== undefined) searchParams.set("size", params.size.toString())
    const query = searchParams.toString()
    const response = await this.get<Order[] | { content?: Order[] }>(`/api/orders${query ? `?${query}` : ""}`)
    return this.normaliseListResponse<Order>(response)
  }

  async updateOrderStatus(id: number, status: string) {
    return this.put<Order>(`/api/orders/${id}/status`, { status })
  }

  async cancelOrder(id: number) {
    return this.delete<undefined>(`/api/orders/${id}`)
  }

  async processPayment(paymentData: {
    orderId: number
    customerId: number
    amount: number
    method: "CREDIT_CARD"
  }) {
    return this.post<Payment>("/api/payments/process", paymentData)
  }

  async getPaymentsForOrder(orderId: number) {
    const response = await this.get<Payment[] | { content?: Payment[] }>(`/api/payments/order/${orderId}`)
    return this.normaliseListResponse<Payment>(response)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

export const api = apiClient
