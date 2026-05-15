import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── Admin section ──────────────────────────────────────────── */
  if (pathname.startsWith('/admin')) {

    // Inject the current pathname as a request header so that the
    // AdminLayout (server component) can detect the login page and
    // omit the sidebar/header shell without touching the URL.
    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set('x-pathname', pathname);

    // ── /admin/login: pass through but redirect if already authed
    if (pathname === '/admin/login') {
      const res = NextResponse.next({ request: { headers: forwardHeaders } });

      const supabase = buildMiddlewareClient(request, res);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Already logged in → go straight to dashboard
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      return res;
    }

    // ── All other /admin/* routes: require a valid session
    let res = NextResponse.next({ request: { headers: forwardHeaders } });
    const supabase = buildMiddlewareClient(request, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    return res;
  }

  /* ── Public routes → next-intl locale routing ───────────────── */
  return handleI18n(request);
}

/* Helper: create a Supabase client that reads from the request cookies
   and writes refreshed tokens back into the response cookies.         */
function buildMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    },
  );
}

export const config = {
  // Match every route except: API routes, Next.js internals, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
