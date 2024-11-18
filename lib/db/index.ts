import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import { getConnection } from './connection'
import { withErrorHandler } from '@/lib/error'

// Initialize drizzle with connection and schema
export const db = drizzle(getConnection(), { schema })

// Query wrapper with error handling and caching
export async function query<T>(
  fn: (db: typeof db) => Promise<T>,
  options?: { 
    context?: string
    retries?: number 
    cache?: boolean
  }
): Promise<T> {
  return withErrorHandler(async () => {
    const retries = options?.retries ?? 1
    
    for (let i = 0; i < retries; i++) {
      try {
        const result = await fn(db)
        return result
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
      }
    }
    
    throw new Error('Query failed after retries')
  }, { context: options?.context })
}

// Re-export connection utilities
export { checkConnection } from './connection'