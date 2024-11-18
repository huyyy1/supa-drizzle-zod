import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { users, profiles, bookings } from './schema'
import type { User, Profile, Booking } from './schema'

// User queries
export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  return user
}

// Profile queries
export async function getProfileById(id: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
  return profile
}

export async function updateProfile(id: string, data: Partial<Profile>) {
  const [profile] = await db
    .update(profiles)
    .set(data)
    .where(eq(profiles.id, id))
    .returning()
  return profile
}

// Booking queries
export async function getBookingById(id: string) {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
  return booking
}

export async function getBookingsByCustomerId(customerId: string) {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.customerId, customerId))
}

export async function getBookingsForCleaner(cleanerId: string) {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.cleanerId, cleanerId))
}

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
  const [booking] = await db
    .insert(bookings)
    .values(data)
    .returning()
  return booking
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  const [booking] = await db
    .update(bookings)
    .set(data)
    .where(eq(bookings.id, id))
    .returning()
  return booking
}