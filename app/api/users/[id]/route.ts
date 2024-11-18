import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getUserById } from '@/lib/db/queries/users'
import { withErrorHandler } from '@/lib/error'

export const runtime = 'edge'

const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const user = await getUserById(params.id)
    return Response.json(user)
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const data = userUpdateSchema.parse(await request.json())
    // Implementation for updating user
    return Response.json({ success: true })
  })
}