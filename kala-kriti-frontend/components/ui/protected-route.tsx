"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ("ADMIN" | "ARTIST" | "CUSTOMER")[]
  redirectTo?: string
}

type Role = "ADMIN" | "ARTIST" | "CUSTOMER"

const normaliseRole = (role?: string | null): Role | null => {
  if (!role) {
    return null
  }

  const cleaned = role.replace(/^ROLE_/i, "").toUpperCase()

  if (cleaned === "ADMIN" || cleaned === "ARTIST" || cleaned === "CUSTOMER") {
    return cleaned as Role
  }

  return null
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const derivedRole = normaliseRole(user?.role)
  const hasAccess = !allowedRoles || (derivedRole !== null && allowedRoles.includes(derivedRole))

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (!hasAccess) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, hasAccess, isLoading, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !hasAccess) {
    return null
  }

  return <>{children}</>
}
