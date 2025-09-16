"use client"

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

export default function ArtistProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    bio: "",
    profileImageUrl: "",
    contactInfo: "",
    socialLinks: "",
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const profileData = await fetchArtistProfileByUserId(user.id.toString())
      if (profileData) {
        setProfile(profileData)
        setFormData({
          bio: profileData.bio || "",
          profileImageUrl: profileData.profileImageUrl || "",
          contactInfo: profileData.contactInfo || "",
          socialLinks: profileData.socialLinks || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setSaving(true)

    try {
      const url = profile
        ? `http://localhost:8080/api/artists/profile/${profile.id}`
        : `http://localhost:8080/api/artists/profile/${user.id}`

      const method = profile ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Profile saved",
          description: "Your artist profile has been updated successfully",
        })
        router.push("/artist/dashboard")
      } else {
        setError("Failed to save profile. Please try again.")
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

  return (
    <ProtectedRoute requiredRole="ARTIST">
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">
                    {profile ? "Edit Artist Profile" : "Create Artist Profile"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell people about yourself and your artistic journey..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                      <Input
                        id="profileImageUrl"
                        type="url"
                        value={formData.profileImageUrl}
                        onChange={(e) => handleInputChange("profileImageUrl", e.target.value)}
                        placeholder="https://example.com/your-photo.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Contact Information</Label>
                      <Input
                        id="contactInfo"
                        value={formData.contactInfo}
                        onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                        placeholder="Email, phone, or other contact details"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="socialLinks">Social Media Links</Label>
                      <Textarea
                        id="socialLinks"
                        value={formData.socialLinks}
                        onChange={(e) => handleInputChange("socialLinks", e.target.value)}
                        placeholder="Instagram, Twitter, website, etc. (one per line)"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={saving} className="flex-1">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
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
