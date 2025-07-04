import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from "next/font/google"
import ErrorBoundary from '@/components/ErrorBoundary'
import SkipLinks from '@/components/SkipLinks'
import '@/lib/accessibility-testing'
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GreenPrint - Developer Carbon Tracker",
  description: "Track and reduce your development carbon footprint",
  keywords: ["carbon footprint", "sustainability", "developer tools", "environmental impact", "green technology"],
  authors: [{ name: "GreenPrint Team" }],
  creator: "GreenPrint",
  robots: "index, follow",
  openGraph: {
    title: "GreenPrint - Developer Carbon Tracker",
    description: "Track and reduce your development carbon footprint",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenPrint - Developer Carbon Tracker",
    description: "Track and reduce your development carbon footprint",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://greenprint.dev'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#10b981" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`${geist.className} antialiased`}>
          <SkipLinks />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}
