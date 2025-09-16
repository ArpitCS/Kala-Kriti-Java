"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { CartItem } from "@/types"

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  addToCart: (artworkId: number, quantity?: number) => Promise<boolean>
  removeFromCart: (cartItemId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<boolean>
  refreshCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const refreshCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/shopping/cart/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (artworkId: number, quantity = 1): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch(
        `http://localhost:8080/api/shopping/cart/add?userId=${user.id}&artworkId=${artworkId}&quantity=${quantity}`,
        {
          method: "POST",
        },
      )

      if (response.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding to cart:", error)
      return false
    }
  }

  const removeFromCart = async (cartItemId: number): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:8080/api/shopping/cart/${cartItemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch (error) {
      console.error("Error removing from cart:", error)
      return false
    }
  }

  const clearCart = async (): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch(`http://localhost:8080/api/shopping/cart/clear/${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCartItems([])
        return true
      }
      return false
    } catch (error) {
      console.error("Error clearing cart:", error)
      return false
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number): Promise<boolean> => {
    // Since the backend doesn't have an update quantity endpoint,
    // we'll remove the item and add it back with the new quantity
    const cartItem = cartItems.find((item) => item.id === cartItemId)
    if (!cartItem) return false

    try {
      await removeFromCart(cartItemId)
      return await addToCart(cartItem.artwork.id, quantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
      return false
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
