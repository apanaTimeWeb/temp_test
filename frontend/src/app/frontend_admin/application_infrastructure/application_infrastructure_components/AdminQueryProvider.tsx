'use client';
import type { AdminQueryProviderProps } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/types/AdminApplicationInfrastructureApplicationInfrastructureComponentsComponentTypes';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';


/** Owns one stable QueryClient for the Admin frontend role. */
export function AdminQueryProvider({ children }: AdminQueryProviderProps) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
        mutations: { retry: false },
      },
    }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}


export type { AdminQueryProviderProps };
