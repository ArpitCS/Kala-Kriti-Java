"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { fetchArtworksByArtist, fetchArtistProfileByUserId } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Artwork, ArtistProfile } from "@/types"
import Image from "next/image"

export default function ArtistArtworksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      const profile = await fetchArtistProfileByUserId(user.id.toString())
      setArtistProfile(profile)

      if (profile) {
        const artworkData = await fetchArtworksByArtist(profile.id.toString())
        setArtworks(artworkData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArtwork = async (artworkId: number) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return

    try {
      const response = await fetch(`http://localhost:8080/api/artworks/${artworkId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setArtworks((prev) => prev.filter((artwork) => artwork.id !== artworkId))
        toast({
          title: "Artwork deleted",
          description: "Your artwork has been removed successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete artwork",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the artwork",
        variant: "destructive",
      })
    }
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

  return (
    <ProtectedRoute requiredRole="ARTIST">
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">My Artworks</h1>
                <p className="text-muted-foreground">Manage your portfolio and showcase your creativity</p>
              </div>
              <Button asChild>
                <Link href="/artist/artworks/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Artwork
                </Link>
              </Button>
            </div>

            {!artistProfile ? (
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
            ) : artworks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No artworks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your portfolio by adding your first artwork
                  </p>
                  <Button asChild>
                    <Link href="/artist/artworks/new">Add Your First Artwork</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map((artwork) => (
                  <Card key={artwork.id} className="artwork-card-hover group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                          {artwork.imageUrl ? (
                            <Image
                              src={artwork.imageUrl || "/placeholder.svg"}
                              alt={artwork.title}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-muted-foreground">No Image</span>
                            </div>
                          )}
                        </div>

                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary">${artwork.price.toFixed(2)}</Badge>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                            <Link href={`/artworks/${artwork.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                            <Link href={`/artist/artworks/${artwork.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteArtwork(artwork.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-1">{artwork.title}</h3>
                        {artwork.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{artwork.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">${artwork.price.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(artwork.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
