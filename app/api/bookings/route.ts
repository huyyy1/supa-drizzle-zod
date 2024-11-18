import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withAuth } from '@/lib/auth'
import { createBooking } from '@/lib/db/queries'
import { bookingSchema } from '@/lib/validations/booking'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const data = bookingSchema.parse(json)
    
    const booking = await createBooking(data)
    
    return Response.json({ booking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  
  if (!customerId) {
    return Response.json(
      { error: 'Customer ID is required' },
      { status: 400 }
    )
  }

  try {
    const bookings = await getBookingsByCustomerId(customerId)
    return Response.json({ bookings })
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}