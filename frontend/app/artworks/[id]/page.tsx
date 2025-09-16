"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Heart, Share2, User } from "lucide-react"
import { fetchArtworkById, fetchArtworksByArtist } from "@/lib/api"
import { ArtworkCard } from "@/components/artwork/artwork-card"
import type { Artwork } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function ArtworkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (params.id) {
      loadArtwork(params.id as string)
    }
  }, [params.id])

  const loadArtwork = async (id: string) => {
    setLoading(true)
    const artworkData = await fetchArtworkById(id)

    if (artworkData) {
      setArtwork(artworkData)
      // Load related artworks from the same artist
      const relatedData = await fetchArtworksByArtist(artworkData.artist.id.toString())
      setRelatedArtworks(relatedData.filter((item: Artwork) => item.id !== artworkData.id).slice(0, 4))
    }

    setLoading(false)
  }

  const handleAddToCart = async () => {
    if (!artwork) return
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in to add items to cart", variant: "destructive" })
      return
    }
    const success = await addToCart(artwork.id, quantity)
    if (success) {
      toast({ title: "Added to cart", description: `${artwork.title} (x${quantity}) added` })
    } else {
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" })
    }
  }

  const handleToggleFavorite = () => {
    // TODO: Implement favorite functionality
    console.log("Toggle favorite:", artwork?.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share artwork:", artwork?.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Artwork Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {artwork.imageUrl ? (
                  <Image
                    src={artwork.imageUrl || "/placeholder.svg"}
                    alt={artwork.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Artwork Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">{artwork.title}</h1>
                <Link href={`/artists/${artwork.artist.id}`}>
                  <p className="text-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <User className="h-4 w-4" />
                    by {artwork.artist.user.username}
                  </p>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${artwork.price.toFixed(2)}</span>
                <Badge variant="secondary">Available</Badge>
              </div>

              {artwork.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{artwork.description}</p>
                </div>
              )}

              <Separator />

              {/* Purchase Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-border rounded px-2 py-1 bg-background"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddToCart} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" onClick={handleToggleFavorite}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Artist Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      {artwork.artist.profileImageUrl ? (
                        <Image
                          src={artwork.artist.profileImageUrl || "/placeholder.svg"}
                          alt={artwork.artist.user.username}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{artwork.artist.user.username}</h4>
                      {artwork.artist.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{artwork.artist.bio}</p>
                      )}
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/artists/${artwork.artist.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Artworks */}
          {relatedArtworks.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-serif font-bold mb-6">More from this Artist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArtworks.map((relatedArtwork) => (
                  <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
