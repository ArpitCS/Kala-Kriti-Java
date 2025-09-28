"use client"

import { useAuth } from "@/lib/auth"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Shield } from "lucide-react"

export default function TestAuthPage() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Test
              </CardTitle>
              <CardDescription>
                This page shows the current authentication state and allows you to test the auth flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Logged in as:</span>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="font-medium">{user.firstName || "N/A"} {user.lastName || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Username:</span>
                      <span className="font-medium">@{user.username || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">User ID:</span>
                      <span className="font-medium">{user.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Debug Info</h4>
                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <div>Auth Token: {typeof window !== "undefined" ? localStorage.getItem("auth_token")?.substring(0, 50) + "..." : "N/A"}</div>
                      <div>User Data: {typeof window !== "undefined" ? localStorage.getItem("user_data") : "N/A"}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                    <Button asChild>
                      <a href="/profile">View Profile</a>
                    </Button>
                  </div>

                  {user.role === "ADMIN" && (
                    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Admin Access</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        You have admin privileges. You can access the admin dashboard.
                      </p>
                      <Button asChild size="sm">
                        <a href="/admin/dashboard">Go to Admin Dashboard</a>
                      </Button>
                    </div>
                  )}

                  {user.role === "ARTIST" && (
                    <div className="mt-4 p-4 border border-green-200 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Artist Access</h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        You have artist privileges. You can manage your products and view your dashboard.
                      </p>
                      <Button asChild size="sm">
                        <a href="/artist/dashboard">Go to Artist Dashboard</a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Not logged in</h3>
                    <p className="text-muted-foreground">You need to log in to access this page.</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild>
                      <a href="/login">Login</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/register">Register</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
