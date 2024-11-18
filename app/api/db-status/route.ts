import { type NextRequest } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const isConnected = await checkDatabaseConnection()
    
    return Response.json({
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return Response.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}