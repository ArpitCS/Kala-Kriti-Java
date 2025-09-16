const API_BASE_URL = "http://localhost:8080/api"

// Artwork API functions
export async function fetchArtworks(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks`)
    if (!response.ok) throw new Error("Failed to fetch artworks")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artworks:", error)
    return []
  }
}

export async function fetchArtworkById(id: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/${id}`)
    if (!response.ok) throw new Error("Failed to fetch artwork")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artwork:", error)
    return null
  }
}

export async function searchArtworks(title: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/search?title=${encodeURIComponent(title)}`)
    if (!response.ok) throw new Error("Failed to search artworks")
    return await response.json()
  } catch (error) {
    console.error("Error searching artworks:", error)
    return []
  }
}

export async function fetchArtworksByPriceRange(minPrice: number, maxPrice: number): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`)
    if (!response.ok) throw new Error("Failed to fetch artworks by price range")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artworks by price range:", error)
    return []
  }
}

export async function fetchArtworksByArtist(artistId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/artist/${artistId}`)
    if (!response.ok) throw new Error("Failed to fetch artworks by artist")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artworks by artist:", error)
    return []
  }
}

// Artist API functions
export async function fetchArtistProfile(id: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/profile/${id}`)
    if (!response.ok) throw new Error("Failed to fetch artist profile")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artist profile:", error)
    return null
  }
}

export async function fetchArtistProfileByUserId(userId: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/profile/user/${userId}`)
    if (!response.ok) throw new Error("Failed to fetch artist profile by user ID")
    return await response.json()
  } catch (error) {
    console.error("Error fetching artist profile by user ID:", error)
    return null
  }
}
