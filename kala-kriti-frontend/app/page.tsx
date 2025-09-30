import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Users, Award, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Where Art Meets
            <br />
            <span className="text-gray-500">Exceptional Design</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto text-pretty">
            Discover extraordinary artworks from talented artists worldwide. Transform your space with pieces that speak
            to your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/artworks">
                Explore Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Curated Excellence Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Curated Excellence</h2>
            <p className="text-gray-600 leading-relaxed">
              Every piece in our collection is carefully selected for its artistic merit and craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-6">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Original Artworks</h3>
              <p className="text-gray-600 leading-relaxed">
                Authentic pieces created by passionate artists, each with its own unique story and character.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Talented Artists</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect directly with artists and discover the inspiration behind their creative process.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Every artwork is verified for authenticity and quality before joining our marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Collection Today</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join thousands of art enthusiasts who have found their perfect pieces through Kala-Kriti.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
