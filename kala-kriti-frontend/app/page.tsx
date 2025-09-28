import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Users, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-balance mb-6">
            Where Art Meets
            <br />
            <span className="text-muted-foreground">Exceptional Design</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Discover extraordinary artworks from talented artists worldwide. Transform your space with pieces that speak
            to your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/products">
                Explore Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 bg-transparent" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Curated Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every piece in our collection is carefully selected for its artistic merit and craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Original Artworks</h3>
              <p className="text-muted-foreground">
                Authentic pieces created by passionate artists, each with its own unique story and character.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Talented Artists</h3>
              <p className="text-muted-foreground">
                Connect directly with artists and discover the inspiration behind their creative process.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Quality Assured</h3>
              <p className="text-muted-foreground">
                Every artwork is verified for authenticity and quality before joining our marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Start Your Collection Today</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of art enthusiasts who have found their perfect pieces through Kala-Kriti.
          </p>
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
