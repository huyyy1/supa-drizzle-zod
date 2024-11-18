export const dbConfig = {
  pool: {
    max: parseInt(process.env.DB_POOL_SIZE || '10'),
    idleTimeout: 30,
    ssl: process.env.NODE_ENV === 'production',
    connect_timeout: 10,
  },
  schema: {
    tables: ['users', 'profiles', 'bookings', 'cities', 'services', 'content'],
    enums: ['user_role', 'booking_status'],
  },
  migrations: {
    path: './lib/db/migrations',
    tableName: 'migrations',
  },
} as const