"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Search } from "lucide-react"
import type { ArtistProfile } from "@/types"

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>([])
  const [filteredArtists, setFilteredArtists] = useState<ArtistProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // TODO: Implement API call to fetch all artists
    // For now, using mock data
    const mockArtists: ArtistProfile[] = []
    setArtists(mockArtists)
    setFilteredArtists(mockArtists)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArtists(artists)
    } else {
      const filtered = artists.filter(
        (artist) =>
          artist.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredArtists(filtered)
    }
  }, [searchQuery, artists])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Featured Artists</h1>
            <p className="text-muted-foreground">Meet the talented creators behind our beautiful artworks</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Artists Grid */}
          {!loading && filteredArtists.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <Card key={artist.id} className="artwork-card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {artist.profileImageUrl ? (
                        <Image
                          src={artist.profileImageUrl || "/placeholder.svg"}
                          alt={artist.user.username}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    <h3 className="font-semibold mb-2">{artist.user.username}</h3>

                    {artist.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{artist.bio}</p>}

                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={`/artists/${artist.id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No artists found matching your search" : "No artists found"}
              </p>
              {searchQuery && <Button onClick={() => setSearchQuery("")}>Clear Search</Button>}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
