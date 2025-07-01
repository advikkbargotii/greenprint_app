import React from 'react'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureCard = React.memo(function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div 
      className="gp-card rounded-2xl p-6 relative ticker-item transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110 cursor-pointer"
      style={{
        width: '343px',
        height: '166px'
      }}
    >
      <div className="absolute top-4" style={{ left: '6px' }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="absolute top-16" style={{ left: '6px' }}>
        <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
        <p 
          className="text-sm text-white"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  )
})

export default FeatureCard
