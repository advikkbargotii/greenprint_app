interface Suggestion {
  title: string
  description: string
  type: 'green' | 'blue' | 'purple' | 'orange'
}

interface OptimizationSuggestionsProps {
  ecoMode: boolean
  suggestions?: Suggestion[]
  onNavigateToIntegrations?: () => void
}

const defaultSuggestions: Suggestion[] = [
  {
    title: 'Batch Your Deployments',
    description: 'Consider bundling multiple small commits into larger deployments. This could reduce your weekly emissions by ~15%.',
    type: 'green'
  },
  {
    title: 'Optimize CI/CD Workflows',
    description: 'Your build processes run longer than necessary. Enable caching to reduce build times by up to 40%.',
    type: 'blue'
  }
]

const typeStyles = {
  green: {
    bg: 'bg-green-600/20',
    border: 'border-green-500/30',
    title: 'text-green-300',
    text: 'text-green-200'
  },
  blue: {
    bg: 'bg-blue-600/20',
    border: 'border-blue-500/30',
    title: 'text-blue-300',
    text: 'text-blue-200'
  },
  purple: {
    bg: 'bg-purple-600/20',
    border: 'border-purple-500/30',
    title: 'text-purple-300',
    text: 'text-purple-200'
  },
  orange: {
    bg: 'bg-orange-600/20',
    border: 'border-orange-500/30',
    title: 'text-orange-300',
    text: 'text-orange-200'
  }
}

export default function OptimizationSuggestions({ 
  ecoMode, 
  suggestions = defaultSuggestions, 
  onNavigateToIntegrations 
}: OptimizationSuggestionsProps) {
  return (
    <div className="mt-8 gp-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        🌱 {ecoMode ? 'Cached' : 'AI-Powered'} Optimization Suggestions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => {
          const styles = typeStyles[suggestion.type]
          return (
            <div key={index} className={`${styles.bg} border ${styles.border} rounded-lg p-4`}>
              <h4 className={`font-semibold ${styles.title} mb-2`}>{suggestion.title}</h4>
              <p className={`${styles.text} text-sm`}>
                {suggestion.description}
              </p>
            </div>
          )
        })}
      </div>
      
      {!ecoMode && onNavigateToIntegrations && (
        <div className="mt-4 text-center">
          <button 
            onClick={onNavigateToIntegrations}
            className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
          >
            Enable Eco Mode to reduce AI usage →
          </button>
        </div>
      )}
    </div>
  )
}
