"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart"

export function CartSidebar() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground">Add some artworks to get started</p>
                </div>
                <Button onClick={() => setIsOpen(false)} asChild>
                  <Link href="/products">Browse Artworks</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                      <Image
                        src={
                          item.product.imageUrl ||
                          `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.product.title) || "/placeholder.svg"}`
                        }
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground">by {item.product.artistName}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 rounded-r-none"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8 p-0 rounded-l-none"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={() => setIsOpen(false)} asChild>
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)} asChild>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
