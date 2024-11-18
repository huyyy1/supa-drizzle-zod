import { env } from './env'
import { siteConfig } from './site'
import { dbConfig } from './db'
import { authConfig } from './auth'
import { bookingConfig } from './booking'

export const config = {
  env,
  site: siteConfig,
  db: dbConfig,
  auth: authConfig,
  booking: bookingConfig,
} as const

export type Config = typeof config