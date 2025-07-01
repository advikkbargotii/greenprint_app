# GreenPrint Component Documentation

This document provides comprehensive documentation for all React components in the GreenPrint application. Each component is documented with its purpose, props, usage examples, and best practices.

## Component Architecture Overview

GreenPrint follows a component-based architecture with these principles:

- **Reusability**: Components are designed to be reused across different parts of the app
- **Type Safety**: All components use TypeScript interfaces for props
- **Accessibility**: Components include proper ARIA labels and semantic HTML
- **Performance**: Components use React.memo and other optimizations where appropriate
- **Consistency**: All components follow the same design system and naming conventions

---

## Navigation Components

### Navigation

**Purpose**: Main navigation bar that appears at the top of every page. Handles user authentication, page navigation, and responsive design.

**Location**: `src/components/Navigation.tsx`

**Props**:
```typescript
interface NavigationProps {
  currentPage: 'landing' | 'dashboard' | 'integrations'
  onNavigate: (page: 'landing' | 'dashboard' | 'integrations') => void
  showAuthenticatedNav?: boolean
}
```

**Usage Example**:
```tsx
import Navigation from '@/components/Navigation'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  
  return (
    <Navigation 
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      showAuthenticatedNav={true}
    />
  )
}
```

**Features**:
- Responsive design (works on mobile and desktop)
- Shows different navigation based on authentication status
- Glassmorphism design with backdrop blur
- Smooth hover animations and active states
- Accessibility support with ARIA labels
- Clerk authentication integration

**Styling**:
- Uses `.gp-nav-container` for the main container
- Uses `.gp-logo` for logo typography
- Uses `.gp-nav-button` for navigation links
- Custom CSS properties for consistent theming

---

## Dashboard Components

### StatCard

**Purpose**: Reusable card component for displaying key statistics and metrics in the dashboard.

**Location**: `src/components/StatCard.tsx`

**Props**:
```typescript
interface StatCardProps {
  label: string              // Description of the statistic
  value: string | number     // The actual value to display
  unit: string              // Unit of measurement
  icon: LucideIcon          // Icon component from Lucide React
  iconColor: string         // CSS class for icon color
  iconBgColor: string       // CSS class for icon background
}
```

**Usage Example**:
```tsx
import StatCard from '@/components/StatCard'
import { Activity } from 'lucide-react'

function Dashboard() {
  return (
    <StatCard 
      label="Carbon Emissions"
      value="245.3"
      unit="kg CO2"
      icon={Activity}
      iconColor="text-green-400"
      iconBgColor="bg-green-400/20"
    />
  )
}
```

**Features**:
- Clean, modern card design with rounded corners
- Color-coded icons for quick visual identification
- Responsive text sizing
- Memoized for performance (only re-renders when props change)
- Glassmorphism design matching the app theme

**Styling**:
- Uses `.gp-card` for consistent card styling
- Flexible layout with text on left, icon on right
- Typography hierarchy: label → value → unit

**Best Practices**:
- Use descriptive labels that are clear to all users
- Choose icons that relate to the data being displayed
- Use consistent color schemes (green for positive, red for warnings)
- Keep units short and clear (e.g., "kg CO2", "projects", "%")

### LoadingSpinner

**Purpose**: Consistent loading indicator used throughout the app while data is being fetched.

**Location**: `src/components/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'   // Size of the spinner
  message?: string            // Optional loading message
}
```

**Usage Example**:
```tsx
import LoadingSpinner from '@/components/LoadingSpinner'

function DataComponent() {
  if (loading) {
    return (
      <LoadingSpinner 
        size="md"
        message="Loading dashboard data..."
      />
    )
  }
  
  return <div>Your content here</div>
}
```

**Features**:
- Three size options: small (16px), medium (24px), large (32px)
- Optional custom loading message
- Accessibility support with `role="status"` and `aria-label`
- Smooth rotation animation
- Consistent with app's green color scheme

**Styling**:
- Uses Lucide React's `Loader2` icon
- Green color (`text-green-400`) to match brand
- Centered layout with flexbox
- Hardware-accelerated animation for smooth performance

---

## Utility Components

### ErrorState

**Purpose**: Consistent error display component for handling and showing error messages.

**Location**: `src/components/ErrorState.tsx`

**Props**:
```typescript
interface ErrorStateProps {
  error: string | Error       // Error message or Error object
  onRetry?: () => void       // Optional retry function
  title?: string             // Optional custom error title
}
```

**Usage Example**:
```tsx
import ErrorState from '@/components/ErrorState'

function DataComponent() {
  if (error) {
    return (
      <ErrorState 
        error={error}
        title="Failed to load dashboard"
        onRetry={refetchData}
      />
    )
  }
  
  return <div>Your content here</div>
}
```

**Features**:
- User-friendly error messages
- Optional retry button
- Consistent styling with the app theme
- Handles both string and Error object types
- Accessibility support

---

## Page Components

### LandingPage

**Purpose**: Main marketing page for new visitors. Showcases GreenPrint's features and benefits.

**Location**: `src/components/LandingPage.tsx`

**Features**:
- Hero section with call-to-action
- Feature showcase with animated carousel
- Testimonials section
- Stats and benefits
- Responsive design
- SEO optimized

### Dashboard

**Purpose**: Main dashboard for authenticated users. Shows carbon emissions data, statistics, and insights.

**Location**: `src/components/Dashboard.tsx`

**Features**:
- Real-time emissions data
- Statistical overview with StatCard components
- Weekly charts and trends
- AI-powered suggestions
- Integration status
- Export and sharing options

### Integrations

**Purpose**: Integration management page where users can connect their development tools.

**Location**: `src/components/Integrations.tsx`

**Features**:
- Available integrations list
- Connection status indicators
- Setup instructions
- Permission management
- Integration health monitoring

---

## Design System

### Color Scheme

GreenPrint uses an environmental color palette:

- **Primary Green**: `rgb(148, 235, 101)` - Main brand color
- **Background**: `rgba(5, 18, 4, 1)` - Deep forest green
- **Cards**: `rgba(170, 157, 158, 0.35)` - Semi-transparent warm gray
- **Text**: White and light gray variants
- **Accents**: Various green shades for different UI elements

### Typography

- **Primary Font**: Zodiak (serif) - Used for logos and headings
- **Body Font**: Geist Sans - Used for readable body text
- **Code Font**: Geist Mono - Used for code blocks and technical content

### Spacing

- **Component Padding**: 24px (1.5rem) for most components
- **Card Padding**: 24px internal padding
- **Section Spacing**: 48px between major sections
- **Element Spacing**: 16px between related elements

### Animations

- **Hover Effects**: 200ms transitions with slight scale transforms
- **Loading States**: Smooth rotation animations
- **Page Transitions**: Fade-in effects for better UX
- **Carousel**: Hardware-accelerated horizontal scrolling

---

## Best Practices

### Component Development

1. **Use TypeScript**: Always define interfaces for props
2. **Add JSDoc Comments**: Document complex components and functions
3. **Include Examples**: Provide usage examples in comments
4. **Optimize Performance**: Use React.memo for expensive components
5. **Ensure Accessibility**: Include proper ARIA labels and semantic HTML

### Styling

1. **Use CSS Custom Properties**: For consistent theming
2. **Follow Naming Convention**: Use `gp-` prefix for custom classes
3. **Responsive Design**: Test on mobile and desktop
4. **Performance**: Use efficient animations and transitions

### Testing

1. **Write Tests**: Every component should have accompanying tests
2. **Test Accessibility**: Verify ARIA labels and keyboard navigation
3. **Test Props**: Verify all prop combinations work correctly
4. **Mock Dependencies**: Use proper mocks for external services

### Code Organization

1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Interfaces**: Define clear, well-documented interfaces
3. **File Structure**: Keep related files together
4. **Import Organization**: Group imports logically (React, libraries, components, utilities)

---

## Performance Guidelines

### Optimization Techniques

1. **React.memo**: Used for components that receive stable props
2. **useCallback**: For function props that don't change frequently
3. **useMemo**: For expensive calculations
4. **Lazy Loading**: Components loaded only when needed
5. **Bundle Splitting**: Code split by routes and features

### Monitoring

- Bundle size is monitored during build
- Core Web Vitals are tracked
- Performance metrics are logged in development
- Lighthouse scores are maintained above 90

---

## Accessibility Guidelines

### ARIA Labels

All interactive elements include proper ARIA labels:
- Buttons have descriptive `aria-label` attributes
- Navigation uses `aria-current` for active pages
- Forms include proper `aria-describedby` associations

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order is logical and predictable
- Focus indicators are visible and clear

### Screen Reader Support

- Semantic HTML elements are used where appropriate
- Text alternatives are provided for visual content
- Status updates are announced to screen readers

### Color and Contrast

- Color contrast ratios meet WCAG AA standards
- Information is not conveyed by color alone
- Focus indicators have sufficient contrast

---

This documentation is updated as components are added or modified. For the most current information about specific components, refer to the inline comments in the component files themselves.
