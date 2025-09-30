// Authentication utilities
import { ApiClient } from "./api"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "./types"
import { authEvents } from './auth-events';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/api/auth/login", credentials)

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user_role", response.role)
      localStorage.setItem("user_id", response.userId.toString())
      localStorage.setItem("username", response.username)
      authEvents.emit('login', { username: response.username });
    }

    return response
  }

  static async register(data: RegisterRequest): Promise<User> {
    return ApiClient.post<User>("/api/auth/register", data)
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_id")
      localStorage.removeItem("username")
      authEvents.emit('logout');
    }
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      console.error("Token validation error:", e);
      return false;
    }
  }

  static getUserRole(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_role");
  }

  static getUserId(): number | null {
    if (typeof window === "undefined") return null;
    const id = localStorage.getItem("user_id");
    return id ? parseInt(id, 10) : null;
  }

  static getUsername(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("username");
  }

  static isAdmin(): boolean {
    return this.getUserRole() === "ADMIN"
  }

  static isArtist(): boolean {
    return this.getUserRole() === "ARTIST"
  }

  static isCustomer(): boolean {
    return this.getUserRole() === "CUSTOMER"
  }

  // Add a refresh token method
  static async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const response = await ApiClient.post<AuthResponse>("/api/auth/refresh", {
        token: token
      });
      
      localStorage.setItem("auth_token", response.token);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Add token expiration check with auto-refresh
  static getTokenExpiryTime(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (e) {
      return null;
    }
  }

  static shouldRefreshToken(): boolean {
    const expiry = this.getTokenExpiryTime();
    if (!expiry) return false;
    
    // Refresh if token will expire in less than 5 minutes
    return expiry - Date.now() < 5 * 60 * 1000;
  }
}
