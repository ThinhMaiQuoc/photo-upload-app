"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: data considered fresh for 4 seconds
            staleTime: 4 * 1000,
            // Cache time: unused data kept for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus to keep data fresh
            refetchOnWindowFocus: true,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
