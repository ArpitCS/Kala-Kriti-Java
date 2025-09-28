"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient, type Category } from "@/lib/api"

interface CategoryWithCount extends Category {
  productCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts({ size: 1000 }), // Get all products to count by category
      ])

      if (categoriesResponse.data && productsResponse.data) {
        const categoriesWithCount = categoriesResponse.data.map((category) => ({
          ...category,
          productCount: productsResponse.data!.filter((product) => product.category.id === category.id).length,
        }))
        setCategories(categoriesWithCount)
      }
      setIsLoading(false)
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Art Categories</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore artworks by category and discover your preferred artistic styles and mediums.
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                    <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.productCount}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description ||
                        `Discover beautiful ${category.name.toLowerCase()} artworks from our talented artists.`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {categories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">Categories will appear here once they are added.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
