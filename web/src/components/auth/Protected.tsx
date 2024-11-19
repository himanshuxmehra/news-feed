"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthCheck();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
