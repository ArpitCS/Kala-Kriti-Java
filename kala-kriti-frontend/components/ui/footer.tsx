import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-display font-bold tracking-tight">Kala-Kriti</div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover and collect exceptional artworks from talented artists worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium">Explore</h3>
            <div className="space-y-2 text-sm">
              <Link href="/products" className="block text-muted-foreground hover:text-foreground transition-colors">
                All Artworks
              </Link>
              <Link href="/artists" className="block text-muted-foreground hover:text-foreground transition-colors">
                Featured Artists
              </Link>
              <Link href="/categories" className="block text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
            </div>
          </div>

          {/* For Artists */}
          <div className="space-y-4">
            <h3 className="font-medium">For Artists</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/artist/register"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Join as Artist
              </Link>
              <Link
                href="/artist/dashboard"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Artist Dashboard
              </Link>
              <Link
                href="/artist/guide"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Selling Guide
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-medium">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Kala-Kriti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
