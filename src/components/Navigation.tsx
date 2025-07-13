'use client'

// Import Clerk authentication components for user management
// Clerk provides authentication, user management, and session handling
import { SignInButton, useUser, UserButton } from '@clerk/nextjs'

/**
 * Props interface for the Navigation component
 * This defines what data the Navigation component expects to receive
 */
interface NavigationProps {
  /** Current active page - used to highlight the active navigation item */
  currentPage: 'landing' | 'dashboard' | 'integrations'
  /** Function to handle navigation between pages - called when user clicks nav items */
  onNavigate: (page: 'landing' | 'dashboard' | 'integrations') => void
  /** Whether to show authenticated user navigation (optional, defaults to true) */
  showAuthenticatedNav?: boolean
}

/**
 * Navigation Component
 * 
 * This is the main navigation bar that appears at the top of every page.
 * It shows the GreenPrint logo and navigation links, plus user authentication.
 * 
 * Features:
 * - Responsive design that works on mobile and desktop
 * - Different navigation items based on user authentication status
 * - Accessibility support with proper ARIA labels
 * - Smooth hover animations and visual feedback
 * 
 * @param currentPage - The currently active page to highlight
 * @param onNavigate - Function called when user clicks navigation items
 * @param showAuthenticatedNav - Whether to show logged-in user navigation
 */
export default function Navigation({ 
  currentPage, 
  onNavigate, 
  showAuthenticatedNav = true 
}: NavigationProps) {
  // Get current user authentication status from Clerk
  // isSignedIn will be true if user is logged in, false otherwise
  const { isSignedIn } = useUser()

  return (
    // Main navigation header - fixed to top of screen and spans full width
    // Uses semantic <header> element for accessibility and proper document structure
    <header className="fixed top-0 left-0 w-full p-4 gp-z-nav" role="navigation" aria-label="Main navigation">
      {/* Navigation container with custom styling and background blur */}
      <div className="gp-nav-container overflow-hidden">
        {/* Inner flex container - spaces logo and navigation items */}
        <div className="flex items-center justify-between h-full px-8 relative">
          
          {/* LEFT SIDE: Logo Section */}
          <div className="flex items-center gap-3">
            {/* Clickable logo that navigates back to home page */}
            <button
              onClick={() => onNavigate('landing')}
              className="gp-logo transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-transparent border-0 p-0"
              aria-label="Navigate to home page"
            >
              {/* Logo text with different colors for 'Green' and 'Print' */}
              <span className="gp-logo-green">Green</span>
              <span className="gp-logo-white">Print</span>
            </button>
          </div>
          
          {/* RIGHT SIDE: Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Conditional rendering: Show different navigation based on user login status */}
            {isSignedIn && showAuthenticatedNav ? (
              // AUTHENTICATED USER NAVIGATION
              <>
                {/* Dashboard Navigation Button */}
                <button 
                  onClick={() => onNavigate('dashboard')}
                  // Use same styling as Get Started button with active state indication
                  className={`gp-btn-primary gp-nav-button w-[120px] h-[34px] overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-95 ${
                    currentPage === 'dashboard' 
                      ? 'ring-2 ring-white/50'  // Active page indicator
                      : ''
                  }`}
                  // Accessibility: Tell screen readers which page is current
                  aria-current={currentPage === 'dashboard' ? 'page' : undefined}
                  aria-label="Navigate to dashboard"
                >
                  Dashboard
                </button>
                
                {/* Integrations Navigation Button */}
                <button 
                  onClick={() => onNavigate('integrations')}
                  // Use same styling as Get Started button with active state indication
                  className={`gp-btn-primary gp-nav-button w-[120px] h-[34px] overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-95 ${
                    currentPage === 'integrations' 
                      ? 'ring-2 ring-white/50'  // Active page indicator
                      : ''
                  }`}
                  aria-current={currentPage === 'integrations' ? 'page' : undefined}
                  aria-label="Navigate to integrations"
                >
                  Integrations
                </button>
                
                {/* User Profile Button (provided by Clerk) */}
                <div className="ml-2">
                  <UserButton 
                    // Custom styling for Clerk's UserButton component
                    // Matches our app's dark theme
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",  // Size of user avatar
                        userButtonPopoverCard: "bg-gray-800 border-gray-700",  // Dropdown background
                        userButtonPopoverActionButton: "text-white hover:bg-gray-700"  // Dropdown button styling
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              // GUEST USER NAVIGATION (not logged in)
              // Show sign-in button wrapped in Clerk's SignInButton component
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
