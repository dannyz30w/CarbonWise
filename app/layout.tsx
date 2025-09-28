import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CARBONWISE - Advanced Carbon Footprint Calculator",
  description:
    "Calculate your personal carbon footprint with scientific precision. Get personalized recommendations and track your progress toward carbon neutrality.",
  generator: "v0.app",
  keywords: ["carbon footprint", "climate change", "sustainability", "environmental impact", "EPA data"],
  authors: [{ name: "Danny Zheng" }],
  creator: "Danny Zheng",
  openGraph: {
    title: "CARBONWISE - Advanced Carbon Footprint Calculator",
    description: "Calculate your personal carbon footprint with scientific precision",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
