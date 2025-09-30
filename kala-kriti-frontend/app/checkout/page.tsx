"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Wallet, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { ApiClient } from "@/lib/api"
import type { CreateOrderRequest, PaymentMethod } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, total, clearCart } = useCart()
  const { isAuthenticated, userId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI")
  const [formData, setFormData] = useState({
    shippingAddress: "",
    billingAddress: "",
    sameAsShipping: true,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    if (cart.length === 0) {
      router.push("/cart")
    }
  }, [isAuthenticated, cart])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)

    try {
      // Create order
      const orderData: CreateOrderRequest = {
        customerId: userId,
        totalAmount: total,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
          artistId: item.product.artistId,
        })),
      }

      const order = await ApiClient.post("/api/orders", orderData)

      // Process payment
      await ApiClient.post("/api/payments/process", {
        orderId: order.id,
        customerId: userId,
        amount: total,
        method: paymentMethod,
        transactionId: `TXN${Date.now()}`,
        gatewayResponse: "Payment successful",
      })

      clearCart()
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will receive a confirmation email shortly.",
      })
      router.push("/profile?tab=orders")
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || cart.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Full Address</Label>
                  <Input
                    id="shippingAddress"
                    placeholder="Street address, city, state, postal code"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={(e) => setFormData({ ...formData, sameAsShipping: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="sameAsShipping" className="cursor-pointer">
                    Same as shipping address
                  </Label>
                </div>

                {!formData.sameAsShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Full Address</Label>
                    <Input
                      id="billingAddress"
                      placeholder="Street address, city, state, postal code"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="UPI" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <div className="font-medium">UPI</div>
                        <div className="text-sm text-gray-600">Pay using UPI apps</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="CREDIT_CARD" id="credit" />
                    <Label htmlFor="credit" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Credit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="NET_BANKING" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Net Banking</div>
                        <div className="text-sm text-gray-600">All major banks</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
