// Cart management utilities
import type { CartItem, Product } from "./types"

const CART_KEY = "kalakriti_cart"

export class CartService {
  static getCart(): CartItem[] {
    if (typeof window === "undefined") return []
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  }

  static saveCart(cart: CartItem[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }

  static addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart()
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ product, quantity })
    }

    this.saveCart(cart)
  }

  static removeFromCart(productId: number): void {
    const cart = this.getCart()
    const updatedCart = cart.filter((item) => item.product.id !== productId)
    this.saveCart(updatedCart)
  }

  static updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart()
    const item = cart.find((item) => item.product.id === productId)

    if (item) {
      item.quantity = quantity
      this.saveCart(cart)
    }
  }

  static clearCart(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(CART_KEY)
  }

  static getCartTotal(): number {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  static getCartCount(): number {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  }
}
