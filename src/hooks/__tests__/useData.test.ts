import { describe, it, expect } from 'vitest'

// For now, we'll create simple tests that verify the hooks exist
// Full integration testing would require more complex setup
describe('useData hooks', () => {
  it('useData hooks are available for import', async () => {
    // Test that the hooks can be imported without error
    const { useDashboard, useProjects } = await import('../useData')
    
    expect(typeof useDashboard).toBe('function')
    expect(typeof useProjects).toBe('function')
  })
  
  it('hooks have expected function signatures', async () => {
    const { useDashboard, useProjects } = await import('../useData')
    
    // Verify they are functions (hooks)
    expect(useDashboard).toBeInstanceOf(Function)
    expect(useProjects).toBeInstanceOf(Function)
  })
})
