import { BookingProgress } from '@/components/booking/BookingProgress'
import { Container } from '@/components/ui/container'

export default function BookingLayout({
  children,
  modal,
  summary,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  summary: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BookingProgress />
      <main className="flex-1 py-8">
        <Container>
          {modal}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {children}
            </div>
            <div className="md:col-span-1">
              {summary}
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}