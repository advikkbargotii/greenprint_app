'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, ApiError } from '@/lib/api'
import { DashboardData, Project, Integration } from '@/types'

// Generic data fetching hook with optimizations
function useApiData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize the fetch function to prevent unnecessary re-renders
  const memoizedFetchFn = useCallback(fetchFn, dependencies)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await memoizedFetchFn()
      setData(result)
    } catch (err) {
      console.error('API Error:', err)
      if (err instanceof ApiError) {
        setError(`${err.message} (${err.status})`)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [memoizedFetchFn])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Dashboard data hook
export function useDashboard() {
  return useApiData<DashboardData>(() => api.getDashboard())
}

// Projects data hook
export function useProjects() {
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  
  const { data: projects, loading, error, refetch } = useApiData<Project[]>(
    () => api.getProjects()
  )

  const createProject = useCallback(async (projectData: {
    name: string
    githubRepo?: string
    vercelProjectId?: string
  }) => {
    try {
      setCreating(true)
      setCreateError(null)
      const newProject = await api.createProject(projectData)
      await refetch() // Refresh the projects list
      return newProject
    } catch (err) {
      console.error('Create project error:', err)
      if (err instanceof ApiError) {
        setCreateError(`${err.message} (${err.status})`)
      } else {
        setCreateError('Failed to create project')
      }
      throw err
    } finally {
      setCreating(false)
    }
  }, [refetch])

  return {
    projects,
    loading,
    error,
    refetch,
    createProject,
    creating,
    createError
  }
}

// Integrations data hook
export function useIntegrations() {
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  
  const { data: integrations, loading, error, refetch } = useApiData<Integration[]>(
    () => api.getIntegrations()
  )

  const connectIntegration = useCallback(async (
    type: string, 
    data: Record<string, unknown>
  ) => {
    try {
      setConnecting(true)
      setConnectError(null)
      const integration = await api.connectIntegration(type, data)
      await refetch() // Refresh the integrations list
      return integration
    } catch (err) {
      console.error('Connect integration error:', err)
      if (err instanceof ApiError) {
        setConnectError(`${err.message} (${err.status})`)
      } else {
        setConnectError('Failed to connect integration')
      }
      throw err
    } finally {
      setConnecting(false)
    }
  }, [refetch])

  return {
    integrations,
    loading,
    error,
    refetch,
    connectIntegration,
    connecting,
    connectError
  }
}
