"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [processingItems, setProcessingItems] = useState<Set<number>>(new Set())
  const [placingOrder, setPlacingOrder] = useState(false)

  const totalAmount = cartItems.reduce((total, item) => total + item.artwork.price * item.quantity, 0)

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setProcessingItems((prev) => new Set(prev).add(cartItemId))
    const success = await updateQuantity(cartItemId, newQuantity)

    if (!success) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }

    setProcessingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(cartItemId)
      return newSet
    })
  }

  const handleRemoveItem = async (cartItemId: number) => {
    setProcessingItems((prev) => new Set(prev).add(cartItemId))
    const success = await removeFromCart(cartItemId)

    if (success) {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }

    setProcessingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(cartItemId)
      return newSet
    })
  }

  const handleClearCart = async () => {
    const success = await clearCart()
    if (success) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in first", variant: "destructive" })
      return
    }
    if (cartItems.length === 0) {
      toast({ title: "Cart empty", description: "Add items before checkout", variant: "destructive" })
      return
    }

    setPlacingOrder(true)
    const totalAmount = cartItems.reduce(
      (sum, ci) => sum + ci.artwork.price * ci.quantity,
      0
    )

    // Prepare payload (rename keys if backend expects different)
    const payload = {
      cartItemIds: cartItems.map(ci => ci.id),
      totalAmount,          // ensure not null
      // optional placeholders:
      // paymentMethod: "COD",
      // shippingAddressId: 1
    }

    console.log("Creating order payload:", payload)

    try {
      const response = await fetch(`http://localhost:8080/api/shopping/order/create/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        let order
        try {
          order = await response.json()
        } catch {
          toast({ title: "Order created", description: "Order created (no JSON body returned)" })
          return
        }
        toast({ title: "Order placed", description: `Order #${order.id} created` })
        router.push(`/orders/${order.id}`)
      } else {
        let errorText = ""
        try {
          const ct = response.headers.get("content-type") || ""
            if (ct.includes("application/json")) {
              const data = await response.json()
              errorText = data.message || data.error || JSON.stringify(data)
            } else {
              errorText = (await response.text())?.trim()
            }
        } catch {}
        console.error("Order creation failed:", response.status, errorText)
        toast({
          title: "Checkout failed",
          description: errorText || `Status ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (e: any) {
      console.error("Checkout exception:", e)
      toast({
        title: "Error",
        description: e?.message || "Network / server error",
        variant: "destructive",
      })
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">Review your selected artworks before checkout</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Discover amazing artworks and add them to your cart</p>
                <Button asChild>
                  <Link href="/artworks">Browse Artworks</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Items ({cartItems.length})</h2>
                    <Button variant="outline" onClick={handleClearCart} className="text-destructive bg-transparent">
                      Clear Cart
                    </Button>
                  </div>

                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {item.artwork.imageUrl ? (
                              <Image
                                src={item.artwork.imageUrl || "/placeholder.svg"}
                                alt={item.artwork.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <Link href={`/artworks/${item.artwork.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">
                                {item.artwork.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">by {item.artwork.artist.user.username}</p>
                            <p className="font-semibold mt-1">${item.artwork.price.toFixed(2)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || processingItems.has(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={processingItems.has(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={processingItems.has(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <Button onClick={handleCheckout} className="w-full" size="lg" disabled={placingOrder || cartItems.length===0}>
                        {placingOrder ? "Placing order..." : "Proceed to Checkout"}
                      </Button>
                      <Button variant="outline" asChild className="w-full bg-transparent">
                        <Link href="/artworks">Continue Shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
