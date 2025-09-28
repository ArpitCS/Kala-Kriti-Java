"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { apiClient, type Category } from "@/lib/api"

interface FilterState {
  categories: number[]
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  className?: string
}

export function ProductFilters({ filters, onFiltersChange, onClearFilters, className }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiClient.getCategories()
      if (response.data) {
        setCategories(response.data)
      }
      setIsLoading(false)
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId)

    onFiltersChange({
      ...filters,
      categories: newCategories,
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value,
    })
  }

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked,
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000 ||
    filters.inStock ||
    filters.sortBy !== "newest"

  return (
    <div className={className}>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort by</Label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="title_asc">Title: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Availability</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={handleInStockChange} />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId)
                  return category ? (
                    <Badge key={categoryId} variant="secondary" className="text-xs">
                      {category.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleCategoryChange(categoryId, false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null
                })}

                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                  <Badge variant="secondary" className="text-xs">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Badge>
                )}

                {filters.inStock && (
                  <Badge variant="secondary" className="text-xs">
                    In Stock
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
