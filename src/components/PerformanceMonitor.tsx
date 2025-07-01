'use client'

import { useEffect } from 'react'
import { observePerformance, type PerformanceMetric } from '@/lib/performance'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only monitor performance in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_MONITOR_PERFORMANCE === 'true') {
      const handleMetric = (metric: PerformanceMetric) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
        }
        
        // In production, you could send metrics to analytics service
        // Analytics.track('Core Web Vital', {
        //   metric: metric.name,
        //   value: metric.value,
        //   rating: metric.rating,
        //   url: window.location.pathname
        // })
      }

      observePerformance(handleMetric)
    }
  }, [])

  // This component doesn't render anything
  return null
}
