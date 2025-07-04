import { z } from 'zod'
import { secureString } from './security'

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string()
    .transform(val => val.trim())
    .pipe(secureString({ maxLength: 100 }))
    .refine(val => val.length >= 1, 'Project name is required')
    .refine(val => val.length <= 100, 'Project name must be less than 100 characters'),
  githubRepo: z.string()
    .refine(val => /^[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+$/.test(val), 'Invalid GitHub repository format (owner/repo)')
    .pipe(secureString({ maxLength: 255 })),
  vercelProjectId: z.string()
    .pipe(secureString({ maxLength: 255 }))
    .optional()
    .or(z.literal(''))
})

export const updateProjectSchema = z.object({
  name: z.string()
    .transform(val => val.trim())
    .pipe(secureString({ maxLength: 100 }))
    .refine(val => val.length >= 1, 'Project name is required')
    .refine(val => val.length <= 100, 'Project name must be less than 100 characters')
    .optional(),
  githubRepo: z.string()
    .refine(val => /^[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+$/.test(val), 'Invalid GitHub repository format (owner/repo)')
    .pipe(secureString({ maxLength: 255 }))
    .optional()
    .or(z.literal('')),
  vercelProjectId: z.string()
    .pipe(secureString({ maxLength: 255 }))
    .optional()
    .or(z.literal(''))
})

// Emission data validation
export const createEmissionSchema = z.object({
  projectId: secureString({ maxLength: 255 })
    .refine(val => val.length >= 1, 'Project ID is required'),
  source: z.enum(['github', 'vercel', 'netlify', 'openai', 'gemini', 'other']),
  co2kg: z.number().positive('CO2 emissions must be positive').max(999999, 'CO2 emissions value too large'),
  metadata: z.record(secureString({ maxLength: 1000 })).optional()
})

// Integration validation
export const connectIntegrationSchema = z.object({
  type: z.enum(['github', 'vercel', 'netlify', 'openai', 'gemini']),
  settings: z.record(z.unknown()).optional()
})

// Common validation helpers
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
})

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
})

// Type exports for use in components
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateEmissionInput = z.infer<typeof createEmissionSchema>
export type ConnectIntegrationInput = z.infer<typeof connectIntegrationSchema>
