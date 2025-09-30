"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { ApiClient } from "@/lib/api"
import type { Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, userId, isArtist, isLoading: isAuthLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    stockQuantity: "1",
    dimensions: "",
    medium: "",
    yearCreated: new Date().getFullYear().toString(),
  })

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!isAuthenticated) {
      const target = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/"
      router.push(`/auth/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    if (!isArtist) {
      router.push("/")
      return
    }
    loadCategories()
  }, [isAuthenticated, isArtist, isAuthLoading])

  const loadCategories = async () => {
    try {
      const data = await ApiClient.get<Category[]>("/api/categories")
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error loading categories",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)

    try {
      await ApiClient.post("/api/products", {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        imageUrl: formData.imageUrl || undefined,
        artistId: userId,
        categoryId: Number.parseInt(formData.categoryId, 10),
        stockQuantity: Number.parseInt(formData.stockQuantity, 10),
        dimensions: formData.dimensions || undefined,
        medium: formData.medium || undefined,
        yearCreated: formData.yearCreated ? Number.parseInt(formData.yearCreated, 10) : undefined,
      })

      toast({
        title: "Product created",
        description: "Your artwork has been listed successfully.",
      })
      router.push("/dashboard/products")
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add New Product</h1>
          <p className="text-gray-600">List a new artwork for sale on Kala-Kriti.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Artwork Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 24x18 inches"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Input
                    id="medium"
                    placeholder="e.g., Oil on Canvas"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearCreated">Year Created</Label>
                <Input
                  id="yearCreated"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearCreated}
                  onChange={(e) => setFormData({ ...formData, yearCreated: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
