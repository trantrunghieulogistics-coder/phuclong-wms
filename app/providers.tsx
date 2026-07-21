'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, gcTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="top-right" expand={false} richColors closeButton
          toastOptions={{ duration: 4000 }} />
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' &&
        <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}