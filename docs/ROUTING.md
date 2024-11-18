# Next.js 15 Routing Architecture

## Overview

Our application uses Next.js 15's advanced routing features including:
- Route Groups
- Parallel Routes
- Intercepted Routes
- Dynamic Routes
- Static Site Generation

## Route Structure

```
app/
├── (auth)/           # Authentication routes
│   ├── login/       # Login page
│   └── callback/    # Auth callback
├── (marketing)/     # Public marketing pages
│   ├── [city]/     # Dynamic city pages
│   └── services/   # Service pages
├── (booking)/      # Booking system
│   ├── @modal     # Modal parallel route
│   ├── @summary   # Summary parallel route
│   └── flow/      # Booking flow
└── (dashboard)/    # Protected dashboard
    ├── @modal     # Modal parallel route
    ├── customer/  # Customer dashboard
    └── admin/     # Admin dashboard
```

## Parallel Routes

We use parallel routes for complex UI patterns:

```typescript
// (booking)/layout.tsx
export default function BookingLayout({
  children,
  modal,
  summary,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  summary: React.ReactNode
}) {
  return (
    <>
      {modal}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">{children}</div>
        <div className="md:col-span-1">{summary}</div>
      </div>
    </>
  )
}
```

## Static Site Generation

We use static site generation for marketing pages:

```typescript
// (marketing)/[city]/page.tsx
export async function generateStaticParams() {
  return getAllCitySlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityData = await getCityData(params.city)
  // ...
}
```

## Route Protection

Protected routes use middleware and server components:

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ]
}

// (dashboard)/layout.tsx
export default async function DashboardLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/login')
  
  return (
    <>
      {modal}
      {children}
    </>
  )
}
```

## Best Practices

1. **Route Groups**
   - Use for logical organization
   - Prevent route segment naming conflicts
   - Share layouts between routes

2. **Parallel Routes**
   - Complex UI patterns
   - Independent loading states
   - Modals and sidebars

3. **Static Generation**
   - Marketing pages
   - City and service pages
   - Blog posts

4. **Server Components**
   - Default to server components
   - Use 'use client' only when needed
   - Keep client bundle size minimal

5. **Error Handling**
   - Use error.tsx for error boundaries
   - Implement loading.tsx for suspense
   - Add not-found.tsx for 404 pages