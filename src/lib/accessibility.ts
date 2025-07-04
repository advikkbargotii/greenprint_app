/**
 * Accessibility utility functions and constants
 * Provides helpers for ARIA attributes, keyboard navigation, and screen reader support
 */

// ARIA live region announcements
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', priority)
  announcer.setAttribute('aria-atomic', 'true')
  announcer.setAttribute('class', 'sr-only')
  announcer.textContent = message
  
  document.body.appendChild(announcer)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer)
  }, 1000)
}

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusableElements.length === 0) return
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.focus()
    }
  }
  
  element.addEventListener('keydown', handleKeyDown)
  firstElement.focus()
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void
) => {
  switch (event.key) {
    case 'Enter':
      if (onEnter) {
        event.preventDefault()
        onEnter()
      }
      break
    case ' ':
      if (onSpace) {
        event.preventDefault()
        onSpace()
      }
      break
    case 'Escape':
      if (onEscape) {
        event.preventDefault()
        onEscape()
      }
      break
  }
}

// ARIA attributes generators
export const generateAriaDescribedBy = (id: string) => `${id}-description`
export const generateAriaLabelledBy = (id: string) => `${id}-label`

// Skip link component data
export const skipLinkData = {
  mainContent: 'main-content',
  navigation: 'main-navigation',
  skipToMain: 'Skip to main content',
  skipToNav: 'Skip to navigation'
}

// Color contrast utilities
export const colorContrastRatios = {
  AANormal: 4.5,
  AALarge: 3,
  AAANormal: 7,
  AAALarge: 4.5
}

// Screen reader utilities
export const screenReaderOnly = 'sr-only'
export const notScreenReader = 'not-sr-only'

// Common ARIA patterns
export const ariaPatterns = {
  // For buttons that control other elements
  expandedButton: (isExpanded: boolean) => ({
    'aria-expanded': isExpanded,
    'aria-haspopup': 'true' as const
  }),
  
  // For form fields with errors
  formField: (hasError: boolean, errorId?: string) => ({
    'aria-invalid': hasError,
    'aria-describedby': hasError && errorId ? errorId : undefined
  }),
  
  // For loading states
  loadingRegion: (isLoading: boolean) => ({
    'aria-busy': isLoading,
    'aria-live': 'polite' as const
  })
}

// Reduced motion preferences
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast mode detection
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}
