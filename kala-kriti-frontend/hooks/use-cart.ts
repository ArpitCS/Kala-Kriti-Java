"use client"

import { useState, useEffect } from "react"
import { CartService } from "@/lib/cart"
import type { CartItem, Product } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCart(CartService.getCart())
    setIsLoading(false)
  }, [])

  const addToCart = (product: Product, quantity = 1) => {
    CartService.addToCart(product, quantity)
    setCart(CartService.getCart())
  }

  const removeFromCart = (productId: number) => {
    CartService.removeFromCart(productId)
    setCart(CartService.getCart())
  }

  const updateQuantity = (productId: number, quantity: number) => {
    CartService.updateQuantity(productId, quantity)
    setCart(CartService.getCart())
  }

  const clearCart = () => {
    CartService.clearCart()
    setCart([])
  }

  const total = CartService.getCartTotal()
  const count = CartService.getCartCount()

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    count,
    isLoading,
  }
}
