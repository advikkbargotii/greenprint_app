import { create } from 'zustand'
import { DashboardData, Project, Integration } from '@/types'

interface AppState {
  // Data
  dashboardData: DashboardData | null
  projects: Project[]
  integrations: Integration[]
  
  // UI State
  loading: boolean
  ecoMode: boolean
  
  // Actions
  setDashboardData: (data: DashboardData) => void
  setProjects: (projects: Project[]) => void
  setIntegrations: (integrations: Integration[]) => void
  setLoading: (loading: boolean) => void
  toggleEcoMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  dashboardData: null,
  projects: [],
  integrations: [],
  loading: false,
  ecoMode: false,
  
  // Actions
  setDashboardData: (data) => set({ dashboardData: data }),
  setProjects: (projects) => set({ projects }),
  setIntegrations: (integrations) => set({ integrations }),
  setLoading: (loading) => set({ loading }),
  toggleEcoMode: () => set((state) => ({ ecoMode: !state.ecoMode })),
}))
