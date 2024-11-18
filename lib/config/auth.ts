export const authConfig = {
  providers: {
    google: true,
    magic: true,
  },
  routes: {
    signIn: '/(auth)/signin',
    callback: '/(auth)/callback',
    dashboard: '/(dashboard)',
  },
  roles: {
    customer: ['booking:create', 'booking:read'],
    cleaner: ['booking:read', 'availability:manage'],
    admin: ['*'],
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
} as const