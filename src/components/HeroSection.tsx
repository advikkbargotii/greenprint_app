'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Github } from 'lucide-react'

interface HeroSectionProps {
  onNavigate: (page: 'dashboard' | 'integrations' | 'landing') => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { isSignedIn } = useUser()

  return (
    <section className="pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-white">Track Your Code&apos;s</span>
          <span 
            className="block"
            style={{
              background: 'linear-gradient(to bottom, #FFFFFF, #B8891C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Carbon Footprint
          </span>
        </h1>
        
        <p className="text-xl mb-8 text-white">
          Instantly see how your code impacts the planet—and how to fix it.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          {isSignedIn ? (
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold text-lg flex items-center gap-2"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold text-lg flex items-center gap-2">
                Start Tracking
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          )}
          
          <button 
            className="border border-gray-600 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold text-lg flex items-center gap-2"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Github className="w-5 h-5" />
            View Demo
          </button>
        </div>
      </div>
    </section>
  )
}
