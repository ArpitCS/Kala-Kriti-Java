import { AuthService } from "./auth"

// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface ApiError {
  message: string
  status: number
}

const getAuthHeader = (): HeadersInit => {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Add this utility function to break circular references in orders data
const breakCircularReferences = (text: string): string => {
  // This regex finds circular references in order items and replaces them
  return text.replace(/"order"\s*:\s*\{[^}]*"items"\s*:\s*\[[^\]]*\][^}]*\}/g, '"order":null');
};

export const ApiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check if token needs refresh before making API call
    if (AuthService.isAuthenticated() && AuthService.shouldRefreshToken()) {
      await AuthService.refreshToken();
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
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
              ...getAuthHeader(),
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
  },

  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Get the response text
      const text = await response.text();
      
      // Special handling for orders endpoint
      if (url.includes('/orders')) {
        try {
          // Break circular references before parsing
          const cleanText = breakCircularReferences(text);
          return JSON.parse(cleanText);
        } catch (parseError) {
          console.error("Failed to parse orders data:", parseError);
          // Return empty array as fallback for orders
          return (url.includes('/orders/customer')) ? [] as unknown as T : {} as T;
        }
      }
      
      // Normal JSON parsing for other endpoints
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Failed to parse API response");
      }
    } catch (error) {
      console.error(`API GET error for ${url}:`, error);
      throw error;
    }
  },
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const fixCircularReferences = (responseText: string): any => {
  try {
    // Handle potential JSON parse errors more safely
    let parsed;
    try {
      // First attempt direct parsing
      parsed = JSON.parse(responseText);
    } catch (initialError) {
      console.log("Initial parse failed, trying to clean JSON");
      
      // Try to clean the JSON by removing circular references
      const cleanedText = responseText
        .replace(/"order":\s*\{[^}]*"items":\s*\[\s*{/g, '"order":null')
        .replace(/"items"\s*:\s*null/g, '"items":[]');
      
      parsed = JSON.parse(cleanedText);
    }
    
    // Ensure orders have valid items arrays
    if (Array.isArray(parsed)) {
      // This is an array of orders - deduplicate by ID and normalize
      const uniqueOrders = [];
      const orderIds = new Set();
      
      for (const order of parsed) {
        if (!orderIds.has(order.id)) {
          orderIds.add(order.id);
          uniqueOrders.push({
            ...order,
            items: Array.isArray(order.items) ? order.items : []
          });
        }
      }
      
      return uniqueOrders;
    } 
    
    // Single order case
    if (parsed && typeof parsed === 'object') {
      return {
        ...parsed,
        items: Array.isArray(parsed.items) ? parsed.items : []
      };
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to process API response:", error);
    return []; // Return empty array as fallback
  }
}
