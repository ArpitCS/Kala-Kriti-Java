"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { ApiClient } from "@/lib/api"
import type { User, Order } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { isAuthenticated, userId, isLoading: isAuthLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    specialization: "",
    portfolioUrl: "",
  })

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!isAuthenticated) {
      const target = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/"
      router.push(`/auth/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    loadUserData()
  }, [isAuthenticated, userId, isAuthLoading])

  const loadUserData = async () => {
    if (!userId) return

    setIsDataLoading(true)
    try {
      const [userData, ordersData] = await Promise.all([
        ApiClient.get<User>(`/api/users/${userId}`),
        ApiClient.get<Order[]>(`/api/orders/customer/${userId}`),
      ])

      setUser(userData)
      setOrders(ordersData)
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || "",
        bio: userData.bio || "",
        specialization: userData.specialization || "",
        portfolioUrl: userData.portfolioUrl || "",
      })
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsSaving(true)

    try {
      await ApiClient.put(`/api/users/${userId}`, formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      loadUserData()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "SHIPPED":
        return "bg-blue-100 text-blue-800"
      case "CONFIRMED":
        return "bg-purple-100 text-purple-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Account</h1>
        <p className="text-gray-600">Update your personal information and track your recent orders.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Personal information</h2>
                <p className="text-gray-600">Keep your contact details up to date.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="text-gray-600">{user.username}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Member since</Label>
                    <div className="text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>

                {user.role === "ARTIST" && (
                  <>
                    <Separator />

                    <div className="space-y-6">
                      <h3 className="font-semibold">Artist Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                        <Input
                          id="portfolioUrl"
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start shopping to see your orders here.</p>
                    <Button onClick={() => router.push("/artworks")}>Browse Artworks</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="text-2xl font-bold">₹{order.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="text-sm">
                      <div className="font-medium mb-1">Shipping Address</div>
                      <div className="text-gray-600">{order.shippingAddress}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
