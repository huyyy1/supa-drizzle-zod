import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tighter">404 - Page Not Found</h1>
      <p className="mt-4 text-muted-foreground">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </Container>
  )
}