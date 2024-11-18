'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { AppError } from '@/lib/error'
import { cache } from 'react'

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function signUp(email: string) {
  try {
    const parsed = signUpSchema.parse({ email })
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      throw new AppError(error.message, 'AUTH_ERROR', 400)
    }

    revalidatePath('/')
    redirect('/auth/verify')
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Invalid input', 'VALIDATION_ERROR', 400, {
        errors: error.errors,
      })
    }
    throw error
  }
}

export async function signOut() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new AppError(error.message, 'AUTH_ERROR', 400)
    }

    revalidatePath('/')
    redirect('/')
  } catch (error) {
    throw error
  }
}

export const getUser = cache(async () => {
  try {
    const supabase = createClient()
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new AppError(error.message, 'AUTH_ERROR', 400)
    }
    
    if (!session?.user) return null

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))

    return user
  } catch (error) {
    throw error
  }
})