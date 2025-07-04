# GreenPrint Testing Infrastructure

## Overview

GreenPrint now has a comprehensive testing infrastructure built with **Vitest** and **React Testing Library**, providing fast, reliable testing for React components, API routes, hooks, and utility functions.

## 🧪 Testing Stack

- **Test Runner**: Vitest (fast, ESM-native)
- **Component Testing**: React Testing Library
- **Mocking**: Vitest built-in mocking
- **DOM Environment**: jsdom
- **Coverage**: Built-in Vitest coverage

## 📁 Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   └── utils.tsx              # Testing utilities & helpers
├── components/__tests__/      # Component tests
├── hooks/__tests__/           # Custom hook tests
├── lib/__tests__/             # Utility function tests
└── app/api/__tests__/         # API route tests
```

## 🚀 Available Scripts

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI (visual interface)
npm run test:ui

# Watch mode with file changes
npm run test:watch

# Type checking
npm run type-check
```

## ✅ What's Tested

### Components
- **Navigation**: Logo rendering, navigation links, accessibility
- **StatCard**: Data display, styling, accessibility structure
- **LoadingSpinner**: Different sizes, accessibility attributes

### API Routes
- **Projects API**: Creation, validation, error handling
- Input validation with Zod schemas
- HTTP method handling

### Custom Hooks
- **useData hooks**: Loading states, data fetching, error handling
- **useDashboard**: Dashboard data management
- **useProjects**: Project data management

### Utilities
- **Validation schemas**: Zod validation for forms and API inputs
- **Input sanitization**: Project names, GitHub repo formats

## 🛠️ Test Configuration

### Vitest Config (`vitest.config.ts`)
- React plugin for JSX support
- jsdom environment for DOM testing
- Path aliases (`@/` → `./src/`)
- Coverage reporting (text, JSON, HTML)
- Automatic test file discovery

### Test Setup (`src/test/setup.ts`)
- Jest DOM matchers for better assertions
- Automatic cleanup after each test
- Mock configurations for:
  - Next.js router and navigation
  - Next.js Image component
  - Clerk authentication
  - ResizeObserver and IntersectionObserver

### Testing Utilities (`src/test/utils.tsx`)
- Custom render function with providers
- Mock store creation for testing
- Helper functions for creating test data
- Re-exports of Testing Library utilities

## 🔧 Mocking Strategy

### Automatic Mocks
- **Next.js**: Router, navigation, Image component
- **Clerk**: Authentication state and components
- **Browser APIs**: ResizeObserver, IntersectionObserver, matchMedia

### Custom Mocks
- **API Layer**: Mocked responses for testing hooks
- **Store**: Mock Zustand store with test data
- **External Services**: GitHub, Vercel, OpenAI integrations

## 📊 CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/ci.yml`)
- **Multi-node testing**: Node.js 18.x and 20.x
- **Quality checks**: TypeScript, ESLint, Tests
- **Security auditing**: npm audit, dependency checks
- **Performance analysis**: Bundle size monitoring
- **Accessibility testing**: Pa11y integration
- **Coverage reporting**: Codecov integration

### Workflow Jobs
1. **test**: Run all tests with coverage across multiple Node.js versions
2. **security**: Security and dependency audits with vulnerability scanning
3. **build**: Verify production builds with artifact creation and tarball compression
4. **performance**: Bundle analysis and optimization with PR comments
5. **accessibility**: Automated a11y testing with WCAG 2.1 AA compliance
6. **ci-summary**: Overall pipeline status validation

## 📈 Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🚀 CI/CD Enhancements

### Artifact Management
- **Tarball Creation**: Build artifacts are compressed into `next-build.tar.gz` for reliable transfer
- **Artifact Upload/Download**: Improved reliability with proper error handling and verification
- **Cache Optimization**: Removes `.next/cache` to reduce artifact size while preserving functionality

### Pipeline Reliability
- **Multi-Node Testing**: Tests run on Node.js 18.x, 20.x, and 23.x for compatibility
- **Conditional Execution**: Performance and accessibility jobs run on all successful builds
- **Comprehensive Debugging**: Detailed logging and verification steps throughout the pipeline

## 🐛 Current Status

### ✅ Infrastructure Complete
- Test runner configured and working
- All testing utilities set up
- CI/CD pipeline configured with robust artifact handling
- Comprehensive mocking strategy

### 🔧 Test Fixes Needed
Some tests require minor fixes for full compatibility:

1. **Component imports**: Verify export/import consistency
2. **Mock refinements**: Align mocks with actual component APIs
3. **Validation schemas**: Update test expectations to match Zod messages
4. **Hook testing**: Add proper async handling for data fetching

### 📋 Next Steps
1. Fix failing test cases
2. Add more component test coverage
3. Implement E2E tests with Playwright
4. Add visual regression testing
5. Performance testing benchmarks

## 🎯 Testing Best Practices

### Component Testing
```typescript
// Good: Test behavior, not implementation
expect(screen.getByText('Dashboard')).toBeInTheDocument()

// Good: Test accessibility
expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')

// Good: Test user interactions
fireEvent.click(screen.getByText('Submit'))
```

### Hook Testing
```typescript
// Good: Test loading states
expect(result.current.loading).toBe(true)

// Good: Test error handling
await waitFor(() => {
  expect(result.current.error).toEqual(mockError)
})
```

### API Testing
```typescript
// Good: Test validation
const result = schema.safeParse(invalidData)
expect(result.success).toBe(false)

// Good: Test error responses
expect(response.status).toBe(400)
expect(response.data.error).toBe('Validation failed')
```

## 🔍 Running Specific Tests

```bash
# Run specific test file
npm run test Navigation.test.tsx

# Run tests matching pattern
npm run test -- --grep "validation"

# Run tests in specific directory
npm run test src/components

# Watch specific files
npm run test:watch -- src/hooks
```

## 📝 Writing New Tests

### Component Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import YourComponent from '../YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interactions', () => {
    render(<YourComponent />)
    // Test interactions...
  })
})
```

### Hook Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useYourHook } from '../useYourHook'

describe('useYourHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useYourHook())
    expect(result.current.loading).toBe(false)
  })
})
```

---

## 🏆 Benefits Achieved

### Developer Experience
- **Fast feedback**: Vitest provides instant test results
- **Great DX**: Excellent error messages and debugging
- **IDE integration**: Full TypeScript support

### Code Quality
- **Regression prevention**: Automated testing catches issues
- **Documentation**: Tests serve as living documentation
- **Refactoring confidence**: Safe code changes with test coverage

### CI/CD Pipeline
- **Automated quality checks**: No broken code reaches production
- **Performance monitoring**: Bundle size and performance tracking
- **Security**: Dependency and vulnerability scanning

The testing infrastructure is now ready to ensure GreenPrint maintains high quality as it grows! 🚀
