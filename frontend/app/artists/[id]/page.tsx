"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArtworkCard } from "@/components/artwork/artwork-card"
import { User, Mail, ExternalLink, MapPin } from "lucide-react"
import { fetchArtistProfile, fetchArtworksByArtist } from "@/lib/api"
import type { ArtistProfile, Artwork } from "@/types"

export default function ArtistProfilePage() {
  const params = useParams()
  const [artist, setArtist] = useState<ArtistProfile | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadArtistData(params.id as string)
    }
  }, [params.id])

  const loadArtistData = async (artistId: string) => {
    try {
      const [artistData, artworkData] = await Promise.all([
        fetchArtistProfile(artistId),
        fetchArtworksByArtist(artistId),
      ])

      setArtist(artistData)
      setArtworks(artworkData)
    } catch (error) {
      console.error("Error loading artist data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
            <Button asChild>
              <Link href="/artists">Browse Artists</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Artist Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {artist.profileImageUrl ? (
                  <Image
                    src={artist.profileImageUrl || "/placeholder.svg"}
                    alt={artist.user.username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-serif font-bold">{artist.user.username}</h1>
                  <Badge variant="outline">Artist</Badge>
                </div>

                {artist.bio && <p className="text-muted-foreground mb-4 leading-relaxed">{artist.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {artist.contactInfo && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{artist.contactInfo}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{artworks.length} Artworks</span>
                  </div>
                </div>

                {artist.socialLinks && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {artist.socialLinks.split("\n").map((link, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a href={link.trim()} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Social Link
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artist's Artworks */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">Portfolio</h2>
              <span className="text-muted-foreground">{artworks.length} artworks</span>
            </div>

            {artworks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No artworks yet</h3>
                  <p className="text-muted-foreground">This artist hasn't uploaded any artworks yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
