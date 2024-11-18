import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const connection = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(connection)

  console.log('⏳ Running migrations...')
  
  await migrate(db, {
    migrationsFolder: './lib/db/migrations'
  })
  
  console.log('✅ Migrations completed!')
  process.exit(0)
}