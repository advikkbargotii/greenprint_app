import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createProjectSchema } from '@/lib/validations'
import { mockProjectsData } from '@/lib/mockData'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter projects for current user
    const userProjects = mockProjectsData.filter(p => p.userId === userId)
    
    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input using Zod
    const validationResult = createProjectSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      )
    }
    
    const { name, githubRepo, vercelProjectId } = validationResult.data

    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name,
      githubRepo,
      vercelProjectId,
      totalEmissions: 0,
      createdAt: new Date().toISOString()
    }

    // In production, save to Supabase:
    // const { data, error } = await supabase
    //   .from('projects')
    //   .insert([newProject])
    
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Create project API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
