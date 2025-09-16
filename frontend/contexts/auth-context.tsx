"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  username: string
  email: string
  userType: "CUSTOMER" | "ARTIST" | "ADMIN"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string, userType: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("kala-kriti-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fetch user by email to obtain username required by backend login
      const userRes = await fetch(`http://localhost:8080/api/users/email/${encodeURIComponent(email)}`)
      if (!userRes.ok) return false
      const userObj: User = await userRes.json()

      const loginRes = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userObj.username, password }),
      })

      if (!loginRes.ok) return false

      // Backend returns a string; we set the actual user from users endpoint
      setUser(userObj)
      localStorage.setItem("kala-kriti-user", JSON.stringify(userObj))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string, userType: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, userType }),
      })

      if (!res.ok) return false

      // After successful registration (backend returns a string), fetch user by email
      const userRes = await fetch(`http://localhost:8080/api/users/email/${encodeURIComponent(email)}`)
      if (!userRes.ok) return false
      const userObj: User = await userRes.json()
      setUser(userObj)
      localStorage.setItem("kala-kriti-user", JSON.stringify(userObj))
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Best-effort backend logout if endpoint exists (ignore errors)
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // include credentials if backend uses session cookies
        credentials: "include",
      }).catch(() => {})
    } catch (err) {
      console.warn("Backend logout failed (ignored):", err)
    } finally {
      setUser(null)
      localStorage.removeItem("kala-kriti-user")
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
