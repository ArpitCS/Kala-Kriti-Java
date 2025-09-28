"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { useAuth } from "@/lib/auth"
import { apiClient, type Order, type Product } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Loader2, Package, ShoppingBag } from "lucide-react"

interface ProfileFormState {
  firstName: string
  lastName: string
  email: string
}

type ProductCache = Record<number, Product>

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "DELIVERED":
    case "COMPLETED":
      return "default"
    case "PROCESSING":
    case "PLACED":
      return "secondary"
    case "SHIPPED":
      return "outline"
    case "CANCELLED":
    case "FAILED":
      return "destructive"
    default:
      return "outline"
  }
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [profileError, setProfileError] = useState<string | null>(null)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [productsById, setProductsById] = useState<ProductCache>({})
  const productsCacheRef = useRef<ProductCache>({})

  useEffect(() => {
    productsCacheRef.current = productsById
  }, [productsById])

  useEffect(() => {
    const initialiseProfile = async () => {
      setIsLoadingProfile(true)
      setProfileError(null)

      const response = await apiClient.getCurrentUser()
      if (response.data) {
        const currentUser = response.data
        // Don't call updateUser here to avoid flickering - just set the form state
        setFormState({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
        })
      } else if (response.error) {
        setProfileError(response.error)
      }

      setIsLoadingProfile(false)
    }

    void initialiseProfile()
  }, []) // Remove updateUser dependency to prevent re-renders

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([])
        setIsLoadingOrders(false)
        return
      }

      setIsLoadingOrders(true)
      setOrdersError(null)

      const response = await apiClient.getCustomerOrders(user.id)
      if (response.data) {
        setOrders(response.data)

        const uniqueProductIds = new Set<number>()
        response.data.forEach((order) => {
          order.items.forEach((item) => uniqueProductIds.add(item.productId))
        })

        const missingProductIds = Array.from(uniqueProductIds).filter((id) => !productsCacheRef.current[id])

        if (missingProductIds.length > 0) {
          const fetchPromises = missingProductIds.map(async (productId) => {
            const productResponse = await apiClient.getProduct(productId)
            if (productResponse.data) {
              return { productId, product: productResponse.data }
            }
            return null
          })

          const fetchedProducts = await Promise.all(fetchPromises)
          const freshProducts: ProductCache = {}
          fetchedProducts.forEach((entry) => {
            if (entry) {
              freshProducts[entry.productId] = entry.product
            }
          })

          if (Object.keys(freshProducts).length > 0) {
            setProductsById((prev) => ({ ...prev, ...freshProducts }))
          }
        }
      } else if (response.error) {
        setOrdersError(response.error)
      }

      setIsLoadingOrders(false)
    }

    void loadOrders()
  }, [user?.id])

  const orderSummaries = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: productsById[item.productId],
      })),
    }))
  }, [orders, productsById])

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    setIsSavingProfile(true)
    setSaveError(null)

    const response = await apiClient.updateUser(user.id, {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
    })

    if (response.data) {
      updateUser(response.data)
      setFormState({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
      })
    } else if (response.error) {
      setSaveError(response.error)
    } else {
      setSaveError("Unable to save changes right now. Please try again.")
    }

    setIsSavingProfile(false)
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "ARTIST", "ADMIN"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-display font-bold">My Account</h1>
            <p className="text-muted-foreground">Update your personal information and track your recent orders.</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Personal information</CardTitle>
                  <CardDescription>Keep your contact details up to date.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileError && (
                    <Alert variant="destructive">
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}

                  {isLoadingProfile ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            value={formState.firstName}
                            onChange={(event) => handleInputChange("firstName", event.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            value={formState.lastName}
                            onChange={(event) => handleInputChange("lastName", event.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={(event) => handleInputChange("email", event.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground bg-muted/40 p-4 rounded-md">
                        <div>
                          <p className="font-medium text-foreground">Username</p>
                          <p>{user?.username}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Role</p>
                          <Badge variant="outline" className="mt-1">
                            {user?.role}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Member since</p>
                          <p>{user?.createdAt ? formatDate(user.createdAt) : "—"}</p>
                        </div>
                      </div>

                      {saveError && (
                        <Alert variant="destructive">
                          <AlertDescription>{saveError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSavingProfile}>
                          {isSavingProfile ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                            </>
                          ) : (
                            "Save changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Order history</CardTitle>
                  <CardDescription>Your most recent purchases appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{ordersError}</AlertDescription>
                    </Alert>
                  )}

                  {isLoadingOrders ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="space-y-3">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : orderSummaries.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">No orders yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Discover new artworks and start building your collection today.
                        </p>
                      </div>
                      <Button asChild>
                        <Link href="/products">
                          Browse artworks
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[420px] pr-4">
                      <div className="space-y-4">
                        {orderSummaries.map((order) => (
                          <div key={order.id} className="rounded-lg border  border-border p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                              </div>
                              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                            </div>

                            <div className="space-y-3">
                              {order.items.map((item) => {
                                const product = item.product
                                return (
                                  <div key={item.productId} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {product?.title || `Artwork #${item.productId}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                  </div>
                                )
                              })}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
                              <div className="text-muted-foreground">
                                Last updated {formatDate(order.updatedAt)}
                              </div>
                              <div className="font-semibold">Total {formatCurrency(order.totalAmount)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
