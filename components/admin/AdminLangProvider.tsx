'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type AdminLang = 'en' | 'ar';

interface AdminLangCtx {
  lang: AdminLang;
  setLang: (l: AdminLang) => void;
}

const AdminLangContext = createContext<AdminLangCtx>({ lang: 'en', setLang: () => {} });

export function useAdminLang() {
  return useContext(AdminLangContext);
}

export default function AdminLangProvider({
  children,
  initialLang = 'en',
}: {
  children: ReactNode;
  initialLang?: AdminLang;
}) {
  const [lang, setLangState] = useState<AdminLang>(initialLang);

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: AdminLang) => {
    setLangState(l);
    document.cookie = `admin-lang=${l};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }, []);

  return (
    <AdminLangContext.Provider value={{ lang, setLang }}>
      {children}
    </AdminLangContext.Provider>
  );
}
