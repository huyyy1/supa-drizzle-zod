import { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in to your SimplyMaid account',
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Container size="sm" className="py-8">
        {children}
      </Container>
    </div>
  )
}