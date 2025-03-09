'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import { SettingsProvider } from '../contexts/SettingsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers component that wraps the application with all necessary providers
 * @param children - The child components
 * @returns The wrapped application
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default Providers; 