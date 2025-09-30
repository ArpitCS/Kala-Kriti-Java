"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApiClient } from "@/lib/api"
import type { User, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ArtistProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [artist, setArtist] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArtistData()
  }, [params.id])

  const loadArtistData = async () => {
    try {
      const [artistData, productsData] = await Promise.all([
        ApiClient.get<User>(`/api/users/${params.id}`),
        ApiClient.get<Product[]>(`/api/products/artist/${params.id}`),
      ])
      setArtist(artistData)
      setProducts(productsData)
    } catch (error) {
      toast({
        title: "Error loading artist",
        description: "Failed to load artist profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading artist profile...</div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Artist not found</h2>
            <p className="text-gray-600 mb-4">The artist you&apos;re looking for doesn&apos;t exist.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                {artist.firstName[0]}
                {artist.lastName[0]}
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {artist.firstName} {artist.lastName}
              </h1>
              <p className="text-gray-600 mb-4">@{artist.username}</p>
              {artist.specialization && (
                <Badge variant="outline" className="mb-6">
                  {artist.specialization}
                </Badge>
              )}

              <Separator className="my-6" />

              {artist.bio && (
                <div className="text-left mb-6">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{artist.bio}</p>
                </div>
              )}

              <div className="space-y-3">
                {artist.email && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={`mailto:${artist.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Artist
                    </a>
                  </Button>
                )}
                {artist.portfolioUrl && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={artist.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Portfolio
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Artworks by {artist.firstName}</h2>
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">This artist hasn&apos;t listed any artworks yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/artworks/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                        {product.stockQuantity > 0 ? (
                          <Badge variant="outline">Available</Badge>
                        ) : (
                          <Badge variant="secondary">Sold Out</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
