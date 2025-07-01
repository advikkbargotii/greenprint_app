import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        {children}
      </div>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions for common test patterns
export const createMockProject = (overrides = {}) => ({
  id: '1',
  name: 'Test Project',
  emissions: 100,
  trend: 'down' as const,
  githubRepo: 'user/test-project',
  lastUpdated: new Date().toISOString(),
  ...overrides,
})

export const createMockIntegration = (overrides = {}) => ({
  id: 'test',
  name: 'Test Integration',
  status: 'connected' as const,
  icon: '🧪',
  description: 'Test integration for testing',
  ...overrides,
})

export const createMockSuggestion = (overrides = {}) => ({
  id: '1',
  title: 'Test Suggestion',
  description: 'A test optimization suggestion',
  impact: 'Medium' as const,
  co2Savings: 5.0,
  type: 'general' as const,
  ...overrides,
})
