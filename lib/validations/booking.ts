import { z } from 'zod'
import { CITIES, SERVICES } from '@/lib/constants'

export const bookingSchema = z.object({
  service: z.enum([SERVICES[0].slug, SERVICES[1].slug, SERVICES[2].slug], {
    required_error: 'Please select a service',
  }),
  city: z.enum([CITIES[0].slug, CITIES[1].slug, CITIES[2].slug, CITIES[3].slug, CITIES[4].slug, CITIES[5].slug], {
    required_error: 'Please select a city',
  }),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string({
    required_error: 'Please select a time',
  }),
  duration: z.number().min(2).max(8),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    suburb: z.string().min(1, 'Suburb is required'),
    postcode: z.string().length(4, 'Invalid postcode'),
  }),
  extras: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>