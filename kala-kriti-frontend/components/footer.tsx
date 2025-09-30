import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Kala-Kriti</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Discover and collect exceptional artworks from talented artists worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artworks" className="text-gray-600 hover:text-black">
                  All Artworks
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-gray-600 hover:text-black">
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-black">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Artists</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/register?role=artist" className="text-gray-600 hover:text-black">
                  Join as Artist
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-black">
                  Artist Dashboard
                </Link>
              </li>
              <li>
                <Link href="/selling-guide" className="text-gray-600 hover:text-black">
                  Selling Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-black">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-black">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
          © 2025 Kala-Kriti. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
