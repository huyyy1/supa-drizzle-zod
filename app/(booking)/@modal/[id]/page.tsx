import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BookingDetails } from "@/components/booking/BookingDetails"

interface BookingModalProps {
  params: {
    id: string
  }
}

export default function BookingModal({ params }: BookingModalProps) {
  return (
    <Dialog open>
      <DialogContent>
        <BookingDetails id={params.id} />
      </DialogContent>
    </Dialog>
  )
}