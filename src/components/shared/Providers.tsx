"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

// Initialize Query Client for React Query
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
