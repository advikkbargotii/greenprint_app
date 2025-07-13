/**
 * Error Monitoring and Logging System
 * Provides comprehensive error tracking, performance monitoring, and security logging
 */

interface ErrorContext {
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  timestamp?: Date
  severity?: 'low' | 'medium' | 'high' | 'critical'
  tags?: Record<string, string>
  extra?: Record<string, any>
}

interface PerformanceMetrics {
  name: string
  startTime: number
  duration: number
  metadata?: Record<string, any>
}

interface SecurityEvent {
  type: 'auth_failure' | 'suspicious_activity' | 'rate_limit_exceeded' | 'unauthorized_access'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  ipAddress?: string
  userAgent?: string
  details: Record<string, any>
}

class ErrorMonitor {
  private isProduction: boolean
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = []
  private performanceMetrics: PerformanceMetrics[] = []
  private securityEvents: SecurityEvent[] = []

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.setupGlobalErrorHandlers()
  }

  /**
   * Log application errors with context
   */
  logError(error: Error, context: ErrorContext = {}) {
    const enhancedContext: ErrorContext = {
      ...context,
      timestamp: new Date(),
      severity: context.severity || 'medium',
      url: typeof window !== 'undefined' ? window.location.href : context.url,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : context.userAgent,
    }

    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: enhancedContext,
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error logged:', errorData)
    }

    // Queue error for batch processing
    this.errorQueue.push({ error, context: enhancedContext })

    // Send critical errors immediately
    if (enhancedContext.severity === 'critical') {
      this.flushErrors()
    }

    // Send to external monitoring service (Sentry, LogRocket, etc.)
    this.sendToMonitoringService(errorData)
  }

  /**
   * Log performance metrics
   */
  logPerformance(metrics: PerformanceMetrics) {
    this.performanceMetrics.push(metrics)
    
    if (!this.isProduction) {
      console.log('Performance metric:', metrics)
    }

    // Send performance data to monitoring service
    this.sendPerformanceData(metrics)
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: SecurityEvent) {
    const enhancedEvent = {
      ...event,
      timestamp: new Date(),
      ipAddress: event.ipAddress || this.getClientIP(),
      userAgent: event.userAgent || (typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'),
    }

    this.securityEvents.push(enhancedEvent)

    if (!this.isProduction) {
      console.warn('Security event:', enhancedEvent)
    }

    // Send security events immediately
    this.sendSecurityEvent(enhancedEvent)
  }

  /**
   * Track API errors specifically
   */
  logAPIError(
    endpoint: string,
    method: string,
    statusCode: number,
    error: Error,
    context: Partial<ErrorContext> = {}
  ) {
    const apiContext: ErrorContext = {
      ...context,
      severity: statusCode >= 500 ? 'high' : 'medium',
      tags: {
        endpoint,
        method,
        statusCode: statusCode.toString(),
        ...context.tags,
      },
    }

    this.logError(error, apiContext)
  }

  /**
   * Track user actions for analytics
   */
  logUserAction(action: string, details: Record<string, any> = {}) {
    const actionData = {
      action,
      details,
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    if (!this.isProduction) {
      console.log('User action:', actionData)
    }

    // Send to analytics service
    this.sendAnalytics(actionData)
  }

  /**
   * Measure and log function performance
   */
  measurePerformance<T>(
    name: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): T | Promise<T> {
    const startTime = performance.now()

    try {
      const result = fn()

      if (result instanceof Promise) {
        return result
          .then((value) => {
            this.logPerformance({
              name,
              startTime,
              duration: performance.now() - startTime,
              metadata,
            })
            return value
          })
          .catch((error) => {
            this.logPerformance({
              name: `${name}_error`,
              startTime,
              duration: performance.now() - startTime,
              metadata: { ...metadata, error: error.message },
            })
            throw error
          })
      } else {
        this.logPerformance({
          name,
          startTime,
          duration: performance.now() - startTime,
          metadata,
        })
        return result
      }
    } catch (error) {
      this.logPerformance({
        name: `${name}_error`,
        startTime,
        duration: performance.now() - startTime,
        metadata: { ...metadata, error: (error as Error).message },
      })
      throw error
    }
  }

  /**
   * Flush queued errors
   */
  private flushErrors() {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    // In production, send to monitoring service
    if (this.isProduction) {
      this.sendErrorBatch(errors)
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers() {
    if (typeof window !== 'undefined') {
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(
          new Error(`Unhandled promise rejection: ${event.reason}`),
          {
            severity: 'high',
            tags: { type: 'unhandled_promise_rejection' },
          }
        )
      })

      // Handle global errors
      window.addEventListener('error', (event) => {
        this.logError(
          new Error(event.message),
          {
            severity: 'high',
            tags: {
              type: 'global_error',
              filename: event.filename,
              lineno: event.lineno?.toString(),
              colno: event.colno?.toString(),
            },
          }
        )
      })
    }
  }

  /**
   * Get client IP address (when available)
   */
  private getClientIP(): string {
    // This would typically be set by your server or CDN
    return 'unknown'
  }

  /**
   * Send error to external monitoring service
   */
  private sendToMonitoringService(errorData: any) {
    // Implementation would integrate with Sentry, LogRocket, etc.
    // For now, we'll just log it
    if (this.isProduction) {
      // Example: Sentry.captureException(errorData)
      console.log('Would send to monitoring service:', errorData)
    }
  }

  /**
   * Send performance data to monitoring service
   */
  private sendPerformanceData(metrics: PerformanceMetrics) {
    if (this.isProduction) {
      // Example: Send to performance monitoring service
      console.log('Would send performance data:', metrics)
    }
  }

  /**
   * Send security event to monitoring service
   */
  private sendSecurityEvent(event: SecurityEvent) {
    if (this.isProduction) {
      // Example: Send to security monitoring service
      console.log('Would send security event:', event)
    }
  }

  /**
   * Send analytics data
   */
  private sendAnalytics(data: any) {
    if (this.isProduction) {
      // Example: Send to analytics service
      console.log('Would send analytics:', data)
    }
  }

  /**
   * Send batch of errors
   */
  private sendErrorBatch(errors: Array<{ error: Error; context: ErrorContext }>) {
    // Implementation for batch error sending
    console.log('Would send error batch:', errors)
  }
}

// Create singleton instance
export const errorMonitor = new ErrorMonitor()

// React Error Boundary integration
export const logReactError = (error: Error, errorInfo: { componentStack: string }) => {
  errorMonitor.logError(error, {
    severity: 'high',
    tags: { type: 'react_error_boundary' },
    extra: { componentStack: errorInfo.componentStack },
  })
}

// API error helper
export const logAPIError = (
  endpoint: string,
  method: string,
  statusCode: number,
  error: Error,
  context?: Partial<ErrorContext>
) => {
  errorMonitor.logAPIError(endpoint, method, statusCode, error, context)
}

// Performance measurement decorator
export const measurePerformance = <T>(
  name: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): T | Promise<T> => {
  return errorMonitor.measurePerformance(name, fn, metadata)
}

// User action tracking
export const logUserAction = (action: string, details?: Record<string, any>) => {
  errorMonitor.logUserAction(action, details)
}

// Security event logging
export const logSecurityEvent = (event: SecurityEvent) => {
  errorMonitor.logSecurityEvent(event)
}

export { ErrorMonitor, type ErrorContext, type PerformanceMetrics, type SecurityEvent }
