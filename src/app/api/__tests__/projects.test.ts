import { describe, it, expect, vi } from 'vitest'
import { POST } from '../projects/route'

vi.mock('next/server', async () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({ data, status: init?.status || 200 })),
  },
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'test-user-id' })),
}))

describe('POST /api/projects', () => {
  it('creates a new project with valid data', async () => {
    const request = new Request('https://example.com/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New Project',
        githubRepo: 'user/new-project'
      }),
    })

    const response = await POST(request)
    const { data } = response

    expect(response.status).toBe(201)
    expect(data).toEqual({
      id: expect.any(String),
      userId: 'test-user-id',
      name: 'New Project',
      githubRepo: 'user/new-project',
      vercelProjectId: undefined,
      totalEmissions: 0,
      createdAt: expect.any(String),
    })
  })

  it('returns validation error when data is invalid', async () => {
    const request = new Request('https://example.com/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Invalid name
        githubRepo: 'invalid/repo'
      }),
    })

    const response = await POST(request)
    const { data } = response

    expect(response.status).toBe(400)
    expect(data).toEqual({
      error: 'Validation failed',
      details: {
        name: ['String must contain at least 1 character(s)'],
      },
    })
  })
})
