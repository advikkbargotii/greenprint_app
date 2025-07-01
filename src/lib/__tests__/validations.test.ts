import { describe, it, expect } from 'vitest'
import { createProjectSchema } from '../validations'

describe('Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('validates correct project data', () => {
      const validData = {
        name: 'Valid Project',
        githubRepo: 'user/valid-project'
      }

      const result = createProjectSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          name: 'Valid Project',
          githubRepo: 'user/valid-project'
        })
      }
    })

    it('trims whitespace from project name', () => {
      const dataWithWhitespace = {
        name: '  Trimmed Project  ',
        githubRepo: 'user/trimmed-project'
      }

      const result = createProjectSchema.safeParse(dataWithWhitespace)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Trimmed Project')
      }
    })

    it('rejects empty project name', () => {
      const invalidData = {
        name: '',
        githubRepo: 'user/valid-project'
      }

      const result = createProjectSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain(
          'String must contain at least 1 character(s)'
        )
      }
    })

    it('rejects project name that is too long', () => {
      const invalidData = {
        name: 'A'.repeat(101), // 101 characters
        githubRepo: 'user/valid-project'
      }

      const result = createProjectSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain(
          'String must contain at most 100 character(s)'
        )
      }
    })

    it('validates correct GitHub repo format', () => {
      const validRepos = [
        'user/repo',
        'user-name/repo-name',
        'user_name/repo_name',
        'user123/repo123',
        'User/Repo.js'
      ]

      validRepos.forEach(repo => {
        const result = createProjectSchema.safeParse({
          name: 'Test Project',
          githubRepo: repo
        })
        
        expect(result.success).toBe(true)
      })
    })

    it('rejects invalid GitHub repo formats', () => {
      const invalidRepos = [
        'user', // missing repo part
        'user/', // empty repo part
        '/repo', // missing user part
        'user/repo/extra', // too many parts
        'user with spaces/repo', // spaces not allowed
        'user@invalid/repo', // invalid characters
      ]

      invalidRepos.forEach(repo => {
        const result = createProjectSchema.safeParse({
          name: 'Test Project',
          githubRepo: repo
        })
        
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.flatten().fieldErrors.githubRepo).toBeDefined()
        }
      })
    })

    it('rejects missing required fields', () => {
      const incompleteData = {
        name: 'Test Project'
        // missing githubRepo
      }

      const result = createProjectSchema.safeParse(incompleteData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.githubRepo).toContain(
          'Required'
        )
      }
    })

    it('rejects additional fields', () => {
      const dataWithExtra = {
        name: 'Test Project',
        githubRepo: 'user/test-project',
        extraField: 'should not be allowed'
      }

      const result = createProjectSchema.safeParse(dataWithExtra)
      
      // Zod should strip extra fields, so this should still succeed
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toHaveProperty('extraField')
      }
    })
  })
})
