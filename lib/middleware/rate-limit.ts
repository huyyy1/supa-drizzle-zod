import rateLimit from 'express-rate-limit'
import { NextResponse } from 'next/server'

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  handler: (_, __, ___, options) => {
    return NextResponse.json(
      { error: options.message },
      { status: 429 }
    )
  }
})

export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later',
  handler: (_, __, ___, options) => {
    return NextResponse.json(
      { error: options.message },
      { status: 429 }
    )
  }
})