'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { AppError } from '@/lib/error'

interface CacheConfig {
  staleTime?: number
  cacheTime?: number
  retry?: boolean | number
  refetchOnWindowFocus?: boolean
  prefetch?: boolean
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 1000 * 60, // 1 minute
  cacheTime: 1000 * 60 * 5, // 5 minutes
  retry: 1,
  refetchOnWindowFocus: false,
  prefetch: false,
}

export function useQueryWithCache<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  config?: CacheConfig & Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  const queryClient = useQueryClient()
  const finalConfig = { ...DEFAULT_CACHE_CONFIG, ...config }

  // Prefetch if enabled
  if (finalConfig.prefetch) {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: finalConfig.staleTime,
    })
  }

  return useQuery({
    queryKey,
    queryFn,
    staleTime: finalConfig.staleTime,
    gcTime: finalConfig.cacheTime,
    retry: finalConfig.retry,
    refetchOnWindowFocus: finalConfig.refetchOnWindowFocus,
  })
}

export function useOptimisticMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: QueryKey,
  updateFn: (oldData: TData | undefined, newData: TData) => TData,
  config?: CacheConfig
) {
  const queryClient = useQueryClient()
  const finalConfig = { ...DEFAULT_CACHE_CONFIG, ...config }

  return useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables)
      } catch (error) {
        throw AppError.fromUnknown(error)
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<TData>(queryKey)
      
      queryClient.setQueryData<TData>(queryKey, (old) => {
        if (!old) return old
        return updateFn(old, variables as unknown as TData)
      })
      
      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    retry: finalConfig.retry,
  })
}