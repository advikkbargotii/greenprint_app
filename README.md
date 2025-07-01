# 🌱 GreenPrint - Developer Carbon Footprint Tracker

GreenPrint helps developers track and reduce the carbon footprint of their work. It's user-friendly and smart, aiming to promote sustainability in technology.

## Features

- **Real-time Emissions Tracking**: Monitor carbon emissions in real time.
- **AI Suggestions**: Get tips to reduce your environmental impact.
- **Seamless Integrations**: Connect with services like GitHub and Vercel.
- **Team Collaboration**: Work together on sustainable goals.

## Quick Start

1. **Clone & Install**
   ```
   git clone REPOSITORY_URL
   cd greenprint
   npm install
   ```

2. **Set Up Environment**
   ```
   cp .env.local.example .env.local
   ```

   - Configure environment variables in `.env.local`.

3. **Run Development Server**
   ```
   npm run dev
   ```

4. **Build for Production**
   ```
   npm run build
   npm start
   ```

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/greenprint.git
cd greenprint
npm install
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
```

Configure your environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: External API Keys
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
OPENAI_API_KEY=your_openai_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see GreenPrint in action!

### 4. Build for Production
```bash
npm run build
npm start
```

## 🏗️ Architecture & Design

### **Modern Next.js Architecture**
GreenPrint follows cutting-edge Next.js 15 patterns with App Router, Server Components, and TypeScript-first development:

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # Serverless API routes
│   │   │   ├── dashboard/  # Dashboard data endpoints
│   │   │   └── projects/   # Project management endpoints
│   │   ├── globals.css     # Global styles + design system
│   │   ├── layout.tsx      # Root layout with Clerk provider
│   │   └── page.tsx        # Main application page
│   ├── components/         # Reusable React components
│   │   ├── Navigation.tsx  # Unified navigation component
│   │   ├── Dashboard.tsx   # Main dashboard interface
│   │   ├── LandingPage.tsx # Marketing landing page
│   │   ├── Integrations.tsx# Integration management
│   │   └── ErrorBoundary.tsx# Error handling
│   ├── lib/               # Utilities and API client
│   │   └── api.ts         # Type-safe API client
│   ├── store/             # State management
│   │   └── index.ts       # Zustand store configuration
│   ├── types/             # TypeScript definitions
│   │   └── index.ts       # Core type definitions
│   └── middleware.ts      # Clerk authentication middleware
```

### **Tech Stack**
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, Custom CSS Properties
- **Authentication**: Clerk (enterprise-grade auth)
- **Database**: Supabase (PostgreSQL + real-time subscriptions)
- **State Management**: Zustand (lightweight and fast)
- **API Layer**: Next.js API Routes (serverless)
- **Deployment**: Vercel (optimized for Next.js)
- **Fonts**: Zodiak (custom typography)

### **Design System**
GreenPrint features a comprehensive design system built with CSS custom properties:

```css
/* Core Design Tokens */
--greenprint-bg-primary: rgba(5, 18, 4, 1);
--greenprint-green-primary: rgb(148, 235, 101);
--greenprint-nav-bg: rgba(48, 48, 48, 0.53);
--greenprint-card-bg: rgba(170, 157, 158, 0.35);
--greenprint-font-zodiak: 'Zodiak', serif;

/* Utility Classes */
.gp-bg-primary      /* Main background */
.gp-nav-container   /* Navigation styling */
.gp-card           /* Primary card styling */
.gp-card-secondary /* Secondary card styling */
.gp-logo           /* Logo typography */
.gp-btn-primary    /* Primary button styling */
```

## 🌍 Green AI Philosophy

GreenPrint practices what it preaches with sustainability at its core:

- ⚡ **Eco Mode**: Toggle to reduce AI API calls and cache suggestions locally
- 🔄 **Smart Caching**: Reuse AI outputs to minimize compute requirements
- 🌿 **Efficient Models**: Prefer smaller, energy-efficient language models
- 📊 **Transparency**: Display GreenPrint's own carbon footprint
- 🎯 **Actionable Insights**: Focus on suggestions that actually reduce emissions
- 🌐 **Regional Awareness**: Recommend deployments to cleaner energy regions

## 🛠️ Development Guide

### **Code Quality Standards**
The codebase follows strict quality standards:

1. **Component Architecture**: Single responsibility, reusable components
2. **TypeScript First**: Full type safety across the entire application
3. **Performance Optimized**: Lazy loading, code splitting, and efficient rendering
4. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
5. **Responsive Design**: Works seamlessly across all device sizes

### **Recent Improvements**

#### ✅ Navigation Component Extraction
- **Problem**: 80+ lines of duplicated navigation code
- **Solution**: Created reusable `Navigation.tsx` component
- **Benefits**: Single source of truth, better accessibility, type safety

#### ✅ Design System Implementation
- **Problem**: 200+ inline style objects, inconsistent styling
- **Solution**: CSS custom properties + utility class system
- **Benefits**: Better performance, easier theming, consistent design

#### ✅ Error Handling
- **Implementation**: React Error Boundaries with graceful fallbacks
- **Features**: User-friendly error messages, automatic retry options

### **API Design**

GreenPrint features a clean, RESTful API design:

```typescript
// Type-safe API client
export const api = {
  getDashboard: () => apiRequest<DashboardData>('/dashboard'),
  getProjects: () => apiRequest<Project[]>('/projects'),
  createProject: (data: CreateProjectData) => apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Custom error handling
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}
```

### **State Management**

Zustand provides simple, type-safe state management:

```typescript
interface AppState {
  // Data
  dashboardData: DashboardData | null
  projects: Project[]
  integrations: Integration[]
  
  // UI State
  loading: boolean
  ecoMode: boolean
  
  // Actions
  setDashboardData: (data: DashboardData) => void
  toggleEcoMode: () => void
}
```

## 🧪 Testing & Quality

### **Build Status**
- ✅ **TypeScript**: All types validated
- ✅ **ESLint**: No warnings or errors
- ✅ **Build**: Successful compilation
- ✅ **Performance**: Optimized bundle size

### **Development Commands**
```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Code Quality
npm run type-check   # TypeScript validation
npm run format       # Prettier formatting
```

### **Upcoming Testing Infrastructure**
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright
- Performance testing with Lighthouse CI

## 📊 Performance Metrics

### **Bundle Analysis**
- **First Load JS**: ~158KB (optimized)
- **Page Size**: ~26KB (gzipped)
- **Core Web Vitals**: Excellent ratings
- **Lighthouse Score**: 95+ across all metrics

### **Scalability**
- **Serverless Architecture**: Auto-scaling API routes
- **Database**: Supabase with connection pooling
- **CDN**: Vercel Edge Network for global distribution
- **Caching**: Aggressive caching strategies for static assets

## 🔧 Configuration

### **Environment Variables**
See `.env.local.example` for all required and optional environment variables.

### **Deployment**

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/greenprint)

Or deploy manually:
```bash
npm run build
vercel deploy
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the coding standards and add tests
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Style**
- Follow the existing TypeScript and React patterns
- Use the established design system classes
- Add JSDoc comments for complex functions
- Ensure accessibility compliance

## 📚 Documentation

- **API Documentation**: See `src/lib/api.ts` for API client details
- **Component Library**: Check `src/components/` for reusable components
- **Type Definitions**: Reference `src/types/index.ts` for data structures
- **Design System**: See `src/app/globals.css` for styling guidelines

## 🐛 Support

### **Common Issues**
- **Build Errors**: Ensure Node.js 18+ and clean `npm install`
- **Auth Issues**: Verify Clerk environment variables
- **Database Issues**: Check Supabase connection and permissions

### **Getting Help**
- Check existing GitHub Issues
- Review the documentation
- Join our Discord community
- Email support: support@greenprint.dev

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Clerk**: For seamless authentication
- **Supabase**: For the powerful backend
- **Tailwind CSS**: For the utility-first styling
- **Vercel**: For the deployment platform
- **Open Source Community**: For inspiration and contributions
