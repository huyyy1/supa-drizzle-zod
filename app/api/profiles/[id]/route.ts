import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getProfileById, updateProfile } from '@/lib/db/queries'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await getProfileById(params.id)
    
    if (!profile) {
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return Response.json({ profile })
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const profile = await updateProfile(params.id, json)
    
    return Response.json({ profile })
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}