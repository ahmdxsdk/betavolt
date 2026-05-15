/**
 * SETUP INSTRUCTION:
 * ─────────────────────────────────────────────────────────────────────────────
 * Before using the admin dashboard, create the first admin user manually:
 *   1. Go to Supabase Studio → Authentication → Users → "Add User"
 *   2. Email: admin@betavolt.com  (or your preferred email)
 *   3. Set a strong password and enable "Auto Confirm User"
 *   4. There is NO sign-up or password-reset flow in the app by design.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cookie-based Supabase client for Server Actions, Route Handlers, and layouts. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components are read-only — writes are a no-op here.
          }
        },
      },
    }
  );
}

/** Service-role client for privileged server-side operations (no auth required). */
export { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
