import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function BookingModal() {
  return (
    <Dialog open>
      <DialogContent>
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Booking Summary</h2>
          {/* Booking summary content */}
        </div>
      </DialogContent>
    </Dialog>
  )
}