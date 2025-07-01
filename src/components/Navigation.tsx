'use client'

import { SignInButton, useUser, UserButton } from '@clerk/nextjs'

interface NavigationProps {
  currentPage: 'landing' | 'dashboard' | 'integrations'
  onNavigate: (page: 'landing' | 'dashboard' | 'integrations') => void
  showAuthenticatedNav?: boolean
}

export default function Navigation({ 
  currentPage, 
  onNavigate, 
  showAuthenticatedNav = true 
}: NavigationProps) {
  const { isSignedIn } = useUser()

  return (
    <header className="fixed top-0 left-0 w-full p-4 gp-z-nav">
      <div className="gp-nav-container overflow-hidden">
        <div className="flex items-center justify-between h-full px-8 relative">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="gp-logo transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-transparent border-0 p-0"
              aria-label="Navigate to home page"
            >
              <span className="gp-logo-green">Green</span>
              <span className="gp-logo-white">Print</span>
            </button>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {isSignedIn && showAuthenticatedNav ? (
              <>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`gp-nav-button px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    currentPage === 'dashboard' 
                      ? 'bg-green-600/80 text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={currentPage === 'dashboard' ? 'page' : undefined}
                  aria-label="Navigate to dashboard"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => onNavigate('integrations')}
                  className={`gp-nav-button px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    currentPage === 'integrations' 
                      ? 'bg-green-600/80 text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={currentPage === 'integrations' ? 'page' : undefined}
                  aria-label="Navigate to integrations"
                >
                  Integrations
                </button>
                <div className="ml-2">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "bg-gray-800 border-gray-700",
                        userButtonPopoverActionButton: "text-white hover:bg-gray-700"
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button 
                  className="gp-btn-primary gp-nav-button w-[120px] h-[34px] overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-95"
                  aria-label="Sign in to get started"
                >
                  Get Started
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
