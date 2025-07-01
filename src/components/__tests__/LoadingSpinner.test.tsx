import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders with custom message', () => {
    const customMessage = 'Loading dashboard data...'
    render(<LoadingSpinner message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    
    let spinner = screen.getByRole('status')
    expect(spinner.querySelector('.animate-spin')).toHaveClass('w-4', 'h-4')
    
    rerender(<LoadingSpinner size="lg" />)
    spinner = screen.getByRole('status')
    expect(spinner.querySelector('.animate-spin')).toHaveClass('w-8', 'h-8')
    
    rerender(<LoadingSpinner size="md" />)
    spinner = screen.getByRole('status')
    expect(spinner.querySelector('.animate-spin')).toHaveClass('w-6', 'h-6')
  })

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner message="Loading data" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
    
    const hiddenText = screen.getByText('Loading data')
    expect(hiddenText).toBeInTheDocument()
  })

  it('applies center alignment by default', () => {
    render(<LoadingSpinner />)
    
    const container = screen.getByRole('status')
    expect(container).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('renders spinner animation', () => {
    render(<LoadingSpinner />)
    
    const spinnerIcon = screen.getByRole('status').querySelector('.animate-spin')
    expect(spinnerIcon).toBeInTheDocument()
    expect(spinnerIcon).toHaveClass('animate-spin')
  })

  it('works without message', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    
    // Should not render any text content when no message is provided
    expect(spinner.textContent).toBe('')
  })
})
