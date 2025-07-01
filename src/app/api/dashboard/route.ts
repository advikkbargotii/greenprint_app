import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { mockDashboardData } from '@/lib/mockData'

// Enhanced mock data for dashboard API
const enhancedDashboardData = {
  ...mockDashboardData,
  monthlyTrend: -23, // -23% reduction
  topProjects: [
    { id: '1', name: 'GreenPrint', totalEmissions: 18.3 },
    { id: '2', name: 'Portfolio Site', totalEmissions: 12.7 },
    { id: '3', name: 'API Server', totalEmissions: 8.9 }
  ],
  recentEmissions: [
    {
      id: '1',
      userId: 'user_123',
      projectId: '1',
      source: 'github' as const,
      co2kg: 2.3,
      timestamp: new Date().toISOString(),
      metadata: { workflow: 'Deploy to production' }
    },
    {
      id: '2',
      userId: 'user_123', 
      projectId: '2',
      source: 'vercel' as const,
      co2kg: 1.1,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: { deployment: 'Preview build' }
    }
  ],
  suggestions: [
    'Batch your deployments to reduce cold starts',
    'Enable build caching to reduce CI/CD time by 40%',
    'Consider deploying to US West (Oregon) for cleaner energy'
  ]
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, fetch real data from Supabase:
    // const { data, error } = await supabase
    //   .from('emissions')
    //   .select('*')
    //   .eq('user_id', userId)
    
    return NextResponse.json(enhancedDashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
