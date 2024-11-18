import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { Container } from '@/components/ui/container'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export default async function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1">
        {modal}
        <Container className="py-8">
          {children}
        </Container>
      </main>
    </div>
  )
}