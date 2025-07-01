import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import Navigation from '../Navigation'

const mockProps = {
  currentPage: 'dashboard' as const,
  onNavigate: vi.fn(),
  showAuthenticatedNav: true
}

describe('Navigation Component', () => {
  it('renders the GreenPrint logo', () => {
    render(<Navigation {...mockProps} />)
    
    const greenText = screen.getByText('Green')
    const printText = screen.getByText('Print')
    expect(greenText).toBeInTheDocument()
    expect(printText).toBeInTheDocument()
    expect(greenText.parentElement).toHaveClass('gp-logo')
  })

  it('renders navigation links for authenticated users', () => {
    render(<Navigation {...mockProps} />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Integrations')).toBeInTheDocument()
  })

  it('renders the user button when authenticated', () => {
    render(<Navigation {...mockProps} />)
    
    const userButton = screen.getByTestId('user-button')
    expect(userButton).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation {...mockProps} />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    
    const navLinks = screen.getAllByRole('button')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('handles navigation clicks', () => {
    const onNavigate = vi.fn()
    render(<Navigation {...mockProps} onNavigate={onNavigate} />)
    
    const dashboardButton = screen.getByText('Dashboard')
    fireEvent.click(dashboardButton)
    
    expect(onNavigate).toHaveBeenCalledWith('dashboard')
  })

  it('applies correct CSS classes for styling', () => {
    render(<Navigation {...mockProps} />)
    
    const navContainer = screen.getByRole('navigation')
    expect(navContainer).toHaveClass('gp-z-nav')
    
    const innerContainer = navContainer.querySelector('.gp-nav-container')
    expect(innerContainer).toBeInTheDocument()
  })

  it('renders logo with proper classes', () => {
    render(<Navigation {...mockProps} />)
    
    const greenText = screen.getByText('Green')
    const printText = screen.getByText('Print')
    
    expect(greenText).toHaveClass('gp-logo-green')
    expect(printText).toHaveClass('gp-logo-white')
  })
})
