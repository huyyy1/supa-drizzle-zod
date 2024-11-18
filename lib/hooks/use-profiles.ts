'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfileById, updateProfile } from '@/lib/db/queries'
import type { Profile } from '@/lib/db/schema'

export function useProfile(id: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Profile> }) =>
      updateProfile(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['profile', data.id],
      })
    },
  })
}