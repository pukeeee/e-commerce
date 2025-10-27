"use client";

import { useHydration } from "./HydrationProvider";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const { isHydrated } = useHydration();
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
