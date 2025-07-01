import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  unit: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
}

const StatCard = React.memo(function StatCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  iconColor, 
  iconBgColor 
}: StatCardProps) {
  return (
    <div className="gp-card rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className={`text-sm ${iconColor}`}>{unit}</p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
})

export default StatCard
