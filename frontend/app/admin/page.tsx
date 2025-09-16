"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Palette, ShoppingBag, DollarSign, TrendingUp, Package, AlertCircle, Activity } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalArtists: number
  totalArtworks: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalArtists: 0,
    totalArtworks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      // Fetch all orders for admin
      const ordersResponse = await fetch("http://localhost:8080/api/admin/orders")
      let orders = []
      if (ordersResponse.ok) {
        orders = await ordersResponse.json()
      }

      // Fetch all artworks
      const artworksResponse = await fetch("http://localhost:8080/api/artworks")
      let artworks = []
      if (artworksResponse.ok) {
        artworks = await artworksResponse.json()
      }

      // Calculate stats from available data
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
      const pendingOrders = orders.filter((order: any) => order.status === "PENDING").length

      setStats({
        totalUsers: 150, // Mock data - would need separate endpoint
        totalArtists: 45, // Mock data - would need separate endpoint
        totalArtworks: artworks.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        recentOrders: orders.slice(0, 5),
      })
    } catch (error) {
      console.error("Error loading admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage the Kala-Kriti platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Artists</p>
                      <p className="text-2xl font-bold">{stats.totalArtists}</p>
                    </div>
                    <Palette className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Artworks</p>
                      <p className="text-2xl font-bold">{stats.totalArtworks}</p>
                    </div>
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                      <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                      <p className="text-2xl font-bold">
                        ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Manage Orders</h3>
                    <p className="text-sm text-muted-foreground mb-4">View and update order statuses</p>
                    <Button asChild className="w-full">
                      <Link href="/admin/orders">View Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">User Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage users and artist accounts</p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Platform Analytics</h3>
                    <p className="text-sm text-muted-foreground mb-4">View detailed platform statistics</p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/admin/analytics">View Analytics</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" asChild>
                    <Link href="/admin/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent orders</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
