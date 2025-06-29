# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Idynic Web is a Next.js/TypeScript frontend application that serves as a Strategic Identity & Solution Platform. It implements a "Generate, Review, Refine" user experience model where users can:

1. **Generate**: Build identity through evidence submission (resumes, experiences, certifications)
2. **Review**: Analyze job opportunities and generate targeted solutions
3. **Refine**: Improve solutions through AI-powered streaming refinement

## Development Commands

```bash
# Development
npm run dev                 # Start development server on localhost:3000
npm run build              # Build for production
npm start                  # Start production server

# Testing
npm run test               # Run Jest tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report

# Code Quality
npm run lint              # Run ESLint (configured to ignore during builds)
```

## Architecture & Key Patterns

### App Router Structure
- Uses Next.js 15 App Router with TypeScript
- Server-side rendering for public solution pages (`/s/[solutionId]`)
- Client-side routing for authenticated user areas

### State Management
- **TanStack Query (React Query)**: Server state management and caching
- **React Context**: Authentication state via `AuthProvider`
- **Local Storage**: JWT token persistence (access_token, refresh_token, id_token)

### Authentication Flow
- JWT-based authentication with Atriumn Auth Service integration
- Automatic token refresh using refresh tokens
- Protected routes via `ProtectedRoute` component
- Federated auth support (Google, Apple, Microsoft)

### API Architecture
Two distinct API clients in `src/lib/api.ts`:
- **apiClient**: Main backend API (opportunities, solutions, identity)
- **mcpClient**: MCP Tools API (trait extraction, job analysis, application strategies)

### Key Data Flow
1. **Identity Management**: Evidence submission → trait extraction → identity graph updates
2. **Opportunity Analysis**: Job posting URL/text → AI analysis → structured opportunity data
3. **Solution Generation**: Opportunity + user identity → AI-generated solutions → refinement via streaming chat

### Component Structure
- **UI Components**: Located in `src/components/ui/` using shadcn/ui with Radix primitives
- **Feature Components**: Modal-based interactions (analyze-opportunity-modal, feed-evidence-modal)
- **Layout**: Header/Footer with responsive navigation

### Environment Configuration
Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_AUTH_BASE_URL`: Atriumn Auth Service endpoint
- `NEXT_PUBLIC_MCP_BASE_URL`: MCP Tools API endpoint (optional, defaults to localhost:9001)

### Testing Strategy
- Jest with jsdom environment
- React Testing Library for component testing
- Test files in `src/__tests__/` with coverage for auth, API, and components
- Setup file: `jest.setup.js`

## Important Implementation Details

### Build Configuration
- ESLint and TypeScript errors are ignored during builds (set in `next.config.ts`)
- This allows for rapid development but requires manual testing before deployment

### API Integration Points
- All API calls include automatic JWT token injection via axios interceptors
- Token refresh is handled automatically on 401 responses
- MCP Tools API provides specialized AI functions for trait extraction and job analysis

### Public vs Private Content
- Solutions can be marked as public for SEO-optimized sharing
- Public solution pages use server-side rendering for better social media integration
- Private solutions require authentication to access