import { 
  Leaf, 
  BarChart3, 
  Brain, 
  Globe, 
  TrendingDown, 
  Users, 
  Github, 
  DollarSign, 
  FileText, 
  Zap, 
  Cloud 
} from 'lucide-react'
import FeatureCard from './FeatureCard'

const features = [
  {
    icon: Leaf,
    title: 'Green AI Mode',
    description: 'Eco mode reduces GreenPrint&apos;s own AI usage<br />while tracking yours'
  },
  {
    icon: BarChart3,
    title: 'Real-time Tracking',
    description: 'Monitor CI/CD, deployments, and AI usage emissions in real-time'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get intelligent suggestions to reduce your carbon footprint'
  },
  {
    icon: Globe,
    title: 'Regional Optimization',
    description: 'Deploy to regions with cleaner energy<br />for lower emissions'
  },
  {
    icon: TrendingDown,
    title: 'Carbon Reduction',
    description: 'Achieve up to 40% emissions reduction<br />with optimization suggestions'
  },
  {
    icon: Users,
    title: 'Team Dashboards',
    description: 'Share sustainability goals and compete<br />with team members'
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Connect repositories and track<br />workflow emissions automatically'
  },
  {
    icon: DollarSign,
    title: 'Cost Optimization',
    description: 'Save money while reducing emissions<br />with smart deployment strategies'
  },
  {
    icon: FileText,
    title: 'ESG Reporting',
    description: 'Generate compliance reports for<br />sustainability and ESG initiatives'
  },
  {
    icon: Zap,
    title: 'API Access',
    description: 'Build custom integrations with<br />our comprehensive REST API'
  },
  {
    icon: Cloud,
    title: 'Multi-Cloud Support',
    description: 'Track emissions across AWS, GCP,<br />Azure, and other cloud providers'
  }
]

export default function FeatureCarousel() {
  return (
    <section style={{ paddingTop: '90px', paddingBottom: '90px' }}>
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {/* First set of feature cards */}
          {features.map((feature, index) => (
            <FeatureCard
              key={`feature-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
          
          {/* Duplicate cards for seamless looping */}
          {features.slice(0, 6).map((feature, index) => (
            <FeatureCard
              key={`feature-duplicate-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
