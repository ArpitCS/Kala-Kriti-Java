"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalArtists: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  newUsersThisMonth: number
}

interface RecentActivity {
  id: number
  type: "USER_REGISTRATION" | "ORDER_PLACED" | "PRODUCT_ADDED" | "PAYMENT_COMPLETED"
  description: string
  timestamp: string
  user: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from actual API endpoints
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.getUsers({ page: 0, size: 1000 }),
          api.getProducts({ page: 0, size: 1000 }),
          api.getOrders({ page: 0, size: 1000 })
        ])

        // Calculate stats from the actual data
        const users = usersRes.data || []
        const products = productsRes.data || []
        const orders = ordersRes.data || []

        const totalUsers = users.length
        const totalArtists = users.filter(u => u.role === 'ARTIST').length
        const totalProducts = products.length
        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
        const pendingOrders = orders.filter(o => o.status === 'PLACED' || o.status === 'PROCESSING').length
        const lowStockProducts = products.filter(p => p.stock < 5).length
        const newUsersThisMonth = users.filter(u => {
          const createdAt = new Date(u.createdAt)
          const now = new Date()
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          return createdAt >= thisMonth
        }).length

        setStats({
          totalUsers,
          totalArtists,
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders,
          lowStockProducts,
          newUsersThisMonth
        })

        // Create mock activities from recent data
        const recentActivities: RecentActivity[] = []
        
        // Add recent user registrations
        users.slice(0, 3).forEach(user => {
          recentActivities.push({
            id: user.id,
            type: "USER_REGISTRATION",
            description: `New ${user.role.toLowerCase()} registered: ${user.firstName} ${user.lastName}`,
            timestamp: user.createdAt,
            user: user.username
          })
        })

        // Add recent orders
        orders.slice(0, 3).forEach(order => {
          recentActivities.push({
            id: order.id + 1000,
            type: "ORDER_PLACED",
            description: `New order placed for $${order.totalAmount}`,
            timestamp: order.createdAt,
            user: `Customer #${order.customerId}`
          })
        })

        // Sort by timestamp and take most recent
        recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setActivities(recentActivities.slice(0, 10))

      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "USER_REGISTRATION":
        return <Users className="w-4 h-4" />
      case "ORDER_PLACED":
        return <ShoppingCart className="w-4 h-4" />
      case "PRODUCT_ADDED":
        return <Package className="w-4 h-4" />
      case "PAYMENT_COMPLETED":
        return <DollarSign className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "USER_REGISTRATION":
        return "text-blue-600"
      case "ORDER_PLACED":
        return "text-green-600"
      case "PRODUCT_ADDED":
        return "text-purple-600"
      case "PAYMENT_COMPLETED":
        return "text-emerald-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.firstName || user?.username}</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+{stats.newUsersThisMonth} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArtists}</div>
                  <p className="text-xs text-muted-foreground">Active creators</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">{stats.lowStockProducts} low stock</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{stats.totalOrders} orders</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href="/admin/users">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href="/admin/products">
                      <Package className="w-4 h-4 mr-2" />
                      Manage Products
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href="/admin/orders">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Manage Orders
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href="/admin/analytics">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Alerts */}
              {stats && (stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.pendingOrders > 0 && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Pending Orders</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            {stats.pendingOrders} orders need attention
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          {stats.pendingOrders}
                        </Badge>
                      </div>
                    )}
                    {stats.lowStockProducts > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">Low Stock Products</p>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {stats.lowStockProducts} products running low
                          </p>
                        </div>
                        <Badge variant="destructive">{stats.lowStockProducts}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No recent activity</h3>
                      <p className="text-muted-foreground">
                        Activity will appear here as users interact with the platform
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                          <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">by {activity.user}</p>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
