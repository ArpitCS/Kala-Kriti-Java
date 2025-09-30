import { AuthService } from "./auth"

// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface ApiError {
  message: string
  status: number
}

export class ApiClient {
  private static getAuthHeader(): HeadersInit {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("auth_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check if token needs refresh before making API call
    if (AuthService.isAuthenticated() && AuthService.shouldRefreshToken()) {
      await AuthService.refreshToken();
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      // Handle 401 Unauthorized - could be expired token that backend rejected
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await AuthService.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...this.getAuthHeader(),
              ...options.headers,
            }
          });
          
          if (!retryResponse.ok) throw {
            message: `API Error: ${retryResponse.statusText}`,
            status: retryResponse.status,
          };
          
          return retryResponse.status === 204 ? {} as T : await retryResponse.json();
        } else {
          // If refresh failed, logout user
          AuthService.logout();
          throw {
            message: "Session expired. Please log in again.",
            status: 401,
          };
        }
      }
      
      // Original logic for handling responses
      if (!response.ok) {
        throw {
          message: `API Error: ${response.statusText}`,
          status: response.status,
        };
      }
      
      return response.status === 204 ? {} as T : await response.json();
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}
