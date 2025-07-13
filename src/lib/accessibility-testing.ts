/**
 * Accessibility testing utilities for development
 * Only runs in development mode to help catch accessibility issues early
 */

let axeCore: any = null

// Lazy load axe-core only in development
const loadAxe = async () => {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return null
  }
  
  if (!axeCore) {
    try {
      const axe = await import('@axe-core/react')
      axeCore = axe.default
      return axeCore
    } catch (error) {
      console.warn('Failed to load @axe-core/react:', error)
      return null
    }
  }
  
  return axeCore
}

/**
 * Initialize accessibility testing in development
 */
export const initAccessibilityTesting = async () => {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return
  }

  const axe = await loadAxe()
  if (axe) {
    const React = await import('react')
    const ReactDOM = await import('react-dom')
    
    axe(React, ReactDOM, 1000, {
      // Configure axe-core rules
      rules: {
        // Enable all rules
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-attributes': { enabled: true },
        'semantic-markup': { enabled: true },
      },
      // Tag filters
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    })
  }
}

/**
 * Manual accessibility audit for specific elements
 */
export const auditAccessibility = async (element?: Element) => {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return { violations: [], passes: [] }
  }

  try {
    // Use dynamic import to avoid bundling in production
    const { default: axe } = await import('axe-core')
    
    const results = await axe.run(element || document.body, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-attributes': { enabled: true },
        'semantic-markup': { enabled: true },
      },
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    })

    if (results.violations.length > 0) {
      console.group('🔴 Accessibility Violations Found')
      results.violations.forEach(violation => {
        console.error(`${violation.id}: ${violation.description}`)
        console.error('Affected elements:', violation.nodes)
        console.error('Help:', violation.helpUrl)
      })
      console.groupEnd()
    }

    if (results.passes.length > 0) {
      console.group('✅ Accessibility Checks Passed')
      console.log(`${results.passes.length} accessibility rules passed`)
      console.groupEnd()
    }

    return results
  } catch (error) {
    console.warn('Failed to run accessibility audit:', error)
    return { violations: [], passes: [] }
  }
}

/**
 * Check color contrast ratio
 */
export const checkColorContrast = (foreground: string, background: string): {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
} => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  if (!fg || !bg) {
    return { ratio: 0, wcagAA: false, wcagAAA: false }
  }

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b)
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b)

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                (Math.min(fgLuminance, bgLuminance) + 0.05)

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7
  }
}

/**
 * Keyboard navigation testing helpers
 */
export const testKeyboardNavigation = {
  /**
   * Test if element can be focused via keyboard
   */
  canFocus: (element: HTMLElement): boolean => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ]

    return focusableSelectors.some(selector => element.matches(selector))
  },

  /**
   * Get all focusable elements in order
   */
  getFocusableElements: (container: HTMLElement = document.body): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
    
    // Sort by tabindex
    return elements.sort((a, b) => {
      const aIndex = parseInt(a.getAttribute('tabindex') || '0')
      const bIndex = parseInt(b.getAttribute('tabindex') || '0')
      
      if (aIndex === 0 && bIndex === 0) return 0
      if (aIndex === 0) return 1
      if (bIndex === 0) return -1
      return aIndex - bIndex
    })
  },

  /**
   * Test keyboard navigation flow
   */
  testTabOrder: async (container: HTMLElement = document.body): Promise<string[]> => {
    const focusableElements = testKeyboardNavigation.getFocusableElements(container)
    const tabOrder: string[] = []

    for (const element of focusableElements) {
      element.focus()
      const activeElement = document.activeElement as HTMLElement
      
      if (activeElement === element) {
        const identifier = element.id || 
                          element.getAttribute('aria-label') || 
                          element.tagName.toLowerCase() + 
                          (element.className ? '.' + element.className.split(' ')[0] : '')
        tabOrder.push(identifier)
      }
    }

    return tabOrder
  }
}

/**
 * ARIA validation helpers
 */
export const validateARIA = {
  /**
   * Check if element has proper ARIA labels
   */
  hasProperLabeling: (element: HTMLElement): boolean => {
    const hasLabel = element.hasAttribute('aria-label') ||
                    element.hasAttribute('aria-labelledby') ||
                    element.querySelector('label[for="' + element.id + '"]') !== null

    return hasLabel
  },

  /**
   * Check if ARIA attributes are valid
   */
  hasValidARIA: (element: HTMLElement): { valid: boolean; issues: string[] } => {
    const issues: string[] = []
    const attributes = element.attributes

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      
      if (attr.name.startsWith('aria-')) {
        // Check for common ARIA mistakes
        if (attr.name === 'aria-expanded' && !['true', 'false'].includes(attr.value)) {
          issues.push(`Invalid aria-expanded value: ${attr.value}`)
        }
        
        if (attr.name === 'aria-hidden' && !['true', 'false'].includes(attr.value)) {
          issues.push(`Invalid aria-hidden value: ${attr.value}`)
        }
        
        if (attr.name === 'aria-live' && !['polite', 'assertive', 'off'].includes(attr.value)) {
          issues.push(`Invalid aria-live value: ${attr.value}`)
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }
}

// Development-only accessibility checker
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Initialize accessibility testing
  initAccessibilityTesting()

  // Add global accessibility debugging helpers
  ;(window as any).a11y = {
    audit: auditAccessibility,
    checkColorContrast,
    testKeyboardNavigation,
    validateARIA
  }

  console.log('🔍 Accessibility testing enabled. Use window.a11y to run manual tests.')
}
