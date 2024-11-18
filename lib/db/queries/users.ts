import { eq } from 'drizzle-orm'
import { users, profiles } from '@/lib/db/schema'
import { query, db } from '@/lib/db'
import { AppError } from '@/lib/error'

export async function getUserById(id: string) {
  return query(
    async (db) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .leftJoin(profiles, eq(users.id, profiles.id))
      
      if (!user) {
        throw new AppError('User not found', 'NOT_FOUND', 404)
      }
      
      return user
    },
    { context: 'get-user-by-id', retries: 2 }
  )
}

export async function getUserByEmail(email: string) {
  return query(
    async (db) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .leftJoin(profiles, eq(users.id, profiles.id))
      
      if (!user) {
        throw new AppError('User not found', 'NOT_FOUND', 404)
      }
      
      return user
    },
    { context: 'get-user-by-email', retries: 2 }
  )
}