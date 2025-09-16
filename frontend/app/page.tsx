import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Palette, Users, ShoppingBag } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6 text-balance">
              Discover Extraordinary
              <span className="block">Artworks</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Connect with talented artists and find unique pieces that speak to your soul. Every artwork tells a story,
              every purchase supports creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/artworks">
                  Browse Artworks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/register">Join as Artist</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Why Choose Kala-Kriti?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're more than just a marketplace - we're a community that celebrates creativity and connects art
                lovers with exceptional works.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Curated Collection</h3>
                  <p className="text-muted-foreground text-sm">
                    Every artwork is carefully selected to ensure quality and uniqueness. Discover pieces that inspire
                    and captivate.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Support Artists</h3>
                  <p className="text-muted-foreground text-sm">
                    Your purchase directly supports independent artists and helps them continue creating beautiful
                    works.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center artwork-card-hover">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure Shopping</h3>
                  <p className="text-muted-foreground text-sm">
                    Shop with confidence knowing your transactions are secure and your artworks are carefully packaged.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Your Art Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of art enthusiasts who have found their perfect pieces on Kala-Kriti.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/artworks">Explore Collection</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
