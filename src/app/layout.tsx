import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from "next/font/google"
import ErrorBoundary from '@/components/ErrorBoundary'
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GreenPrint - Developer Carbon Tracker",
  description: "Track and reduce your development carbon footprint",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geist.className} antialiased`}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}
