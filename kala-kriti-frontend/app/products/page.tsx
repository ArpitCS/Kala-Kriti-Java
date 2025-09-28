"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { ProductFilters } from "@/components/ui/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, List, SlidersHorizontal } from "lucide-react"
import { apiClient, type Product } from "@/lib/api"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

interface FilterState {
  categories: number[]
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    sortBy: "newest",
    inStock: false,
  })
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const response = await apiClient.getProducts({ page: 1, size: 50 })
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Unable to load artworks",
          description: response.error,
        })
      }
      const fetchedProducts = response.data ?? []
      setProducts(fetchedProducts)
      setFilteredProducts(fetchedProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [toast])

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => filters.categories.includes(product.category.id))
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock > 0)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, filters])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const response = await apiClient.searchProducts(query)
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Search failed",
          description: response.error,
        })
      }
      if (response.data) {
        setProducts(response.data)
      }
    } else {
      // Reset to all products
      const response = await apiClient.getProducts({ page: 1, size: 50 })
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Unable to load artworks",
          description: response.error,
        })
      }
      if (response.data) {
        setProducts(response.data)
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 10000],
      sortBy: "newest",
      inStock: false,
    })
    setSearchQuery("")
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  const handleToggleFavorite = (product: Product) => {
    toast({
      title: "Coming soon",
      description: `${product.title} can be saved once favorites are available.`,
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Discover Artworks</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our curated collection of exceptional artworks from talented artists worldwide.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search artworks, artists, or categories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredProducts.length} artworks</Badge>
              {searchQuery && (
                <Badge variant="secondary">
                  Results for "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleSearch("")}
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-80 shrink-0`}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              className="sticky top-24"
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                      <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No artworks found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
