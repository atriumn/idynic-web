'use client';

import { QueryProvider } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}