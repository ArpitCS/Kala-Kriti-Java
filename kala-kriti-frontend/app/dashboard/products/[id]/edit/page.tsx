"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { ApiClient } from "@/lib/api"
import type { Product, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, userId, isArtist, isAdmin, isLoading: isAuthLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    stockQuantity: "",
    dimensions: "",
    medium: "",
    yearCreated: "",
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
    if (!isArtist && !isAdmin) {
      router.push("/")
      return
    }
    loadData()
  }, [isAuthenticated, isArtist, isAdmin, isAuthLoading])

  const loadData = async () => {
    setIsDataLoading(true)
    try {
      const [productData, categoriesData] = await Promise.all([
        ApiClient.get<Product>(`/api/products/${params.id}`),
        ApiClient.get<Category[]>("/api/categories"),
      ])

      // Check if user owns this product (unless admin)
      if (!isAdmin && productData.artistId !== userId) {
        toast({
          title: "Access denied",
          description: "You don't have permission to edit this product.",
          variant: "destructive",
        })
        router.push("/dashboard/products")
        return
      }

      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price.toString(),
        imageUrl: productData.imageUrl || "",
        categoryId: productData.categoryId.toString(),
        stockQuantity: productData.stockQuantity.toString(),
        dimensions: productData.dimensions || "",
        medium: productData.medium || "",
        yearCreated: productData.yearCreated?.toString() || "",
      })
      setCategories(categoriesData)
    } catch (error) {
      toast({
        title: "Error loading product",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await ApiClient.put(`/api/products/${params.id}`, {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        imageUrl: formData.imageUrl || undefined,
        categoryId: Number.parseInt(formData.categoryId, 10),
        stockQuantity: Number.parseInt(formData.stockQuantity, 10),
        dimensions: formData.dimensions || undefined,
        medium: formData.medium || undefined,
        yearCreated: formData.yearCreated ? Number.parseInt(formData.yearCreated, 10) : undefined,
      })

      toast({
        title: "Product updated",
        description: "Your artwork has been updated successfully.",
      })
      router.push("/dashboard/products")
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Product</h1>
          <p className="text-gray-600">Update your artwork details.</p>
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
                    <SelectValue />
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
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Input
                    id="medium"
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
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
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
