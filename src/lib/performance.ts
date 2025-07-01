// Performance monitoring utilities for GreenPrint

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1.8, poor: 3.0 }, // First Contentful Paint
  LCP: { good: 2.5, poor: 4.0 }, // Largest Contentful Paint  
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
}

export function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Performance observer for Core Web Vitals
export function observePerformance(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return

  // Observe navigation timing
  if ('PerformanceObserver' in window) {
    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            callback({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime)
            })
          }
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          callback({
            name: 'LCP',
            value: lastEntry.startTime,
            rating: getRating('LCP', lastEntry.startTime)
          })
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const perfEntry = entry as PerformanceEventTiming
          callback({
            name: 'FID',
            value: perfEntry.processingStart - perfEntry.startTime,
            rating: getRating('FID', perfEntry.processingStart - perfEntry.startTime)
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const layoutEntry = entry as LayoutShift
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value
            callback({
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue)
            })
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

    } catch (error) {
      console.warn('Performance observer not supported:', error)
    }
  }
}

// Measure custom performance metrics
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  return new Promise(async (resolve) => {
    const start = performance.now()
    
    try {
      const result = await fn()
      const duration = performance.now() - start
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
      }
      
      resolve({ result, duration })
    } catch (error) {
      const duration = performance.now() - start
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  })
}

// Add type definitions for performance entries
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

// Debounce function for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
