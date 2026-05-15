import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { cairo, orbitron } from '@/lib/fonts';
import { SidebarProvider } from '@/components/admin/SidebarProvider';
import AdminLangProvider, { type AdminLang } from '@/components/admin/AdminLangProvider';
import AdminRefreshProvider, { AdminMainContent } from '@/components/admin/AdminRefreshProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Admin – BetaVolt',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore  = await cookies();
  const headersList  = await headers();

  const savedLang    = cookieStore.get('admin-lang')?.value;
  const initialLang: AdminLang = savedLang === 'ar' ? 'ar' : 'en';

  // Set by middleware on every /admin request so we can detect the login page
  // without a client-side check.
  const pathname     = headersList.get('x-pathname') ?? '';
  const isLoginPage  = pathname === '/admin/login';

  return (
    <html lang="en" suppressHydrationWarning className={`${cairo.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

          {isLoginPage ? (
            /* ── Login page: full-screen, no sidebar/header ── */
            <>{children}</>
          ) : (
            /* ── Dashboard shell ─────────────────────────────── */
            <AdminLangProvider initialLang={initialLang}>
              <AdminRefreshProvider>
                <SidebarProvider>
                  <AdminSidebar />
                  <div className="lg:ps-64 flex flex-col min-h-screen">
                    <AdminHeader />
                    <AdminMainContent>{children}</AdminMainContent>
                  </div>
                </SidebarProvider>
              </AdminRefreshProvider>
            </AdminLangProvider>
          )}

        </ThemeProvider>
      </body>
    </html>
  );
}
