```markdown
# Next.js 15 Best Practices

## App Router Architecture

### Route Organization
```
app/
├── (auth)/           # Auth group
│   ├── login/       # Login page
│   └── register/    # Register page
├── (marketing)/     # Marketing group
│   ├── blog/        # Blog section
│   └── about/       # About page
├── api/             # API routes
│   └── trpc/        # tRPC router
└── layout.tsx       # Root layout
```

### Component Organization
```
components/
├── ui/             # Reusable UI components
├── features/       # Feature-specific components
└── providers/      # React context providers
```

## Server Components

### Default to Server Components
```tsx
// app/page.tsx
export default async function Page() {
  // This is a Server Component by default
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Client Components When Needed
```tsx
'use client'

// Only use when you need:
// 1. Event listeners
// 2. Browser APIs
// 3. State or lifecycle effects
// 4. Client-side libraries
```

### Component Patterns
```tsx
// Good: Colocate client components
export default async function ServerPage() {
  const data = await fetchData()
  return (
    <div>
      <ServerComponent data={data} />
      <ClientComponent data={data} />
    </div>
  )
}

// Bad: Avoid client component wrapper
'use client'
export default function ClientPage() {
  return <ServerComponent /> // ❌ Server component inside client
}
```

## Data Fetching

### Server Actions
```tsx
// app/actions.ts
'use server'

export async function createItem(data: FormData) {
  const title = data.get('title')
  await db.items.create({ data: { title } })
}

// app/page.tsx
export default function Page() {
  return (
    <form action={createItem}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

### React Query Integration
```tsx
// hooks/use-items.ts
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => fetch('/api/items').then(res => res.json()),
    staleTime: 60 * 1000, // 1 minute
  })
}

// components/items-list.tsx
'use client'
export function ItemsList() {
  const { data, isLoading } = useItems()
  if (isLoading) return <Loading />
  return <ul>{data.map(item => <li key={item.id}>{item.title}</li>)}</ul>
}
```

## Performance Optimization

### Route Segments
```tsx
// Loading UI
export default function Loading() {
  return <LoadingSkeleton />
}

// Error handling
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// Not Found
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>
}
```

### Image Optimization
```tsx
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  }
}

// components/optimized-image.tsx
import Image from 'next/image'

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
```

### Metadata
```tsx
// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Site Title',
    template: '%s | Site Title',
  },
  description: 'Site description',
  openGraph: {
    title: 'Site Title',
    description: 'Site description',
    url: 'https://example.com',
    siteName: 'Site Title',
    locale: 'en_US',
    type: 'website',
  },
}

// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

## State Management

### Server State
```tsx
// Use React Query for server state
export function useServerState() {
  return useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
```

### Client State
```tsx
// Use React state for UI state
'use client'
export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

## Authentication

### Middleware Protection
```tsx
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const session = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}
```

### Protected Routes
```tsx
// app/(protected)/layout.tsx
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')
  
  return <div>{children}</div>
}
```

## Error Handling

### Error Boundaries
```tsx
'use client'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### API Error Handling
```tsx
// lib/api-error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// app/api/items/route.ts
export async function GET() {
  try {
    const items = await db.items.findMany()
    return Response.json(items)
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## Testing

### Component Testing
```tsx
// components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### API Testing
```tsx
// app/api/items/route.test.ts
import { GET } from './route'

describe('Items API', () => {
  it('returns items', async () => {
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })
})
```

## Build Optimization

### Bundle Analysis
```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

### Code Splitting
```tsx
// Dynamic imports
const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Loading />,
  ssr: false,
})

// Route groups for code splitting
app/
├── (marketing)/     # Bundle 1
├── (dashboard)/    # Bundle 2
└── (admin)/        # Bundle 3
```

## Environment Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...

# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

### Runtime Configuration
```tsx
// lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  isProduction: process.env.NODE_ENV === 'production',
  features: {
    newDashboard: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',
  },
}
```

## Deployment

### Production Builds
```bash
# Build optimizations
npm run build

# Output: 
# ├ ○ /                                    2.6 kB        
# ├ ○ /favicon.ico                         100 B
# ├ λ /api/items                           1.2 kB
# └ ● /dashboard                           15 kB
```

### Cache Configuration
```tsx
// Route segment config
export const revalidate = 3600 // 1 hour

// Dynamic data
export const dynamic = 'force-dynamic'

// Cache-Control headers
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```
```