import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock NextResponse to match actual behavior
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'test-user-id' })),
}))

// Mock the validations module
vi.mock('@/lib/validations', () => ({
  createProjectSchema: {
    safeParse: vi.fn(),
  },
}))

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  mockProjectsData: [],
}))

import { POST } from '../projects/route'
import { createProjectSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

describe('POST /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a new project with valid data', async () => {
    // Mock successful validation
    vi.mocked(createProjectSchema.safeParse).mockReturnValue({
      success: true,
      data: {
        name: 'New Project',
        githubRepo: 'user/new-project',
        vercelProjectId: undefined,
      },
    })

    // Mock NextResponse.json to return a response-like object
    const mockResponse = {
      status: 201,
      json: async () => ({
        id: expect.any(String),
        userId: 'test-user-id',
        name: 'New Project',
        githubRepo: 'user/new-project',
        vercelProjectId: undefined,
        totalEmissions: 0,
        createdAt: expect.any(String),
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(NextResponse.json).mockReturnValue(mockResponse as any)

    const request = new Request('https://example.com/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New Project',
        githubRepo: 'user/new-project'
      }),
    })

    const response = await POST(request)

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Project',
        githubRepo: 'user/new-project',
        userId: 'test-user-id',
        totalEmissions: 0,
      }),
      { status: 201 }
    )
    expect(response).toBe(mockResponse)
  })

  it('returns validation error when data is invalid', async () => {
    // Mock validation failure
    vi.mocked(createProjectSchema.safeParse).mockReturnValue({
      success: false,
      error: {
        flatten: () => ({
          fieldErrors: {
            name: ['String must contain at least 1 character(s)'],
          },
          formErrors: [],
        }),
      },
    } as never)

    const mockErrorResponse = {
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: {
          name: ['String must contain at least 1 character(s)'],
        },
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(NextResponse.json).mockReturnValue(mockErrorResponse as any)

    const request = new Request('https://example.com/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Invalid name
        githubRepo: 'invalid/repo'
      }),
    })

    const response = await POST(request)

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error: 'Validation failed',
        details: {
          name: ['String must contain at least 1 character(s)'],
        },
      },
      { status: 400 }
    )
    expect(response).toBe(mockErrorResponse)
  })
})
