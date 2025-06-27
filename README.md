# Idynic Web Frontend

A Next.js/TypeScript web application that serves as a Strategic Identity & Solution Platform, based on the "Generate, Review, Refine" user experience model.

## Features

### 🏠 Landing & Authentication
- **Landing Page**: Welcome page with feature overview
- **Authentication**: Full user authentication with email/password and JWT tokens
- **Federated Auth**: Sign in with Google, Apple, and Microsoft
- **Account Management**: User signup, email confirmation, password reset
- **Protected Routes**: Secure access to dashboard and user areas

### 📊 Identity Dashboard
- **Identity Graph Visualization**: "Trait Constellation" display
- **Profile Completion**: Progress tracking and strength indicators
- **Feed Your Identity**: Multi-modal evidence submission (resume, experience, certifications, education)
- **Recent Activity**: Overview of opportunities and solutions

### 🎯 Opportunity Management
- **Analyze Opportunity**: Submit job postings via URL or text
- **Opportunity Workspace**: Detailed analysis with skill matching
- **Profile Alignment**: Visual match percentage and recommendations
- **Generate Solution**: AI-powered solution creation

### ✨ Solution Review & Refinement
- **Solution Display**: Clean presentation of value proposition and impact history
- **Real-time Refinement**: Streaming AI chat for solution improvement
- **Export Functions**: Download as cover letter, resume, or LinkedIn post
- **Publish & Share**: Create public, shareable solution links

### 🌐 Public Solution Pages
- **Server-side Rendering**: SEO-optimized public solution display
- **Social Sharing**: Open Graph and Twitter Card meta tags
- **Professional Presentation**: Clean, branded solution showcase

### 🔑 API Key Management
- **Create API Keys**: Generate API keys for programmatic access
- **Key Management**: View, activate/deactivate, and delete API keys
- **Usage Tracking**: Monitor API key usage and expiration
- **Security**: Secure key generation with expiration dates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **AI Integration**: Vercel AI SDK for streaming refinement
- **Authentication**: Atriumn Auth Service integration with JWT tokens and federated auth

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to idynic-backend API

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://u8ryhgkdri.execute-api.us-east-1.amazonaws.com
   NEXT_PUBLIC_AUTH_BASE_URL=https://dev.auth.atriumn.com
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Key User Flows

### 1. Generate (Build Identity)
1. User submits evidence via "Feed Your Identity"
2. Evidence is processed and integrated into identity graph
3. Trait constellation is updated with new capabilities

### 2. Review (Analyze Opportunities)
1. User submits job posting via "Analyze Opportunity"
2. AI extracts requirements and analyzes alignment
3. Match score and detailed comparison is displayed
4. User can generate targeted solution

### 3. Refine (Improve Solutions)
1. Generated solution is displayed in review interface
2. User provides refinement instructions via chat
3. AI streams improved solution content in real-time
4. User can export in multiple formats or publish publicly
