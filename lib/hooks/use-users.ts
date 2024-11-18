'use client'

import { useQueryWithCache, useOptimisticMutation } from './use-query-with-cache'
import { getUserById, getUserByEmail } from '@/lib/db/queries/users'
import type { User } from '@/lib/db/schema'

export function useUser(id: string) {
  return useQueryWithCache(
    ['user', id],
    () => getUserById(id),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    }
  )
}

export function useUserByEmail(email: string) {
  return useQueryWithCache(
    ['user', 'email', email],
    () => getUserByEmail(email),
    {
      enabled: !!email,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    }
  )
}

export function useUpdateUser() {
  return useOptimisticMutation<User, Partial<User>>(
    async (data) => {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update user')
      return response.json()
    },
    ['user'],
    (old, new_) => ({ ...old, ...new_ })
  )
}