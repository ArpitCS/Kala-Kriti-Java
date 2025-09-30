"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "./api"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("kala_kriti_cart")
    if (savedCart) {
      try {
        const parsed: unknown = JSON.parse(savedCart)
        const safeItems: CartItem[] = Array.isArray(parsed)
          ? parsed
              .map((raw: any) => {
                const quantity = Math.max(1, Number(raw?.quantity ?? 1) || 1)
                const product = raw?.product ?? {}
                const price = Number(product?.price ?? product?.amount ?? 0) || 0
                const stock = Number(product?.stock ?? product?.stockQuantity ?? 0) || 0
                const id = Number(product?.id ?? 0) || 0
                const title = product?.title ?? product?.name ?? ""
                const artistName = product?.artistName ?? product?.artist?.name ?? product?.artist?.username ?? ""
                const categoryId = Number(product?.categoryId ?? product?.category?.id ?? 0) || 0
                const categoryName = product?.category?.name ?? product?.categoryName ?? ""

                const normalisedProduct: Product = {
                  id,
                  title,
                  description: String(product?.description ?? ""),
                  price,
                  stock,
                  artistId: Number(product?.artistId ?? product?.artist?.id ?? 0) || 0,
                  artistName,
                  category: { id: categoryId, name: String(categoryName) },
                  imageUrl: product?.imageUrl ?? undefined,
                  createdAt: String(product?.createdAt ?? new Date().toISOString()),
                  updatedAt: String(product?.updatedAt ?? product?.createdAt ?? new Date().toISOString()),
                }

                if (!id) {
                  return null
                }

                return { product: normalisedProduct, quantity }
              })
              .filter(Boolean) as CartItem[]
          : []

        setItems(safeItems)
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("kala_kriti_cart", JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        )
      }

      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }]
    })
  }

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
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
