import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { Inter } from 'next/font/google'

// Load primary font (must assign font loader result to a const at module scope)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Kala-Kriti - Where Art Meets Exceptional Design",
  description:
    "Discover extraordinary artworks from talented artists worldwide. Transform your space with pieces that speak to your soul.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
