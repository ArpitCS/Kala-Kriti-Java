"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArtworkCard } from "@/components/artwork/artwork-card"
import { Plus, Palette, DollarSign, Eye, TrendingUp } from "lucide-react"
import { fetchArtworksByArtist, fetchArtistProfileByUserId } from "@/lib/api"
import type { Artwork, ArtistProfile } from "@/types"

export default function ArtistDashboard() {
  const { user } = useAuth()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch artist profile
      const profile = await fetchArtistProfileByUserId(user.id.toString())
      setArtistProfile(profile)

      // Fetch artworks if profile exists
      if (profile) {
        const artworkData = await fetchArtworksByArtist(profile.id.toString())
        setArtworks(artworkData)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = artworks.reduce((sum, artwork) => sum + artwork.price, 0)
  const totalViews = artworks.length * 150 // Mock data for views

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
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Artist Studio</h1>
                <p className="text-muted-foreground">Manage your artworks and track your success</p>
              </div>
              <Button asChild>
                <Link href="/artist/artworks/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artwork
                </Link>
              </Button>
            </div>

            {/* Profile Setup Notice */}
            {!artistProfile && (
              <Card className="mb-8 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Complete Your Artist Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Set up your artist profile to start showcasing your work
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/artist/profile">Setup Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Artworks</p>
                      <p className="text-2xl font-bold">{artworks.length}</p>
                    </div>
                    <Palette className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Price</p>
                      <p className="text-2xl font-bold">
                        ${artworks.length > 0 ? (totalRevenue / artworks.length).toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Add New Artwork</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload and showcase your latest creation</p>
                    <Button asChild className="w-full">
                      <Link href="/artist/artworks/new">Add Artwork</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Manage Portfolio</h3>
                    <p className="text-sm text-muted-foreground mb-4">Edit and organize your existing artworks</p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/artist/artworks">View All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Update Profile</h3>
                    <p className="text-sm text-muted-foreground mb-4">Keep your artist information current</p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/artist/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Artworks */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">Your Artworks</h2>
                <Button variant="outline" asChild>
                  <Link href="/artist/artworks">View All</Link>
                </Button>
              </div>

              {artworks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {artworks.slice(0, 8).map((artwork) => (
                    <div key={artwork.id} className="relative">
                      <ArtworkCard artwork={artwork} />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          ${artwork.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
