'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useState, lazy, Suspense } from 'react'
import Navigation from '@/components/Navigation'
import LandingPage from '@/components/LandingPage'
import LoadingSpinner from '@/components/LoadingSpinner'

// Lazy load heavy components
const Dashboard = lazy(() => import('@/components/Dashboard'))
const Integrations = lazy(() => import('@/components/Integrations'))

type Page = 'landing' | 'dashboard' | 'integrations'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
            <Dashboard onNavigate={setCurrentPage} />
          </Suspense>
        )
      case 'integrations':
        return (
          <Suspense fallback={<LoadingSpinner message="Loading integrations..." />}>
            <Integrations onNavigate={setCurrentPage} />
          </Suspense>
        )
      default:
        return <LandingPage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen gp-bg-primary">
      <SignedOut>
        <LandingPage onNavigate={setCurrentPage} />
      </SignedOut>
      
      <SignedIn>
        <Navigation 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        
        <div className="gp-content-padding">
          {renderPage()}
        </div>
      </SignedIn>
    </div>
  )
}
