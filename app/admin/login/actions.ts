'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/* ─── Login ───────────────────────────────────────────────── */
export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email    = String(formData.get('email')    ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Never expose raw Supabase error messages to the client
    return { error: 'Invalid credentials. Please check your email and password.' };
  }

  redirect('/admin');
}

/* ─── Logout ──────────────────────────────────────────────── */
export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
