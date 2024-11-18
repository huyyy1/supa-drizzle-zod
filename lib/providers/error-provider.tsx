'use client'

import { createContext, useContext } from 'react'
import { AppError } from '@/lib/error'
import { toast } from '@/components/ui/toast'

interface ErrorContextType {
  handleError: (error: unknown) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const handleError = (error: unknown) => {
    const appError = AppError.fromUnknown(error)
    
    console.error('Application error:', {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      metadata: appError.metadata,
    })

    toast({
      title: 'Error',
      description: appError.message,
      variant: 'destructive',
    })
  }

  return (
    <ErrorContext.Provider value={{ handleError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}