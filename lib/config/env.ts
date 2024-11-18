import { z } from 'zod'

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Database
  DATABASE_URL: z.string().url(),
  DB_POOL_SIZE: z.string().transform(Number).default('10'),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  
  // App URLs
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Email
  EMAIL_FROM: z.string().email().optional(),
  BENTONOW_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)