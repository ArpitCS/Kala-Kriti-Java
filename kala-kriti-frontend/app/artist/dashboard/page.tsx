"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { api, type Product, type Order } from "@/lib/api"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, TrendingUp, DollarSign, Eye } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalViews: number
}


export default function ArtistDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return

        // Fetch artist's products
        const productsRes = await api.getProducts({ page: 0, size: 100 })
        const products = productsRes.data?.filter(p => p.artistId === user.id) || []
        setProducts(products)

        // Calculate stats from products
        const totalProducts = products.length
        const totalSales = products.reduce((sum, p) => sum + (p.stock || 0), 0) // Mock sales data
        const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0) // Mock revenue
        const totalViews = products.reduce((sum, p) => sum + Math.floor(Math.random() * 100), 0) // Mock views

        setStats({
          totalProducts,
          totalSales,
          totalRevenue,
          totalViews
        })

        // Fetch orders (mock data for now)
        setOrders([])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["ARTIST"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Artist Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.firstName || user?.username}</p>
            </div>
            <Link href="/artist/products/new">
              <Button className="mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSales}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage your artwork listings and inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
                        <p className="text-muted-foreground mb-4">Start by adding your first artwork</p>
                        <Link href="/artist/products/new">
                          <Button>Add Product</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-square relative bg-muted">
                              <img
                                src={
                                  product.imageUrl ||
                                  `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(product.title)}`
                                }
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{product.title}</h3>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-foreground">${product.price}</span>
                                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                <span>{Math.floor(Math.random() * 100)} views</span>
                                <span>0 sold</span>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/artist/products/${product.id}/edit`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    Edit
                                  </Button>
                                </Link>
                                <Link href={`/products/${product.id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Track your recent sales and order status</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">Orders will appear here once customers start purchasing</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-medium text-foreground">Order #{order.id}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {order.customerName} • {order.productName}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium text-foreground">${order.total}</p>
                              <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                            </div>
                            <Badge
                              variant={
                                order.status === "COMPLETED"
                                  ? "default"
                                  : order.status === "PROCESSING"
                                    ? "secondary"
                                    : order.status === "SHIPPED"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
