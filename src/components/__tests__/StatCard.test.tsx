import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Activity } from 'lucide-react'
import StatCard from '../StatCard'

describe('StatCard Component', () => {
  const defaultProps = {
    label: 'Total Emissions',
    value: '245.3',
    unit: 'kg CO2',
    icon: Activity,
    iconColor: 'text-green-400',
    iconBgColor: 'bg-green-400/20'
  }

  it('renders all stat card information correctly', () => {
    render(<StatCard {...defaultProps} />)
    
    expect(screen.getByText('Total Emissions')).toBeInTheDocument()
    expect(screen.getByText('245.3')).toBeInTheDocument()
    expect(screen.getByText('kg CO2')).toBeInTheDocument()
  })

  it('applies correct icon color', () => {
    render(<StatCard {...defaultProps} />)
    
    const unitElement = screen.getByText('kg CO2')
    expect(unitElement).toHaveClass('text-green-400')
  })

  it('renders with different values', () => {
    render(
      <StatCard 
        {...defaultProps} 
        label="Active Projects"
        value={12}
        unit="projects"
      />
    )
    
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
  })

  it('applies consistent CSS classes', () => {
    render(<StatCard {...defaultProps} />)
    
    // Find the outermost card div
    const card = screen.getByText('Total Emissions').closest('div.gp-card')
    expect(card).toHaveClass('gp-card')
  })

  it('handles large numbers properly', () => {
    render(
      <StatCard 
        {...defaultProps}
        value="1,234.56"
        unit="tons CO2"
      />
    )
    
    expect(screen.getByText('1,234.56')).toBeInTheDocument()
    expect(screen.getByText('tons CO2')).toBeInTheDocument()
  })

  it('renders icon correctly', () => {
    render(<StatCard {...defaultProps} />)
    
    // The icon should be present in the DOM
    const iconContainer = screen.getByText('Total Emissions').closest('div')?.parentElement
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument()
  })
})
