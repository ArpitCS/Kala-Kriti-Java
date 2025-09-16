"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X } from "lucide-react"

interface ArtworkFiltersProps {
  onSearch: (query: string) => void
  onPriceRangeChange: (min: number, max: number) => void
  onClearFilters: () => void
}

export function ArtworkFilters({ onSearch, onPriceRangeChange, onClearFilters }: ArtworkFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onPriceRangeChange(values[0], values[1])
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 1000])
    onClearFilters()
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <Button variant="ghost" onClick={handleClearFilters} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={2000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$2000+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
