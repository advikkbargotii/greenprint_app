'use client'

import { useUser } from '@clerk/nextjs'
import { Leaf, TrendingDown, Activity, Brain } from 'lucide-react'
import { useAppStore } from '@/store'
import { useDashboard } from '@/hooks/useData'
import StatCard from './StatCard'
import WeeklyChart from './WeeklyChart'
import EmissionsSourceList from './EmissionsSourceList'
import OptimizationSuggestions from './OptimizationSuggestions'
import LoadingSpinner from './LoadingSpinner'
import ErrorState from './ErrorState'

interface Props {
  onNavigate: (page: 'dashboard' | 'integrations') => void
}

// Map icon names from mock data to actual components
const iconMap = {
  Activity,
  Leaf,
  Brain
} as const

export default function Dashboard({ onNavigate }: Props) {
  const { user } = useUser()
  const { ecoMode } = useAppStore()
  const { data, loading, error, refetch } = useDashboard()

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return <ErrorState message="No data available" onRetry={refetch} />

  return (
    <div className="min-h-screen p-6 gp-bg-primary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'Developer'}! 👋
          </h1>
          <p className="text-gray-300">
            Track and optimize your development carbon footprint
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Emissions"
            value={data.totalEmissions}
            unit="kg CO₂"
            icon={Leaf}
            iconColor="text-green-400"
            iconBgColor="bg-green-600/30"
          />
          <StatCard
            label="This Week"
            value={data.weeklyEmissions}
            unit="kg CO₂"
            icon={Activity}
            iconColor="text-blue-400"
            iconBgColor="bg-blue-600/30"
          />
          <StatCard
            label="Reduction"
            value={`${data.reduction}%`}
            unit="vs last month"
            icon={TrendingDown}
            iconColor="text-green-400"
            iconBgColor="bg-green-600/30"
          />
          <StatCard
            label="Green Score"
            value={data.greenScore}
            unit="Excellent"
            icon={Leaf}
            iconColor="text-green-400"
            iconBgColor="bg-green-600/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Chart */}
          <WeeklyChart data={data.weeklyData} />

          {/* Sources Breakdown */}
          <EmissionsSourceList sources={data.emissionsSources.map(source => ({
            ...source,
            icon: iconMap[source.icon as keyof typeof iconMap] || Activity
          }))} />
        </div>

        {/* AI Suggestions */}
        <OptimizationSuggestions
          ecoMode={ecoMode}
          onNavigateToIntegrations={() => onNavigate('integrations')}
        />
      </div>
    </div>
  )
}
