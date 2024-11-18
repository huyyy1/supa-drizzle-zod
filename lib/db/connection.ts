import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { withErrorHandler } from '@/lib/error'

// Connection pool configuration
const POOL_CONFIG = {
  max: parseInt(process.env.DB_POOL_SIZE || '10'),
  idleTimeout: 30,
  ssl: process.env.NODE_ENV === 'production',
  connect_timeout: 10,
}

// Create singleton connection
let _connection: ReturnType<typeof postgres> | null = null

export function getConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  if (!_connection) {
    _connection = postgres(process.env.DATABASE_URL, {
      ...POOL_CONFIG,
      connection: {
        options: `-c search_path=public`
      },
      debug: process.env.NODE_ENV === 'development',
      onnotice: () => {}, // Silence notices
    })
  }

  return _connection
}

// Health check with retry mechanism
export async function checkConnection(retries = 3): Promise<boolean> {
  return withErrorHandler(
    async () => {
      const client = getConnection()
      for (let i = 0; i < retries; i++) {
        try {
          await client`SELECT 1`
          return true
        } catch (error) {
          if (i === retries - 1) throw error
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
        }
      }
      return false
    },
    { context: 'database-connection' }
  )
}