import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getUserByEmail } from '@/lib/db/queries'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return Response.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  try {
    const user = await getUserByEmail(email)
    
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({ user })
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}