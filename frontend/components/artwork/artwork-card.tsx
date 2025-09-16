"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Artwork } from "@/types"

interface ArtworkCardProps {
  artwork: Artwork
  onAddToCart?: (artworkId: number) => void
  onToggleFavorite?: (artworkId: number) => void
}

export function ArtworkCard({ artwork, onAddToCart, onToggleFavorite }: ArtworkCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (onAddToCart) {
      onAddToCart(artwork.id)
    } else {
      const success = await addToCart(artwork.id)
      if (success) {
        toast({
          title: "Added to cart",
          description: `${artwork.title} has been added to your cart`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="artwork-card-hover group">
      <CardContent className="py-0 px-5">
        <div className="relative">
          <Link href={`/artworks/${artwork.id}`}>
            <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
              {artwork.imageUrl ? (
                <Image
                  src={artwork.imageUrl || "/placeholder.svg"}
                  alt={artwork.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
          </Link>

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleFavorite && (
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => onToggleFavorite(artwork.id)}>
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <Link href={`/artworks/${artwork.id}`}>
            <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">{artwork.title}</h3>
          </Link>

          <Link href={`/artists/${artwork.artist.id}`}>
            <p className="text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors">
              by {artwork.artist.user.username}
            </p>
          </Link>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">${artwork.price.toFixed(2)}</p>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
