'use client'

import { Github, Cloud, Brain, Check, ExternalLink } from 'lucide-react'
import { useAppStore } from '@/store'

interface Props {
  onNavigate: (page: 'dashboard' | 'integrations') => void
}

// Mock integrations data
const integrations = [
  {
    name: 'GitHub Actions',
    description: 'Track CI/CD workflow emissions',
    icon: Github,
    connected: true,
    emissions: '12.3 kg CO₂/month',
    color: 'text-gray-900'
  },
  {
    name: 'Vercel',
    description: 'Monitor serverless deployments',
    icon: Cloud,
    connected: true,
    emissions: '8.7 kg CO₂/month',
    color: 'text-black'
  },
  {
    name: 'OpenAI',
    description: 'Track GPT-4 API usage',
    icon: Brain,
    connected: true,
    emissions: '15.2 kg CO₂/month',
    color: 'text-green-600'
  },
  {
    name: 'Netlify',
    description: 'Track static site builds',
    icon: Cloud,
    connected: false,
    emissions: 'Not connected',
    color: 'text-teal-600'
  }
]

const carbonRegions = [
  { region: 'US West (Oregon)', intensity: 0.12, status: 'Clean' },
  { region: 'EU Central (Frankfurt)', intensity: 0.22, status: 'Moderate' },
  { region: 'Asia Pacific (Singapore)', intensity: 0.45, status: 'High' },
  { region: 'US East (Virginia)', intensity: 0.18, status: 'Clean' }
]

export default function Integrations({ onNavigate }: Props) {
  const { ecoMode, toggleEcoMode } = useAppStore()

  return (
    <div className="min-h-screen p-6 gp-bg-primary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-gray-300">Connect your tools to track emissions automatically</p>
        </div>

        {/* Eco Mode Toggle */}
        <div className="gp-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">🌱 Eco Mode</h3>
              <p className="text-gray-300">
                Reduce GreenPrint&apos;s own carbon footprint by limiting AI usage
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Standard</span>
              <button
                onClick={toggleEcoMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  ecoMode ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    ecoMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-green-400 font-medium">Eco Mode</span>
            </div>
          </div>
          {ecoMode && (
            <div className="mt-4 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">
                ✅ Eco Mode enabled: AI suggestions are cached locally, reducing our environmental impact while tracking yours.
              </p>
            </div>
          )}
        </div>

        {/* Connected Services */}
        <div className="gp-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connected Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="gp-card-secondary rounded-xl p-6 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-700/50 p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{service.name}</h3>
                        <p className="text-sm text-gray-300">{service.description}</p>
                      </div>
                    </div>
                    {service.connected ? (
                      <div className="flex items-center gap-2 bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm">
                        <Check className="w-4 h-4" />
                        Connected
                      </div>
                    ) : (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Connect
                      </button>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-600/50 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Monthly Emissions:</span>
                      <span className={`font-medium ${
                        service.connected ? 'text-white' : 'text-gray-400'
                      }`}>
                        {service.emissions}
                      </span>
                    </div>
                    {service.connected && (
                      <button className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
                        View Details
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Regional Carbon Intensity */}
        <div className="gp-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Regional Carbon Intensity</h2>
          <p className="text-gray-300 mb-6">
            Deploy to regions with cleaner energy grids to reduce your carbon footprint
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carbonRegions.map((region, index) => (
              <div 
                key={index} 
                className="gp-card-secondary rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{region.region}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      region.status === 'Clean'
                        ? 'bg-green-600/30 text-green-300'
                        : region.status === 'Moderate'
                        ? 'bg-yellow-600/30 text-yellow-300'
                        : 'bg-red-600/30 text-red-300'
                    }`}
                  >
                    {region.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        region.intensity <= 0.2
                          ? 'bg-green-500'
                          : region.intensity <= 0.3
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${(region.intensity / 0.5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {region.intensity} kg CO₂/kWh
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
