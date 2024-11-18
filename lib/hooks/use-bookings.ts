'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookingsByCustomerId, createBooking, updateBooking } from '@/lib/db/queries'
import type { Booking } from '@/lib/db/schema'

export function useCustomerBookings(customerId: string) {
  return useQuery({
    queryKey: ['bookings', 'customer', customerId],
    queryFn: () => getBookingsByCustomerId(customerId),
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => 
      createBooking(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['bookings', 'customer', data.customerId],
      })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
      updateBooking(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['bookings', 'customer', data.customerId],
      })
    },
  })
}