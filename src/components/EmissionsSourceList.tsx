import { LucideIcon } from 'lucide-react'

interface EmissionsSource {
  name: string
  value: number
  color: string
  icon: LucideIcon
}

interface EmissionsSourceListProps {
  sources: EmissionsSource[]
}

export default function EmissionsSourceList({ sources }: EmissionsSourceListProps) {
  return (
    <div className="gp-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Emissions by Source</h3>
      <div className="space-y-4">
        {sources.map((source, index) => {
          const Icon = source.icon
          return (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className={`p-2 rounded-lg ${source.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{source.name}</p>
                <p className="text-gray-300 text-xs">{source.value} kg CO₂</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
