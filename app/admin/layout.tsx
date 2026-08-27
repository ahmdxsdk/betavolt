import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '@/components/admin/SidebarProvider';
import AdminLangProvider, { type AdminLang } from '@/components/admin/AdminLangProvider';
import AdminRefreshProvider, { AdminMainContent } from '@/components/admin/AdminRefreshProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminRoleProvider } from '@/components/admin/AdminRoleProvider';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Role } from '@/lib/admin-roles';
import { getContent } from '@/lib/content-store';
import '@/app/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getContent('favicon') as string | null;
  return {
    title: 'Admin – BetaVolt',
    robots: { index: false, follow: false },
    ...(faviconUrl && {
      icons: { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl },
    }),
  };
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const headersList = await headers();

  const savedLang   = cookieStore.get('admin-lang')?.value;
  const initialLang: AdminLang = savedLang === 'ar' ? 'ar' : 'en';

  const pathname    = headersList.get('x-pathname') ?? '';
  const isLoginPage = pathname === '/admin/login';

  // Read the current user's role server-side so it is available on the
  // first render — no client-side async, no hydration mismatch.
  let role: Role = 'super_admin';
  if (!isLoginPage) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      role = ((user?.user_metadata?.role as Role | undefined) ?? 'super_admin');
    } catch {
      // fall back to super_admin if session cannot be read
    }
  }

  return (
    <div className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <AdminLangProvider initialLang={initialLang}>
            <AdminRoleProvider role={role}>
              <AdminRefreshProvider>
                <SidebarProvider>
                  <AdminSidebar />
                  <div className="lg:ps-64 flex flex-col min-h-screen">
                    <AdminHeader />
                    <AdminMainContent>{children}</AdminMainContent>
                  </div>
                </SidebarProvider>
              </AdminRefreshProvider>
            </AdminRoleProvider>
          </AdminLangProvider>
        )}
      </ThemeProvider>
    </div>
  );
}
