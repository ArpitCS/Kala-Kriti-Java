"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const { isAuthenticated, username, userRole, logout, isArtist, isAdmin } = useAuth()
  const { count } = useCart()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/artworks?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/logo-black.png" alt="Kala-Kriti" width={120} height={40} className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/artworks" className="text-sm font-medium hover:underline">
              Artworks
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:underline">
              Categories
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search artworks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {count > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{username}</span>
                      <span className="text-xs text-gray-500">@{username}</span>
                      <Badge variant="outline" className="mt-1 w-fit text-xs">
                        {userRole}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/cart")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View cart
                  </DropdownMenuItem>

                  {(isArtist || isAdmin) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-gray-500">
                        {isArtist ? "ARTIST" : "ADMIN"}
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      {isArtist && (
                        <>
                          <DropdownMenuItem onClick={() => router.push("/dashboard/products/new")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push("/dashboard/products")}>
                            <Package className="mr-2 h-4 w-4" />
                            Manage products
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Sign in
              </Button>
              <Button onClick={() => router.push("/auth/register")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
