# SimplyMaid - Next.js 15 Booking Platform

A modern, scalable booking platform & marketing website for SimplyMaid designed to innovate house cleaning services across major Australian cities.

## Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle + Drizzle Zod
- **State Management**: TanStack Query v5
- **UI Components**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Authentication**: Supabase Auth + SSR
- **Storage**: Supabase Storage
- **Payments**: LAUNCH27 API Integration
- **Email**: BentoNow + React Email

## Project Structure

```
app/
├── (auth)/                # Authentication routes
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── verify/           # Email verification
│   └── callback/         # OAuth callback
│
├── (marketing)/          # Public pages & SEO content
│   ├── page.tsx         # Homepage
│   ├── [city]/          # Dynamic city pages
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── services/        # Service pages
│       └── [service]/
│           ├── page.tsx
│           └── layout.tsx
│
├── (booking)/           # Booking system
│   ├── @modal/         # Modal parallel route
│   │   ├── default.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── @summary/       # Summary parallel route
│   │   ├── default.tsx
│   │   └── page.tsx
│   ├── flow/           # Booking flow
│   │   └── page.tsx
│   └── layout.tsx
│
└── (dashboard)/         # Protected areas
    ├── @modal/         # Modal parallel route
    │   ├── default.tsx
    │   └── [id]/
    │       └── page.tsx
    ├── customer/       # Customer dashboard
    │   └── page.tsx
    ├── admin/         # Admin dashboard
    │   └── page.tsx
    └── layout.tsx

components/
├── ui/                # Base shadcn components
├── sections/          # Page sections
├── booking/          # Booking components
└── dashboard/        # Dashboard components

lib/
├── actions/          # Server actions
├── db/              # Drizzle setup & schemas
├── hooks/           # React Query hooks
├── providers/       # React providers
├── supabase/        # Supabase clients
├── utils/           # Utility functions
└── validations/     # Zod schemas
```

## Features

- 🏠 **Location-Based Services**: City-specific landing pages with SEO optimization
- 📅 **Smart Booking System**: Real-time availability with parallel routes
- 👥 **Multi-User Platform**: Customer, cleaner, and admin portals
- 📱 **Responsive Design**: Optimized for all devices
- 🔍 **SEO Optimized**: City and service-specific content
- ⚡ **Performance First**: Built for speed and reliability

## Getting Started

1. Clone and install dependencies:
```bash
git clone https://github.com/yourusername/simplymaid.git
cd simplymaid
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

## Development Workflow

### Database Changes
```bash
# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Type Checking
```bash
# Run TypeScript compiler
npm run type-check

# Run ESLint
npm run lint
```

## Environment Variables

Required variables:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/simplymaid
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## License

This project is private and confidential.