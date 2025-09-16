"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ArtworkCard } from "@/components/artwork/artwork-card"
import { ArtworkFilters } from "@/components/artwork/artwork-filters"
import { Button } from "@/components/ui/button"
import { Loader2, Grid, List } from "lucide-react"
import { fetchArtworks, searchArtworks, fetchArtworksByPriceRange } from "@/lib/api"
import type { Artwork } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    setLoading(true)
    const data = await fetchArtworks()
    setArtworks(data)
    setLoading(false)
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadArtworks()
      return
    }

    setLoading(true)
    const data = await searchArtworks(query)
    setArtworks(data)
    setLoading(false)
  }

  const handlePriceRangeChange = async (min: number, max: number) => {
    setLoading(true)
    const data = await fetchArtworksByPriceRange(min, max)
    setArtworks(data)
    setLoading(false)
  }

  const handleClearFilters = () => {
    loadArtworks()
  }

  const handleAddToCart = async (artworkId: number) => {
    const success = await addToCart(artworkId)
    if (success) {
      toast({ title: "Added to cart", description: "Artwork added to your cart" })
    } else {
      toast({ title: "Failed", description: "Could not add to cart", variant: "destructive" })
    }
  }

  const handleToggleFavorite = (artworkId: number) => {
    // TODO: Implement favorite functionality
    console.log("Toggle favorite:", artworkId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Browse Artworks</h1>
            <p className="text-muted-foreground">Discover unique pieces from talented artists around the world</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ArtworkFilters
                onSearch={handleSearch}
                onPriceRangeChange={handlePriceRangeChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${artworks.length} artworks found`}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {/* Artworks Grid */}
              {!loading && artworks.length > 0 && (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {artworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      onAddToCart={handleAddToCart}  // now actually adds to cart
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && artworks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No artworks found</p>
                  <Button onClick={loadArtworks}>Refresh</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
