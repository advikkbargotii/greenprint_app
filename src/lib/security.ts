/**
 * Security utilities for input validation, sanitization, and threat detection
 */

import { z } from 'zod'
import { logSecurityEvent } from './monitoring'

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
}

// Request sanitization options
interface SanitizationOptions {
  allowHtml?: boolean
  maxLength?: number
  blacklist?: string[]
}

// Security event types
export type SecurityEventType = 'sql_injection' | 'xss_attempt' | 'rate_limit_exceeded' | 'invalid_input'

/**
 * Enhanced input sanitization
 */
export class InputSanitizer {
  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /('|(\\')|(;)|(\|)|(\*)|(%)|(<)|(>)|(\{)|(\}))/gi,
    /((\%3C)|(<))script((\%3E)|(>))/gi,
    /((\%3C)|(<))\/script((\%3E)|(>))/gi,
  ]

  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]

  private static readonly SUSPICIOUS_PATTERNS = [
    /\.\.\//g, // Directory traversal
    /\/etc\/passwd/gi,
    /\/proc\/self\/environ/gi,
    /cmd\.exe/gi,
    /powershell/gi,
  ]

  /**
   * Sanitize and validate input string
   */
  static sanitize(
    input: string,
    options: SanitizationOptions = {}
  ): { sanitized: string; threats: string[] } {
    const threats: string[] = []
    let sanitized = input

    // Check for SQL injection attempts
    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        threats.push('sql_injection')
        logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          details: { 
            threat: 'sql_injection_attempt',
            input: input.substring(0, 100),
            pattern: pattern.toString()
          }
        })
      }
    }

    // Check for XSS attempts
    if (!options.allowHtml) {
      for (const pattern of this.XSS_PATTERNS) {
        if (pattern.test(input)) {
          threats.push('xss_attempt')
          logSecurityEvent({
            type: 'suspicious_activity',
            severity: 'high',
            details: { 
              threat: 'xss_attempt',
              input: input.substring(0, 100),
              pattern: pattern.toString()
            }
          })
        }
      }
      // Remove HTML tags if not allowed
      sanitized = sanitized.replace(/<[^>]*>/g, '')
    }

    // Check for suspicious patterns
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        threats.push('suspicious_activity')
        logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          details: { 
            threat: 'suspicious_pattern',
            input: input.substring(0, 100),
            pattern: pattern.toString()
          }
        })
      }
    }

    // Apply length limit
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
      threats.push('length_exceeded')
    }

    // Apply blacklist
    if (options.blacklist) {
      for (const banned of options.blacklist) {
        if (sanitized.toLowerCase().includes(banned.toLowerCase())) {
          sanitized = sanitized.replace(new RegExp(banned, 'gi'), '[FILTERED]')
          threats.push('blacklisted_content')
        }
      }
    }

    // HTML encode remaining special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return { sanitized, threats }
  }

  /**
   * Validate and sanitize object properties
   */
  static sanitizeObject<T extends Record<string, any>>(
    obj: T,
    options: SanitizationOptions = {}
  ): { sanitized: T; threats: Record<string, string[]> } {
    const sanitized = { ...obj }
    const threats: Record<string, string[]> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const result = this.sanitize(value, options)
        sanitized[key] = result.sanitized
        if (result.threats.length > 0) {
          threats[key] = result.threats
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const result = this.sanitizeObject(value, options)
        sanitized[key] = result.sanitized
        if (Object.keys(result.threats).length > 0) {
          threats[key] = Object.values(result.threats).flat()
        }
      }
    }

    return { sanitized, threats }
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()

  /**
   * Check if request should be rate limited
   */
  static checkLimit(
    identifier: string,
    config: RateLimitConfig
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Clean old entries
    this.cleanup(windowStart)
    
    const current = this.requests.get(identifier)
    
    if (!current || current.resetTime < now) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      })
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }
    
    if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        details: {
          identifier,
          attempts: current.count,
          limit: config.maxRequests,
          windowMs: config.windowMs
        }
      })
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }
    
    // Increment count
    current.count++
    this.requests.set(identifier, current)
    
    return {
      allowed: true,
      remaining: config.maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  /**
   * Clean up old rate limit entries
   */
  private static cleanup(cutoff: number) {
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < cutoff) {
        this.requests.delete(key)
      }
    }
  }
}

/**
 * Enhanced Zod schemas with security validation
 */
export const secureString = (options: SanitizationOptions = {}) =>
  z.string().transform((val, ctx) => {
    const result = InputSanitizer.sanitize(val, options)
    
    if (result.threats.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Security threats detected: ${result.threats.join(', ')}`,
      })
    }
    
    return result.sanitized
  })

export const secureEmail = z.string().email().transform((val, ctx) => {
  const result = InputSanitizer.sanitize(val, { maxLength: 254 })
  
  if (result.threats.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid email format or security threats detected',
    })
  }
  
  return result.sanitized
})

export const secureUrl = z.string().url().transform((val, ctx) => {
  const result = InputSanitizer.sanitize(val, { maxLength: 2048 })
  
  // Additional URL security checks
  const suspiciousProtocols = ['javascript:', 'data:', 'vbscript:']
  const lowercaseUrl = val.toLowerCase()
  
  for (const protocol of suspiciousProtocols) {
    if (lowercaseUrl.startsWith(protocol)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Suspicious URL protocol detected',
      })
    }
  }
  
  if (result.threats.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Security threats detected in URL',
    })
  }
  
  return result.sanitized
})

/**
 * CSRF token utilities
 */
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32
  
  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(this.TOKEN_LENGTH)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  /**
   * Validate CSRF token
   */
  static validateToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
      return false
    }
    
    // Constant-time comparison to prevent timing attacks
    if (token.length !== expectedToken.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
    }
    
    return result === 0
  }
}

/**
 * Content validation utilities
 */
export const validateAndSanitizeContent = (
  content: unknown,
  schema: z.ZodSchema,
  options: SanitizationOptions = {}
) => {
  try {
    // First sanitize if it's an object
    if (typeof content === 'object' && content !== null) {
      const sanitizationResult = InputSanitizer.sanitizeObject(
        content as Record<string, any>,
        options
      )
      
      if (Object.keys(sanitizationResult.threats).length > 0) {
        logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          details: {
            threats: sanitizationResult.threats,
            sanitized: true
          }
        })
      }
      
      content = sanitizationResult.sanitized
    }
    
    // Then validate with schema
    const result = schema.parse(content)
    return { success: true, data: result, error: null }
  } catch (error) {
    logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'low',
      details: {
        error: 'validation_failed',
        content: typeof content === 'string' ? content.substring(0, 100) : 'object'
      }
    })
    
    return { 
      success: false, 
      data: null, 
      error: error instanceof z.ZodError ? error.errors : 'Validation failed' 
    }
  }
}

export { InputSanitizer, RateLimiter, CSRFProtection }
