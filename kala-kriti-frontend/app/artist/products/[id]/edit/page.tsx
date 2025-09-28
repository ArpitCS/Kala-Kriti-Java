"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"

const categories = ["PAINTING", "SCULPTURE", "PHOTOGRAPHY", "DIGITAL_ART", "DRAWING", "MIXED_MEDIA", "PRINTS", "CRAFTS"]

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  tags: string
  dimensions: string
  materials: string
  weight: number
  images: string[]
}

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [newImages, setNewImages] = useState<File[]>([])
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    tags: "",
    dimensions: "",
    materials: "",
    weight: "",
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`)
        const productData = response.data
        setProduct(productData)
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          stock: productData.stock.toString(),
          category: productData.category,
          tags: productData.tags || "",
          dimensions: productData.dimensions || "",
          materials: productData.materials || "",
          weight: productData.weight?.toString() || "",
        })
      } catch (error) {
        console.error("Failed to fetch product:", error)
        router.push("/artist/dashboard")
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 5 - ((product?.images.length || 0) - deletedImages.length + newImages.length)
    setNewImages((prev) => [...prev, ...files].slice(0, remainingSlots))
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageUrl: string) => {
    setDeletedImages((prev) => [...prev, imageUrl])
  }

  const restoreImage = (imageUrl: string) => {
    setDeletedImages((prev) => prev.filter((url) => url !== imageUrl))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = new FormData()

      // Add product details
      productData.append("name", formData.name)
      productData.append("description", formData.description)
      productData.append("price", formData.price)
      productData.append("stock", formData.stock)
      productData.append("category", formData.category)
      productData.append("tags", formData.tags)
      productData.append("dimensions", formData.dimensions)
      productData.append("materials", formData.materials)
      productData.append("weight", formData.weight)

      // Add new images
      newImages.forEach((image) => {
        productData.append("newImages", image)
      })

      // Add deleted images
      deletedImages.forEach((imageUrl) => {
        productData.append("deletedImages", imageUrl)
      })

      await api.put(`/products/${params.id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      router.push("/artist/dashboard")
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      await api.delete(`/products/${params.id}`)
      router.push("/artist/dashboard")
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  const existingImages = product.images.filter((img) => !deletedImages.includes(img))
  const totalImages = existingImages.length + newImages.length

  return (
    <ProtectedRoute allowedRoles={["ARTIST"]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/artist/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
                <p className="text-muted-foreground mt-1">Update your artwork listing</p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about your artwork</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your artwork..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Set your pricing and stock information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Details</CardTitle>
                <CardDescription>Specifications and materials used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="e.g., 24x36 inches"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials</Label>
                    <Input
                      id="materials"
                      name="materials"
                      value={formData.materials}
                      onChange={handleInputChange}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Manage your product images (up to 5 total)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Existing Images */}
                  {product.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Current Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {product.images.map((imageUrl, index) => (
                          <div
                            key={index}
                            className={`relative group ${deletedImages.includes(imageUrl) ? "opacity-50" : ""}`}
                          >
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            {deletedImages.includes(imageUrl) ? (
                              <button
                                type="button"
                                onClick={() => restoreImage(imageUrl)}
                                className="absolute inset-0 bg-black/50 text-white rounded-lg flex items-center justify-center text-xs"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeExistingImage(imageUrl)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {newImages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">New Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {newImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`New image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Images */}
                  {totalImages < 5 && (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> more images
                          </p>
                          <p className="text-xs text-muted-foreground">{5 - totalImages} slots remaining</p>
                        </div>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href="/artist/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
