// Core types for GreenPrint - keeping it simple!

export interface EmissionData {
  id: string
  userId: string
  projectId: string
  source: 'github' | 'vercel' | 'netlify' | 'openai' | 'gemini' | 'other'
  co2kg: number
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface Project {
  id: string
  userId: string
  name: string
  githubRepo?: string
  vercelProjectId?: string
  totalEmissions: number
  createdAt: string
}

export interface Integration {
  id: string
  userId: string
  type: 'github' | 'vercel' | 'netlify' | 'openai' | 'gemini'
  connected: boolean
  settings?: Record<string, unknown>
}

export interface DashboardData {
  totalEmissions: number
  weeklyEmissions: number
  reduction: number
  greenScore: number
  monthlyTrend: number
  weeklyData: { day: string; emissions: number }[]
  emissionsSources: { name: string; value: number; color: string; icon: string }[]
  topProjects: Project[]
  recentEmissions: EmissionData[]
  suggestions: string[]
}
