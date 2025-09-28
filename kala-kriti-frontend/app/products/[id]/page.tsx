"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, Share2, ShoppingBag, User, Package, Minus, Plus } from "lucide-react"
import { apiClient, type Product } from "@/lib/api"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const productId = Number.parseInt(params.id as string)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      const response = await apiClient.getProduct(productId)
      if (response.data) {
        const productData = response.data
        setProduct(productData)

        // Fetch related products from same category
        const relatedResponse = await apiClient.getProducts({
          category: productData.category.id,
          size: 4,
        })
        if (relatedResponse.data) {
          setRelatedProducts(relatedResponse.data.filter((p) => p.id !== productData.id).slice(0, 4))
        }
      }
      setIsLoading(false)
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    toast({
      title: "Added to cart",
      description: `${product.title} (${quantity} pcs) has been added to your cart.`,
    })
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="space-y-6">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-foreground">
              Artworks
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={
                  product.imageUrl || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.title)}`
                }
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail images would go here if we had multiple images */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-display font-bold mb-2">{product.title}</h1>
              <div className="text-muted-foreground inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                by {product.artistName}
              </div>
            </div>

            <div className="text-3xl font-bold">{formatPrice(product.price)}</div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {product.stock > 0 ? (
                <span className="text-sm">{product.stock > 10 ? "In stock" : `Only ${product.stock} left`}</span>
              ) : (
                <span className="text-sm text-destructive">Out of stock</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 rounded-none focus-visible:ring-0"
                    min={1}
                    max={product.stock}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1" size="lg">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="border-0 bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{product.category.name}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Artist</span>
                  <span>{product.artistName}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8">Related Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
