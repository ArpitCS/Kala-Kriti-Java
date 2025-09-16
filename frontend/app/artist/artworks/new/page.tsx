"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { fetchArtistProfileByUserId } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { ArtistProfile } from "@/types"

export default function NewArtworkPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  })

  useEffect(() => {
    if (user) {
      loadArtistProfile()
    }
  }, [user])

  const loadArtistProfile = async () => {
    if (!user) return

    try {
      const profile = await fetchArtistProfileByUserId(user.id.toString())
      setArtistProfile(profile)
    } catch (error) {
      console.error("Error loading artist profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artistProfile) return

    setError("")
    setSaving(true)

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required")
      setSaving(false)
      return
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Please enter a valid price")
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/artworks/artist/${artistProfile.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          imageUrl: formData.imageUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Artwork created",
          description: "Your artwork has been added to your portfolio",
        })
        router.push("/artist/artworks")
      } else {
        setError("Failed to create artwork. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ARTIST">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (!artistProfile) {
    return (
      <ProtectedRoute requiredRole="ARTIST">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Artist Profile Required</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to create an artist profile before adding artworks
                  </p>
                  <Button asChild>
                    <Link href="/artist/profile">Create Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="ARTIST">
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artworks
            </Button>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Add New Artwork</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter artwork title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your artwork, inspiration, techniques used..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                        placeholder="https://example.com/your-artwork.jpg"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={saving} className="flex-1">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Artwork
                          </>
                        )}
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
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
