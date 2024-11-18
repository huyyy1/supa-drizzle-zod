'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'

interface QueryConfig {
  staleTime?: number
  cacheTime?: number
  retry?: boolean | number
  refetchOnWindowFocus?: boolean
}

const defaultConfig: QueryConfig = {
  staleTime: 1000 * 60, // 1 minute
  cacheTime: 1000 * 60 * 5, // 5 minutes
  retry: 1,
  refetchOnWindowFocus: false,
}

export function useOptimisticMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: QueryKey,
  updateFn: (oldData: TData | undefined, newData: TData) => TData,
  config?: QueryConfig
) {
  const queryClient = useQueryClient()
  const finalConfig = { ...defaultConfig, ...config }

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<TData>(queryKey)

      queryClient.setQueryData<TData>(queryKey, (old) => {
        if (!old) return old
        return updateFn(old, variables as unknown as TData)
      })

      return { previousData }
    },
    onError: (err, variables, context) => {
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

export function usePrefetch<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  config?: QueryConfig
) {
  const queryClient = useQueryClient()
  const finalConfig = { ...defaultConfig, ...config }

  return () => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: finalConfig.staleTime,
      cacheTime: finalConfig.cacheTime,
    })
  }
}