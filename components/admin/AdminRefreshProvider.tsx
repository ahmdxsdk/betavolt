'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface RefreshCtx {
  triggerRefresh: () => void;
  refreshKey: number;
}

const RefreshContext = createContext<RefreshCtx>({ triggerRefresh: () => {}, refreshKey: 0 });

export function useAdminRefresh() {
  return useContext(RefreshContext);
}

export function AdminMainContent({ children }: { children: ReactNode }) {
  const { refreshKey } = useAdminRefresh();
  return (
    <main key={refreshKey} className="flex-1 p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  );
}

export default function AdminRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(k => k + 1);
  return (
    <RefreshContext.Provider value={{ triggerRefresh, refreshKey }}>
      {children}
    </RefreshContext.Provider>
  );
}
