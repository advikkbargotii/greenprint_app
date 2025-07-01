import { z } from 'zod'

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim(),
  githubRepo: z.string()
    .regex(/^[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+$/, 'Invalid GitHub repository format (owner/repo)')
    .optional()
    .or(z.literal('')),
  vercelProjectId: z.string()
    .min(1, 'Vercel project ID must not be empty')
    .optional()
    .or(z.literal(''))
})

export const updateProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim()
    .optional(),
  githubRepo: z.string()
    .regex(/^[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+$/, 'Invalid GitHub repository format (owner/repo)')
    .optional()
    .or(z.literal('')),
  vercelProjectId: z.string()
    .min(1, 'Vercel project ID must not be empty')
    .optional()
    .or(z.literal(''))
})

// Emission data validation
export const createEmissionSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  source: z.enum(['github', 'vercel', 'netlify', 'openai', 'gemini', 'other']),
  co2kg: z.number().positive('CO2 emissions must be positive'),
  metadata: z.record(z.unknown()).optional()
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
