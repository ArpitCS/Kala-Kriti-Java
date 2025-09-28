"use client"

import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Minus, Plus, X, ArrowRight, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart"

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const subtotal = totalPrice
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your selected artworks before checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover amazing artworks from our talented artists and start building your collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Browse Artworks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Items ({totalItems})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                  Clear all
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={
                              item.product.imageUrl ||
                              `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(item.product.title) || "/placeholder.svg"}`
                            }
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <Link href={`/products/${item.product.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">
                                {item.product.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">by {item.product.artistName}</p>
                            <Badge variant="outline" className="mt-1">
                              {item.product.category.name}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-10 w-10 p-0 rounded-r-none"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  className="h-10 w-10 p-0 rounded-l-none"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.product.price)} each
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-lg font-semibold">
                                {formatPrice(item.product.price * item.quantity)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.product.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {item.product.stock <= 5 && (
                            <p className="text-sm text-amber-600">Only {item.product.stock} left in stock</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Order Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(tax)}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                      Add {formatPrice(100 - subtotal)} more to qualify for free shipping
                    </div>
                  )}

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by industry-standard encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
