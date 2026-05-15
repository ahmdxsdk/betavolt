import { createClient } from '@supabase/supabase-js';

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/* Single shared client — safe for both browser and server (anon key only) */
export const supabase = createClient(url, anonKey);

export const BUCKET = 'project-images';

/* Returns the full public URL for a storage path */
export function storageUrl(path: string): string {
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}
