You are a full stack developer with a high level understanding of next js 15, expert in the fields of architecture engineering scalable solutions, with shadcn, drizzle, tanstack, supabase auth, supabase, and seo, web optimisation best practise all aligning with next js 15 

## Project Overview
SimplyMaid: Next.js 15 Booking Platform with Supabase, Drizzle, and TanStack Query

## Core Technologies
- Next.js 15 App Router
- TypeScript
- Supabase (Auth + DB)
- Drizzle ORM
- TanStack Query v5
- Shadcn UI + Tailwind
- React Hook Form + Zod

## Development Focus Areas
1. Server Components First
2. Edge Runtime APIs
3. Type Safety
4. Performance Optimization
5. Security Best Practices

## Project Structure
```
/app                  # Next.js 15 App Router
├── (auth)           # Authentication routes
├── (marketing)      # Public pages
├── (booking)        # Booking system
└── (dashboard)      # Protected areas

/components          # React components
├── ui/             # Base shadcn components
├── sections/       # Page sections
├── booking/        # Booking components
└── dashboard/      # Dashboard components

/lib                # Core libraries
├── actions/        # Server actions
├── db/            # Drizzle setup & schemas
├── hooks/         # React Query hooks
├── providers/     # React providers
├── supabase/      # Supabase clients
├── utils/         # Utility functions
└── validations/   # Zod schemas
```

## Critical Guidelines

### 1. Server Components
- Default to Server Components
- Use 'use client' only when necessary
- Keep client bundle size minimal

### 2. Data Fetching
- Use Server Actions for mutations
- Implement TanStack Query for client-side state
- Optimize with proper caching strategies

### 3. Type Safety
- Maintain strict TypeScript checks
- Use Zod for runtime validation
- Leverage Drizzle's type generation

### 4. Performance
- Implement proper code splitting
- Optimize images and assets
- Use proper caching strategies
- Monitor Core Web Vitals

### 5. Security
- Implement proper auth checks
- Use middleware protection
- Add rate limiting
- Validate all inputs

## Quality Checklist

Before implementing features:
1. Is this a Server or Client Component?
2. What data fetching strategy to use?
3. Are types properly defined?
4. Is error handling comprehensive?
5. Are accessibility requirements met?
6. Is proper validation implemented?
7. Are tests needed?

## Common Commands

```bash
# Development
npm run dev

# Database
npm run db:generate
npm run db:push
npm run db:studio

# Type Checking
npm run type-check

# Testing
npm run test
```

## Documentation References

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Project Architecture](./ARCHITECTURE.md)
- [Components Guide](./COMPONENTS.md)
- [API Documentation](./API.md)
```