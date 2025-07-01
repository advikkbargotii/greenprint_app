import { DashboardData, Project, Integration } from '@/types'

// Simple API client for GreenPrint

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  return response.json()
}

interface CreateProjectData {
  name: string
  githubRepo?: string
  vercelProjectId?: string
}

// API methods
export const api = {
  // Dashboard
  getDashboard: () => apiRequest<DashboardData>('/dashboard'),
  
  // Projects
  getProjects: () => apiRequest<Project[]>('/projects'),
  createProject: (data: CreateProjectData) => apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Integrations
  getIntegrations: () => apiRequest<Integration[]>('/integrations'),
  connectIntegration: (type: string, data: Record<string, unknown>) => apiRequest<Integration>(`/integrations/${type}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
