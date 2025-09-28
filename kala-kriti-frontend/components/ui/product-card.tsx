"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleFavorite?: (product: Product) => void
  isFavorite?: boolean
}

export function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite = false }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.title)}`}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onToggleFavorite?.(product)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm">
            Only {product.stock} left
          </Badge>
        )}

        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            Sold Out
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{product.title}</h3>
          </Link>
          <p className="text-xs text-muted-foreground">by {product.artistName}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-lg">{formatPrice(product.price)}</p>
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          </div>

          <Button size="sm" onClick={() => onAddToCart?.(product)} disabled={product.stock === 0} className="shrink-0">
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
