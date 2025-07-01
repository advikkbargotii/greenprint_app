// Centralized mock data for the GreenPrint app

export const mockDashboardData = {
  totalEmissions: 45.2,
  weeklyEmissions: 8.7,
  reduction: 23,
  greenScore: 87,
  weeklyData: [
    { day: 'Mon', emissions: 6.2 },
    { day: 'Tue', emissions: 8.1 },
    { day: 'Wed', emissions: 5.7 },
    { day: 'Thu', emissions: 9.3 },
    { day: 'Fri', emissions: 7.8 },
    { day: 'Sat', emissions: 3.2 },
    { day: 'Sun', emissions: 4.9 }
  ],
  emissionsSources: [
    { name: 'CI/CD Workflows', value: 18.3, color: 'bg-green-500', icon: 'Activity' },
    { name: 'Deployments', value: 12.7, color: 'bg-blue-500', icon: 'Leaf' },
    { name: 'AI/LLM Usage', value: 8.9, color: 'bg-purple-500', icon: 'Brain' },
    { name: 'Build Processes', value: 5.3, color: 'bg-orange-500', icon: 'Activity' }
  ]
}

export const mockProjectsData = [
  {
    id: '1',
    userId: 'user_123',
    name: 'GreenPrint',
    githubRepo: 'user/greenprint',
    vercelProjectId: 'prj_123',
    totalEmissions: 18.3,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    userId: 'user_123', 
    name: 'Portfolio Site',
    githubRepo: 'user/portfolio',
    vercelProjectId: 'prj_456',
    totalEmissions: 12.7,
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: '3',
    userId: 'user_123',
    name: 'API Server',
    githubRepo: 'user/api-server', 
    vercelProjectId: 'prj_789',
    totalEmissions: 8.9,
    createdAt: new Date('2024-03-10').toISOString()
  }
]
