"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, total, count } = useCart()
  const { isAuthenticated } = useAuth()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Discover exceptional artworks and start your collection today.</p>
              <Button size="lg" asChild>
                <Link href="/artworks">
                  Browse Artworks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/artworks/${item.product.id}`} className="font-semibold hover:underline block mb-1">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.product.description}</p>
                    <div className="text-lg font-bold">₹{item.product.price.toLocaleString()}</div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({count})</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button variant="outline" size="lg" className="w-full mt-3 bg-transparent" asChild>
                <Link href="/artworks">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
