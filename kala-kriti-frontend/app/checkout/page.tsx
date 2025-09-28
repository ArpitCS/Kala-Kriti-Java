"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"

interface CheckoutForm {
  // Shipping
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string

  // Payment
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string

  // Options
  saveInfo: boolean
  newsletter: boolean
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    saveInfo: false,
    newsletter: false,
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }))
    }
  }, [user])

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

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"]
    return required.every((field) => formData[field as keyof CheckoutForm])
  }

  const validatePayment = () => {
    const required = ["cardNumber", "expiryDate", "cvv", "cardName"]
    return required.every((field) => formData[field as keyof CheckoutForm])
  }

  const handleSubmitOrder = async () => {
    if (!user) {
      setError("Please log in to complete your order")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Create order
      const orderData = {
        customerId: user.id,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        totalAmount: total,
      }

      const orderResponse = await apiClient.createOrder(orderData)

      if (orderResponse.data) {
        // Process payment
        const paymentData = {
          orderId: orderResponse.data.id,
          customerId: user.id,
          amount: total,
          method: "CREDIT_CARD" as const,
        }

        const paymentResponse = await apiClient.processPayment(paymentData)

        if (paymentResponse.data && paymentResponse.data.status === "SUCCESS") {
          clearCart()
          router.push(`/order-confirmation/${orderResponse.data.id}`)
        } else {
          setError("Payment failed. Please try again.")
        }
      } else {
        setError("Failed to create order. Please try again.")
      }
    } catch (error) {
      setError("An error occurred while processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold">Sign in to continue</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              You need to be signed in before placing an order. This helps us keep your purchases and delivery
              information in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <a href="/login?redirect=/checkout">Sign in</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/register">Create an account</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mb-8">
              {["shipping", "payment", "review"].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : index < ["shipping", "payment", "review"].indexOf(currentStep)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < ["shipping", "payment", "review"].indexOf(currentStep) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                  {index < 2 && <div className="w-8 h-px bg-border ml-4" />}
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Shipping Information */}
            {currentStep === "shipping" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-muted/50 border-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-muted/50 border-0"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="bg-muted/50 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={() => setCurrentStep("payment")} disabled={!validateShipping()} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            {currentStep === "payment" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      className="bg-muted/50 border-0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className="bg-muted/50 border-0"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        className="bg-muted/50 border-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => handleInputChange("saveInfo", checked as boolean)}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Save payment information for future purchases
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("shipping")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep("review")} disabled={!validatePayment()} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {currentStep === "review" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
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
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.title}</h4>
                          <p className="text-xs text-muted-foreground">by {item.product.artistName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p>{formData.email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                      <p>{formData.cardName}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("payment")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleSubmitOrder} disabled={isProcessing} className="flex-1">
                      <Lock className="mr-2 h-4 w-4" />
                      {isProcessing ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
