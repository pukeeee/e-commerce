"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface HydrationContextValue {
  isHydrated: boolean;
}

const HydrationContext = createContext<HydrationContextValue>({
  isHydrated: false,
});

export function useHydration() {
  return useContext(HydrationContext);
}

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  );
}
