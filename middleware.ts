import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { rateLimiter, authRateLimiter } from '@/lib/middleware/rate-limit'

export const config = {
  matcher: [
    '/(dashboard)/:path*',
    '/api/:path*',
    '/(booking)/:path*',
  ],
}

export async function middleware(request: NextRequest) {
  try {
    // Apply rate limiting
    if (request.nextUrl.pathname.startsWith('/api')) {
      const rateLimitResponse = await rateLimiter(request)
      if (rateLimitResponse.status === 429) {
        return rateLimitResponse
      }
    }

    // Apply stricter rate limiting for auth routes
    if (request.nextUrl.pathname.startsWith('/(auth)')) {
      const authLimitResponse = await authRateLimiter(request)
      if (authLimitResponse.status === 429) {
        return authLimitResponse
      }
    }

    // Create supabase client
    const { supabase, response } = createClient(request)

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // CSRF protection for non-GET requests
    if (request.method !== 'GET') {
      const token = request.headers.get('x-csrf-token')
      if (!token || token !== session?.csrf_token) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        )
      }
    }

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/(dashboard)')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Check role-based access
      if (
        request.nextUrl.pathname.startsWith('/(dashboard)/admin') && 
        session.user.role !== 'admin'
      ) {
        return NextResponse.redirect(new URL('/(dashboard)', request.url))
      }
    }

    // Protect booking routes
    if (request.nextUrl.pathname.startsWith('/(booking)')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // API route protection
    if (request.nextUrl.pathname.startsWith('/api')) {
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.error()
  }
}