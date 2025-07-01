import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className="min-h-screen gp-bg-primary flex items-center justify-center">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-green-400 animate-spin mx-auto mb-4`} />
        <p className="text-white text-lg">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
      </div>
    </div>
  )
}
