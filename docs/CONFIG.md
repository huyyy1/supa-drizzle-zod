```markdown
# Configuration System Documentation

## Overview

Our configuration system is designed to be:
- Type-safe with TypeScript
- Validated at runtime with Zod
- Centralized in `lib/config`
- Environment-aware
- Immutable using `as const`

## Directory Structure

```
lib/config/
├── index.ts       # Main configuration export
├── env.ts         # Environment variables
├── site.ts        # Site metadata
├── db.ts          # Database configuration
├── auth.ts        # Authentication settings
└── booking.ts     # Booking system config
```

## Setup Guide

1. **Environment Variables**

First, set up your environment variables:

```bash
# .env.local
NODE_ENV=development
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
```

2. **Environment Schema**

Define and validate environment variables:

```typescript
// lib/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  // ... other env vars
})

export const env = envSchema.parse(process.env)
```

3. **Configuration Modules**

Create specific configuration modules:

```typescript
// lib/config/site.ts
export const siteConfig = {
  name: 'SimplyMaid',
  description: 'Professional cleaning services',
  // ... other site config
} as const

// lib/config/db.ts
export const dbConfig = {
  pool: {
    max: parseInt(process.env.DB_POOL_SIZE || '10'),
    // ... other db config
  }
} as const
```

4. **Central Export**

Combine all configurations:

```typescript
// lib/config/index.ts
import { env } from './env'
import { siteConfig } from './site'
import { dbConfig } from './db'
// ... other imports

export const config = {
  env,
  site: siteConfig,
  db: dbConfig,
  // ... other configs
} as const

export type Config = typeof config
```

## Best Practices

### 1. Type Safety

Always use TypeScript and const assertions:

```typescript
// ✅ Good
export const config = {
  maxRetries: 3,
  timeout: 5000,
} as const

// ❌ Bad
export const config = {
  maxRetries: 3,
  timeout: 5000,
}
```

### 2. Environment Variables

- Use Zod for validation
- Provide clear error messages
- Set sensible defaults
- Type all values

```typescript
// ✅ Good
const envSchema = z.object({
  PORT: z.string()
    .transform(Number)
    .pipe(z.number().min(1000).max(65535))
    .default('3000'),
})

// ❌ Bad
const PORT = process.env.PORT || 3000
```

### 3. Configuration Access

Use the centralized config:

```typescript
// ✅ Good
import { config } from '@/lib/config'

function getDatabaseUrl() {
  return config.db.url
}

// ❌ Bad
function getDatabaseUrl() {
  return process.env.DATABASE_URL
}
```

### 4. Feature Flags

Implement type-safe feature flags:

```typescript
// lib/config/features.ts
export const featureFlags = {
  NEW_BOOKING_FLOW: process.env.NODE_ENV === 'development',
  BETA_FEATURES: false,
} as const

// Usage
if (config.features.NEW_BOOKING_FLOW) {
  // New booking flow
}
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for documentation
   - Validate all environment variables
   - Use appropriate access levels (NEXT_PUBLIC_*)

2. **Sensitive Data**
   - Never expose API keys in client code
   - Use server-side environment variables
   - Implement proper secret rotation
   - Audit configuration access

```typescript
// ✅ Good
export const publicConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
} as const

// ❌ Bad
export const config = {
  apiKey: process.env.API_KEY, // Don't expose secrets!
}
```

## Performance Optimization

1. **Configuration Caching**

Cache static configurations:

```typescript
import { cache } from 'react'

export const getConfig = cache(() => {
  return {
    // ... expensive config computation
  }
})
```

2. **Lazy Loading**

Lazy load large configurations:

```typescript
// ✅ Good
const getFeatureConfig = () => import('./features')

// ❌ Bad
import { featureConfig } from './features'
```

3. **Type-Only Imports**

Use type-only imports for config types:

```typescript
// ✅ Good
import type { Config } from '@/lib/config'

// ❌ Bad
import { Config } from '@/lib/config'
```

## Common Pitfalls

1. **Environment Variables**
   - Not validating environment variables
   - Using process.env directly
   - Missing type definitions
   - Incorrect public/private usage

2. **Type Safety**
   - Not using `as const`
   - Missing type definitions
   - Implicit any types
   - Runtime type mismatches

3. **Configuration Structure**
   - Duplicated configuration
   - Inconsistent naming
   - Missing documentation
   - Circular dependencies

## Testing

1. **Environment Mocking**

```typescript
// tests/config.test.ts
import { beforeEach, describe, it, expect } from 'vitest'

describe('Config', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test',
    }
  })

  it('validates environment variables', () => {
    expect(() => import('@/lib/config')).not.toThrow()
  })
})
```

2. **Configuration Validation**

```typescript
// tests/config.test.ts
it('has required configuration', () => {
  const { config } = await import('@/lib/config')
  
  expect(config.db).toBeDefined()
  expect(config.db.pool.max).toBeGreaterThan(0)
})
```

## Deployment

1. **Environment Variables**
   - Set all required variables
   - Validate configuration
   - Use appropriate secrets management
   - Implement proper rotation

2. **Configuration Verification**
   - Add health checks
   - Validate configuration
   - Monitor for issues
   - Log configuration errors

```typescript
// lib/config/verify.ts
export async function verifyConfig() {
  try {
    const { config } = await import('@/lib/config')
    // Verify configuration
    return true
  } catch (error) {
    console.error('Configuration error:', error)
    return false
  }
}
```

## Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
```