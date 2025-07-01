'use client'

import Navigation from '@/components/Navigation'
import HeroSection from './HeroSection'
import FeatureCarousel from './FeatureCarousel'
import StatsSection from './StatsSection'
import TestimonialSection from './TestimonialSection'

interface Props {
  onNavigate: (page: 'dashboard' | 'integrations' | 'landing') => void
  currentPage?: 'landing' | 'dashboard' | 'integrations'
}

export default function LandingPage({ onNavigate, currentPage = 'landing' }: Props) {

  return (
    <div className="min-h-screen gp-bg-primary">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage}
        onNavigate={onNavigate}
        showAuthenticatedNav={true}
      />

      {/* Hero */}
      <HeroSection onNavigate={onNavigate} />

      {/* Features */}
      <FeatureCarousel />

      {/* Social Proof Section */}
      <StatsSection />
      
      {/* Testimonial Section */}
      <TestimonialSection />
    </div>
  )
}
