"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, DollarSign, ShoppingBag, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { ApiClient } from "@/lib/api"
import type { Product, Order } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, userId, isArtist, isAdmin, isLoading: isAuthLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!isAuthenticated) {
      const target = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/"
      router.push(`/auth/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    if (!isArtist && !isAdmin) {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [isAuthenticated, userId, isArtist, isAdmin, isAuthLoading])

  const loadDashboardData = async () => {
    if (!userId) return

    setIsDataLoading(true)
    try {
      if (isArtist) {
        const productsData = await ApiClient.get<Product[]>(`/api/products/artist/${userId}`)
        setProducts(productsData)
      } else if (isAdmin) {
        const [productsData, ordersData] = await Promise.all([
          ApiClient.get<Product[]>("/api/products"),
          ApiClient.get<Order[]>("/api/orders"),
        ])
        setProducts(productsData)
        setOrders(ordersData)
      }
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDataLoading(false)
    }
  }

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading dashboard...</div>
      </div>
    )
  }

  const totalRevenue = products.reduce((sum, product) => sum + product.price * (1 - product.stockQuantity), 0)
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length
  const soldProducts = products.filter((p) => p.stockQuantity === 0).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{isAdmin ? "Admin Dashboard" : "Artist Dashboard"}</h1>
          <p className="text-gray-600">Manage your artworks and track your performance.</p>
        </div>
        {isArtist && (
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sold Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{soldProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/products")}
        >
          <CardContent className="p-6">
            <Package className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600">View and edit your artwork listings</p>
          </CardContent>
        </Card>

        {isArtist && (
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/products/new")}
          >
            <CardContent className="p-6">
              <Plus className="h-8 w-8 mb-4" />
              <h3 className="font-semibold mb-2">Add New Product</h3>
              <p className="text-sm text-gray-600">List a new artwork for sale</p>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <>
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/users")}
            >
              <CardContent className="p-6">
                <Package className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/orders")}
            >
              <CardContent className="p-6">
                <ShoppingBag className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and process all orders</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
