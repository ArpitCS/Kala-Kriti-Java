"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Users as UsersIcon,
  ClipboardList,
  Palette,
  PlusCircle,
  UserCircle,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { CartSidebar } from "@/components/ui/cart-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username : ""
  const initials = user
    ? `${(user.firstName?.[0] ?? user.username?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`.trim() ||
      (user.username ? user.username.slice(0, 2).toUpperCase() : "?")
    : "?"
  const roleLabel = user ? `${user.role.charAt(0)}${user.role.slice(1).toLowerCase()}` : ""
  const usernameLabel = user?.username ? `@${user.username}` : ""

  type MenuLink = { href: string; label: string; icon: LucideIcon }

  const adminLinks = useMemo<MenuLink[]>(
    () => [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/users", label: "User management", icon: UsersIcon },
    ],
    [],
  )

  const artistLinks = useMemo<MenuLink[]>(
    () => [
      { href: "/artist/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/artist/products/new", label: "Add product", icon: PlusCircle },
      { href: "/artist/products", label: "Manage products", icon: Palette },
    ],
    [],
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-display font-bold tracking-tight">Kala-Kriti</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Artworks
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Categories
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search artworks..."
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-transparent hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Open profile menu"
                  aria-haspopup="menu"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 z-[9999]">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {initials || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold leading-tight capitalize">{displayName}</p>
                        {usernameLabel && <p className="text-xs text-muted-foreground">{usernameLabel}</p>}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <div className="px-3 pb-2 space-y-1 text-xs text-muted-foreground">
                    {user.email && <p className="truncate">{user.email}</p>}
                    {user.role && (
                      <Badge variant="outline" className="capitalize">
                        {roleLabel}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 w-full">
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cart" className="flex items-center gap-2 w-full">
                        <ShoppingCart className="h-4 w-4" />
                        View cart
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Admin
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {adminLinks.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href} className="flex items-center gap-2 w-full">
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  )}
                  {user.role === "ARTIST" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Artist
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {artistLinks.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href} className="flex items-center gap-2 w-full">
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            <CartSidebar />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="search" placeholder="Search artworks..." className="pl-10 bg-muted/50 border-0" />
              </div>
              <Link href="/products" className="text-sm font-medium py-2">
                Artworks
              </Link>
              <Link href="/categories" className="text-sm font-medium py-2">
                Categories
              </Link>
              {user ? (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-1">
                    <p className="text-sm font-semibold capitalize">{displayName}</p>
                    {usernameLabel && <p className="text-xs text-muted-foreground">{usernameLabel}</p>}
                    {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                    {roleLabel && (
                      <Badge variant="outline" className="mt-2 capitalize">
                        {roleLabel}
                      </Badge>
                    )}
                  </div>
                  <Link href="/profile" className="text-sm font-medium py-2">
                    Profile
                  </Link>
                  <Link href="/cart" className="text-sm font-medium py-2">
                    View cart
                  </Link>
                  {user.role === "ADMIN" && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
                      {adminLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm font-medium py-1.5 flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {user.role === "ARTIST" && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Artist</p>
                      {artistLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm font-medium py-1.5 flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  <button onClick={logout} className="text-sm font-medium py-2 text-left text-destructive">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium py-2">
                    Sign in
                  </Link>
                  <Link href="/register" className="text-sm font-medium py-2">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
