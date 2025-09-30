"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingCart, ArrowLeft, Package, Ruler, Calendar, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApiClient } from "@/lib/api"
import type { Product, User, Category } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function ArtworkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [artist, setArtist] = useState<User | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const productData = await ApiClient.get<Product>(`/api/products/${params.id}`)
      setProduct(productData)

      // Load artist and category details
      const [artistData, categoryData] = await Promise.all([
        ApiClient.get<User>(`/api/users/${productData.artistId}`),
        ApiClient.get<Category>(`/api/categories/${productData.categoryId}`),
      ])
      setArtist(artistData)
      setCategory(categoryData)
    } catch (error) {
      toast({
        title: "Error loading artwork",
        description: "Failed to load artwork details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
      })
      router.push("/auth/login")
      return
    }

    if (product) {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading artwork...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Artwork not found</h2>
            <p className="text-gray-600 mb-4">The artwork you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push("/artworks")}>Browse Artworks</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            {category && (
              <Link href={`/artworks?category=${category.id}`}>
                <Badge variant="outline" className="mb-2">
                  {category.name}
                </Badge>
              </Link>
            )}
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            {artist && (
              <Link href={`/artists/${artist.id}`} className="text-gray-600 hover:underline">
                by {artist.firstName} {artist.lastName}
              </Link>
            )}
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold mb-2">₹{product.price.toLocaleString()}</div>
            {product.stockQuantity > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Package className="mr-1 h-3 w-3" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Sold Out
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Artwork Details */}
          <div className="space-y-4 mb-8">
            <h2 className="font-semibold">Artwork Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {product.dimensions && (
                <div className="flex items-start gap-2">
                  <Ruler className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Dimensions</div>
                    <div className="text-sm text-gray-600">{product.dimensions}</div>
                  </div>
                </div>
              )}
              {product.medium && (
                <div className="flex items-start gap-2">
                  <Palette className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Medium</div>
                    <div className="text-sm text-gray-600">{product.medium}</div>
                  </div>
                </div>
              )}
              {product.yearCreated && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Year Created</div>
                    <div className="text-sm text-gray-600">{product.yearCreated}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Availability</div>
                  <div className="text-sm text-gray-600">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Sold out"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Info */}
          {artist && (
            <>
              <Separator className="my-6" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">About the Artist</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                      {artist.firstName[0]}
                      {artist.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <Link href={`/artists/${artist.id}`} className="font-medium hover:underline">
                        {artist.firstName} {artist.lastName}
                      </Link>
                      {artist.specialization && <p className="text-sm text-gray-600">{artist.specialization}</p>}
                      {artist.bio && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{artist.bio}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="mt-auto pt-8">
            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stockQuantity === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stockQuantity === 0 ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
