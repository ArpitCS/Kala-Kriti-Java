"use client"

import { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth"
import { authEvents } from '@/lib/auth-events';
import type { UserRole } from "@/lib/types"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update authentication state from localStorage
  const updateAuthState = () => {
    setIsAuthenticated(AuthService.isAuthenticated())
    setUserRole(AuthService.getUserRole() as UserRole)
    setUserId(AuthService.getUserId())
    setUsername(AuthService.getUsername())
    setIsLoading(false)
  }
  
  useEffect(() => {
    // Initial load
    updateAuthState()
    
    // Subscribe to auth events
    const unsubscribe = authEvents.subscribe((event) => {
      if (event === 'login') {
        updateAuthState()
      } else if (event === 'logout') {
        setIsAuthenticated(false)
        setUserRole(null)
        setUserId(null)
        setUsername(null)
      }
    })
    
    return () => unsubscribe()
  }, []) // Empty dependency array = runs only on mount

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setUserRole(null)
    setUserId(null)
    setUsername(null)
  }

  // Add an interval check for token expiration
  useEffect(() => {
    const updateAuthStatus = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // If no longer authenticated, clear other states
      if (!authenticated && isAuthenticated) {
        setUserRole(null);
        setUserId(null);
        setUsername(null);
      }
    };

    // Check auth status immediately
    updateAuthStatus();
    setIsLoading(false);
    
    // Set up periodic check for token expiration
    const checkInterval = setInterval(updateAuthStatus, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [isAuthenticated]);

  useEffect(() => {
    // Log authentication state
    console.log("Auth state in hook:", { 
      isAuthenticated, 
      userId, 
      isLoading 
    })
  }, [isAuthenticated, userId, isLoading])

  return {
    isAuthenticated,
    userRole,
    userId,
    username,
    isLoading,
    logout,
    isAdmin: userRole === "ADMIN",
    isArtist: userRole === "ARTIST",
    isCustomer: userRole === "CUSTOMER",
  }
}
