# GreenPrint API Documentation

This document provides comprehensive documentation for all API endpoints, data structures, and integration patterns in the GreenPrint application.

## API Overview

GreenPrint uses a RESTful API architecture built with Next.js API routes. All endpoints are type-safe with Zod validation and include proper error handling.

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication
All API routes use Clerk authentication. Users must be signed in to access protected endpoints.

### Response Format
All API responses follow a consistent format:

```typescript
// Success Response
{
  data: T,           // Response data (type varies by endpoint)
  status: number     // HTTP status code (200, 201, etc.)
}

// Error Response  
{
  error: string,     // Human-readable error message
  details?: object,  // Additional error details (validation errors, etc.)
  status: number     // HTTP status code (400, 401, 500, etc.)
}
```

---

## Authentication Endpoints

### Current User
**GET** `/api/user`

Returns information about the currently authenticated user.

**Response**:
```typescript
{
  data: {
    id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
    lastSignInAt: string
  }
}
```

**Example**:
```javascript
const response = await fetch('/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
const { data } = await response.json()
console.log(data.firstName) // "John"
```

---

## Dashboard Endpoints

### Get Dashboard Data
**GET** `/api/dashboard`

Returns comprehensive dashboard data including emissions, statistics, and insights.

**Response**:
```typescript
{
  data: {
    totalEmissions: number        // Total CO2 in kg
    weeklyReduction: number       // Weekly reduction percentage
    activeProjects: number        // Number of monitored projects
    co2Saved: number             // Total CO2 saved in kg
    
    // Weekly emissions chart data
    weeklyData: Array<{
      day: string                // Day name (Mon, Tue, etc.)
      emissions: number          // CO2 emissions for that day
    }>
    
    // Top emission sources
    topEmissionSources: Array<{
      source: string             // Source name (GitHub Actions, AI Usage, etc.)
      emissions: number          // CO2 emissions in kg
      percentage: number         // Percentage of total emissions
    }>
    
    // AI-generated optimization suggestions
    suggestions: Array<{
      id: string                 // Unique suggestion ID
      title: string              // Short title
      description: string        // Detailed description
      impact: 'High' | 'Medium' | 'Low'  // Impact level
      co2Savings: number         // Potential CO2 savings in kg
      type: string               // Category (cicd, ai, deployment, etc.)
    }>
  }
}
```

**Example**:
```javascript
const response = await fetch('/api/dashboard')
const { data } = await response.json()

console.log(`Total emissions: ${data.totalEmissions} kg CO2`)
console.log(`Weekly reduction: ${data.weeklyReduction}%`)
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

---

## Projects Endpoints

### List Projects
**GET** `/api/projects`

Returns all projects associated with the current user.

**Response**:
```typescript
{
  data: Array<{
    id: string                   // Project ID
    userId: string               // Owner user ID
    name: string                 // Project name
    githubRepo: string           // GitHub repository (owner/repo)
    vercelProjectId?: string     // Vercel project ID (optional)
    totalEmissions: number       // Total project emissions in kg CO2
    createdAt: string           // ISO timestamp
    lastUpdated: string         // ISO timestamp
  }>
}
```

**Example**:
```javascript
const response = await fetch('/api/projects')
const { data } = await response.json()

data.forEach(project => {
  console.log(`${project.name}: ${project.totalEmissions} kg CO2`)
})
```

### Create Project
**POST** `/api/projects`

Creates a new project for emissions tracking.

**Request Body**:
```typescript
{
  name: string          // Project name (1-100 characters)
  githubRepo: string    // GitHub repository in format "owner/repo"
  vercelProjectId?: string  // Optional Vercel project ID
}
```

**Validation Rules**:
- `name`: Required, 1-100 characters, trimmed
- `githubRepo`: Required, must match pattern `owner/repo`
- `vercelProjectId`: Optional, string

**Response**:
```typescript
{
  data: {
    id: string                   // Generated project ID
    userId: string               // Current user ID
    name: string                 // Project name
    githubRepo: string           // GitHub repository
    vercelProjectId?: string     // Vercel project ID
    totalEmissions: number       // Initial emissions (0)
    createdAt: string           // ISO timestamp
  }
}
```

**Example**:
```javascript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Green App',
    githubRepo: 'user/my-green-app',
    vercelProjectId: 'prj_abc123'
  })
})

const { data } = await response.json()
console.log(`Created project: ${data.id}`)
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: User not authenticated
- `409 Conflict`: Project with same GitHub repo already exists
- `500 Internal Server Error`: Server error

**Validation Error Example**:
```typescript
{
  error: "Validation failed",
  details: {
    name: ["String must contain at least 1 character(s)"],
    githubRepo: ["Invalid GitHub repository format"]
  },
  status: 400
}
```

### Update Project
**PUT** `/api/projects/:id`

Updates an existing project's information.

**Parameters**:
- `id`: Project ID (URL parameter)

**Request Body**:
```typescript
{
  name?: string         // Optional new project name
  githubRepo?: string   // Optional new GitHub repository  
  vercelProjectId?: string  // Optional new Vercel project ID
}
```

**Response**: Same as Create Project

### Delete Project
**DELETE** `/api/projects/:id`

Deletes a project and all associated emissions data.

**Parameters**:
- `id`: Project ID (URL parameter)

**Response**:
```typescript
{
  data: {
    message: "Project deleted successfully"
  }
}
```

---

## Emissions Endpoints

### Get Project Emissions
**GET** `/api/projects/:id/emissions`

Returns emissions data for a specific project.

**Parameters**:
- `id`: Project ID (URL parameter)

**Query Parameters**:
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `source`: Filter by emission source (optional)

**Response**:
```typescript
{
  data: Array<{
    id: string                   // Emission record ID
    projectId: string            // Project ID
    source: 'github' | 'vercel' | 'ai' | 'other'  // Emission source
    co2kg: number               // CO2 emissions in kg
    timestamp: string           // When emission occurred
    metadata?: object           // Additional data (workflow ID, etc.)
  }>
}
```

**Example**:
```javascript
// Get emissions for last 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
const response = await fetch(`/api/projects/proj_123/emissions?startDate=${thirtyDaysAgo}`)
const { data } = await response.json()
```

### Record Emission
**POST** `/api/projects/:id/emissions`

Records a new emission for a project.

**Parameters**:
- `id`: Project ID (URL parameter)

**Request Body**:
```typescript
{
  source: 'github' | 'vercel' | 'ai' | 'other'  // Emission source
  co2kg: number               // CO2 emissions in kg (must be positive)
  metadata?: object           // Optional additional data
}
```

**Response**:
```typescript
{
  data: {
    id: string                   // Generated emission ID
    projectId: string            // Project ID
    source: string              // Emission source
    co2kg: number               // CO2 emissions
    timestamp: string           // ISO timestamp
    metadata?: object           // Additional data
  }
}
```

---

## Integrations Endpoints

### List Integrations
**GET** `/api/integrations`

Returns all available integrations and their connection status.

**Response**:
```typescript
{
  data: Array<{
    id: string                   // Integration ID
    name: string                 // Display name
    status: 'connected' | 'disconnected' | 'error'  // Connection status
    icon: string                 // Icon identifier
    description: string          // Short description
    permissions?: Array<string>  // Required permissions
    lastSync?: string           // Last sync timestamp
  }>
}
```

**Example**:
```javascript
const response = await fetch('/api/integrations')
const { data } = await response.json()

const githubIntegration = data.find(i => i.id === 'github')
console.log(`GitHub status: ${githubIntegration.status}`)
```

### Connect Integration
**POST** `/api/integrations/:id/connect`

Initiates connection flow for an integration.

**Parameters**:
- `id`: Integration ID (URL parameter)

**Request Body**:
```typescript
{
  settings?: object            // Integration-specific settings
}
```

**Response**:
```typescript
{
  data: {
    redirectUrl?: string         // OAuth redirect URL (if applicable)
    message: string             // Success message
    status: 'connected' | 'pending'  // Connection status
  }
}
```

### Disconnect Integration
**DELETE** `/api/integrations/:id`

Disconnects an integration and removes associated data.

**Parameters**:
- `id`: Integration ID (URL parameter)

**Response**:
```typescript
{
  data: {
    message: "Integration disconnected successfully"
  }
}
```

---

## Webhooks

### GitHub Actions Webhook
**POST** `/api/webhooks/github`

Receives GitHub Actions workflow completion webhooks.

**Headers**:
- `X-GitHub-Event`: Event type
- `X-Hub-Signature-256`: HMAC signature

**Request Body**: GitHub webhook payload

### Vercel Deployment Webhook  
**POST** `/api/webhooks/vercel`

Receives Vercel deployment completion webhooks.

**Headers**:
- `X-Vercel-Signature`: HMAC signature

**Request Body**: Vercel webhook payload

---

## Data Types

### User Type
```typescript
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  lastSignInAt: string
}
```

### Project Type
```typescript
interface Project {
  id: string
  userId: string
  name: string
  githubRepo: string
  vercelProjectId?: string
  totalEmissions: number
  createdAt: string
  lastUpdated: string
}
```

### Emission Type
```typescript
interface Emission {
  id: string
  projectId: string
  source: 'github' | 'vercel' | 'ai' | 'other'
  co2kg: number
  timestamp: string
  metadata?: {
    workflowId?: string
    deploymentId?: string
    modelName?: string
    [key: string]: any
  }
}
```

### Integration Type
```typescript
interface Integration {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  icon: string
  description: string
  permissions?: string[]
  lastSync?: string
}
```

---

## Error Handling

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation failed
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Request valid but cannot be processed
- **500 Internal Server Error**: Server error

### Error Response Format

```typescript
{
  error: string,           // Human-readable error message
  details?: {              // Additional error details
    field?: string[],      // Field-specific validation errors
    code?: string,         // Error code for programmatic handling
    timestamp?: string     // Error timestamp
  },
  status: number          // HTTP status code
}
```

### Common Errors

**Validation Error**:
```typescript
{
  error: "Validation failed",
  details: {
    name: ["String must contain at least 1 character(s)"],
    githubRepo: ["Invalid GitHub repository format"]
  },
  status: 400
}
```

**Authentication Error**:
```typescript
{
  error: "Authentication required",
  details: {
    code: "UNAUTHENTICATED",
    message: "Please sign in to access this resource"
  },
  status: 401
}
```

**Not Found Error**:
```typescript
{
  error: "Project not found",
  details: {
    code: "PROJECT_NOT_FOUND",
    projectId: "proj_123"
  },
  status: 404
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authenticated requests**: 1000 requests per hour per user
- **Webhook endpoints**: 100 requests per minute per integration
- **Public endpoints**: 100 requests per hour per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

## SDK and Client Libraries

### JavaScript/TypeScript Client

```typescript
import { GreenPrintAPI } from '@greenprint/sdk'

const client = new GreenPrintAPI({
  baseURL: 'https://your-domain.com/api',
  token: 'your-auth-token'
})

// Get dashboard data
const dashboard = await client.dashboard.get()

// Create a project
const project = await client.projects.create({
  name: 'My Project',
  githubRepo: 'user/repo'
})

// Record an emission
await client.emissions.create(project.id, {
  source: 'github',
  co2kg: 1.5,
  metadata: { workflowId: 'workflow_123' }
})
```

### Example Integrations

**GitHub Actions Integration**:
```typescript
// Monitor GitHub Actions emissions
const emissions = await client.integrations.github.getEmissions({
  repo: 'user/repo',
  since: '2024-01-01'
})
```

**Vercel Integration**:
```typescript
// Track deployment emissions
const deploymentEmissions = await client.integrations.vercel.getDeployments({
  projectId: 'prj_123',
  limit: 50
})
```

---

## Testing

### API Testing

All endpoints include comprehensive test coverage:

```bash
# Run API tests
npm run test:api

# Run specific endpoint tests
npm run test:api -- projects

# Run integration tests
npm run test:integration
```

### Mock Data

For development and testing, mock data is available:

```typescript
import { mockDashboardData, mockProjectsData } from '@/lib/mockData'

// Use mock data in development
const dashboardData = process.env.NODE_ENV === 'development' 
  ? mockDashboardData 
  : await fetchRealDashboardData()
```

---

This API documentation is updated automatically as endpoints are added or modified. For the most current information, refer to the OpenAPI specification at `/api/docs` when available.
