'use client'

import { Component, ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <Container className="flex min-h-screen flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-8">
              {this.state.error.message}
            </p>
            <Button
              onClick={() => this.setState({ error: null })}
              variant="outline"
            >
              Try again
            </Button>
          </Container>
        )
      )
    }

    return this.props.children
  }
}