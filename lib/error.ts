import { z } from 'zod'

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'DATABASE_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_ERROR'

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }

  static fromZodError(error: z.ZodError): AppError {
    return new AppError('Validation failed', 'VALIDATION_ERROR', 400, {
      errors: error.errors,
    })
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) return error
    if (error instanceof z.ZodError) return AppError.fromZodError(error)
    if (error instanceof Error) {
      return new AppError(error.message, 'INTERNAL_ERROR', 500)
    }
    return new AppError('An unknown error occurred', 'INTERNAL_ERROR', 500)
  }
}

export async function withErrorHandler<T>(
  fn: () => Promise<T>,
  options?: {
    rethrow?: boolean
    context?: string
  }
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const appError = AppError.fromUnknown(error)
    
    console.error(`Error in ${options?.context || 'unknown context'}:`, {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      metadata: appError.metadata,
    })

    if (options?.rethrow) throw appError
    throw appError
  }
}