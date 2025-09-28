"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="border-0 shadow-sm text-left">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-semibold">#{orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600 font-semibold">Confirmed</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  A confirmation email with order details has been sent to your email address.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Shipping Updates</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once your order ships, typically within 2-3 business days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/profile/orders">
                View Order History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
