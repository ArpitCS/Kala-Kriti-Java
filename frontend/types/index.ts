export interface User {
  id: number
  username: string
  email: string
  userType: "CUSTOMER" | "ARTIST" | "ADMIN"
}

export interface ArtistProfile {
  id: number
  bio?: string
  profileImageUrl?: string
  contactInfo?: string
  socialLinks?: string
  user: User
}

export interface Artwork {
  id: number
  title: string
  description?: string
  price: number
  imageUrl?: string
  createdAt: string
  artist: ArtistProfile
}

export interface CartItem {
  id: number
  user: User
  artwork: Artwork
  quantity: number
  addedAt: string
}

export interface Order {
  id: number
  userId: number
  username: string
  email: string
  userType: string
  orderItems: OrderItem[]
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt?: string
}

export interface OrderItem {
  id: number
  orderId: number
  artworkId: number
  artworkTitle: string
  artworkImageUrl?: string
  artworkPrice: number
  artistName: string
  artistId: number
  quantity: number
  price: number
  totalPrice: number
}
