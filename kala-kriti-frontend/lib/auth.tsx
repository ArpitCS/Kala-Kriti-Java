"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient, type User } from "./api"

type Role = "ADMIN" | "ARTIST" | "CUSTOMER"

type RawUser = Partial<User> & { role?: string | null }

const ROLE_FALLBACK: Role = "CUSTOMER"

const normaliseRole = (role?: string | null): Role => {
  if (!role) {
    return ROLE_FALLBACK
  }

  const cleaned = role.replace(/^ROLE_/i, "").toUpperCase()

  if (cleaned === "ADMIN" || cleaned === "ARTIST" || cleaned === "CUSTOMER") {
    return cleaned as Role
  }

  return ROLE_FALLBACK
}

// JWT parsing utility
const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

const composeUser = (raw: RawUser, fallback?: User | null): User => {
  const source = fallback ?? null

  return {
    id: raw.id ?? source?.id ?? 0,
    username: raw.username ?? source?.username ?? "",
    email: raw.email ?? source?.email ?? "",
    firstName: raw.firstName ?? source?.firstName ?? "",
    lastName: raw.lastName ?? source?.lastName ?? "",
    createdAt: raw.createdAt ?? source?.createdAt ?? new Date().toISOString(),
    role: normaliseRole(raw.role ?? source?.role),
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (userData: {
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    role: "ADMIN" | "ARTIST" | "CUSTOMER"
  }) => Promise<boolean>
  logout: () => void
  updateUser: (nextUser: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applyUser = (raw: RawUser, fallbackUser?: User | null) => {
    const nextUser = composeUser(raw, fallbackUser ?? user)
    setUser(nextUser)

    if (typeof window !== "undefined") {
      localStorage.setItem("user_data", JSON.stringify(nextUser))
    }

    return nextUser
  }

  useEffect(() => {
    const initialiseAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("auth_token")
      const expiry = localStorage.getItem("auth_token_expiry")
      const userData = localStorage.getItem("user_data")

      if (!token) {
        setIsLoading(false)
        return
      }

      // Check if token is expired
      if (expiry && new Date(expiry).getTime() <= Date.now()) {
        apiClient.clearToken()
        setUser(null)
        setIsLoading(false)
        return
      }

      apiClient.setToken(token)

      // Parse JWT token to extract user data
      const jwtPayload = parseJWT(token)
      let jwtUser: User | null = null

      if (jwtPayload) {
        // Extract user data from JWT
        jwtUser = {
          id: jwtPayload.userId || 0,
          username: jwtPayload.sub || "",
          email: jwtPayload.email || "",
          firstName: jwtPayload.firstName || "",
          lastName: jwtPayload.lastName || "",
          role: normaliseRole(jwtPayload.role),
          createdAt: new Date(jwtPayload.iat * 1000).toISOString()
        }
        
        // Set user from JWT data
        setUser(jwtUser)
        localStorage.setItem("user_data", JSON.stringify(jwtUser))
      }

      // Try to get full user profile from API
      try {
        const response = await apiClient.getCurrentUser()

        if (response.data) {
          applyUser(response.data, jwtUser)
        } else if (response.status === 401 || response.status === 403) {
          // If API call fails but we have JWT data, keep using JWT data
          if (!jwtUser) {
            apiClient.clearToken()
            setUser(null)
          }
        }
      } catch (error) {
        // If API call fails but we have JWT data, keep using JWT data
        if (!jwtUser) {
          apiClient.clearToken()
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void initialiseAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(username, password)

      if (response.data) {
        const { token, user: userPayload, expiresAt } = response.data
        apiClient.setToken(token)
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token)
          if (expiresAt) {
            localStorage.setItem("auth_token_expiry", expiresAt)
          } else {
            localStorage.removeItem("auth_token_expiry")
          }
        }

        // Parse JWT token to get user data
        const jwtPayload = parseJWT(token)
        let jwtUser: User | null = null

        if (jwtPayload) {
          jwtUser = {
            id: jwtPayload.userId || 0,
            username: jwtPayload.sub || "",
            email: jwtPayload.email || "",
            firstName: jwtPayload.firstName || "",
            lastName: jwtPayload.lastName || "",
            role: normaliseRole(jwtPayload.role),
            createdAt: new Date(jwtPayload.iat * 1000).toISOString()
          }
        }

        // Use JWT data if available, otherwise use API response
        const userData = jwtUser || userPayload as RawUser
        applyUser(userData)

        // Try to get full user profile, but don't fail if it doesn't work
        try {
          const profileResponse = await apiClient.getCurrentUser()
          if (profileResponse.data) {
            applyUser(profileResponse.data, userData)
          }
        } catch (profileError) {
          // If profile fetch fails, still consider login successful with the data we have
          console.warn("Failed to fetch full profile, using JWT/API data:", profileError)
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: {
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    role: "ADMIN" | "ARTIST" | "CUSTOMER"
  }): Promise<boolean> => {
    try {
      const response = await apiClient.register(userData)

      if (response.data) {
        // Auto-login after successful registration
        return await login(userData.username, userData.password)
      }

      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_token_expiry")
      localStorage.removeItem("user_data")
    }
  }

  const updateUser = (nextUser: User) => {
    applyUser(nextUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
