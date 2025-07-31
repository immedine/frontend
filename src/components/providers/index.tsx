'use client';

import { ThemeProvider } from './theme-provider';
import QueryProvider from './query-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      ><Toaster />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
