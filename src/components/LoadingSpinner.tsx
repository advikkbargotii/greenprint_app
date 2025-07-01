import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div 
      className="flex items-center justify-center" 
      role="status" 
      aria-label="Loading"
    >
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-green-400 animate-spin mx-auto mb-4`} />
        {message && <p className="text-white text-lg">{message}</p>}
      </div>
    </div>
  )
}
