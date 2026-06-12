import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getContent, setContent } from '@/lib/content-store';

const BUCKET      = 'hero-media';
const LOGO_PREFIX = 'site-logo/';
const KEY_DARK    = 'logo-dark';
const KEY_LIGHT   = 'logo-light';

type Mode = 'dark' | 'light';

function key(mode: Mode) { return mode === 'dark' ? KEY_DARK : KEY_LIGHT; }

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function removeFromStorage(sb: ReturnType<typeof adminClient>, url: string) {
  const base = sb.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
  const path = url.replace(base, '');
  await sb.storage.from(BUCKET).remove([path]).catch(() => {});
}

/* ── GET — return both logo URLs ────────────────────────── */
export async function GET() {
  const [dark, light] = await Promise.all([
    getContent(KEY_DARK)  as Promise<string | null>,
    getContent(KEY_LIGHT) as Promise<string | null>,
  ]);
  return NextResponse.json({ dark: dark ?? null, light: light ?? null });
}

/* ── POST — upload logo for a given mode ────────────────── */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const mode = form.get('mode') as Mode | null;

    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    if (mode !== 'dark' && mode !== 'light') {
      return NextResponse.json({ error: 'mode must be "dark" or "light"' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Expected an image file' }, { status: 400 });
    }

    const sb  = adminClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `${LOGO_PREFIX}${mode}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buf  = Buffer.from(await file.arrayBuffer());

    const oldUrl = await getContent(key(mode)) as string | null;
    if (oldUrl) await removeFromStorage(sb, oldUrl);

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, buf, { contentType: file.type, upsert: false });

    if (upErr) throw new Error(upErr.message);

    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await setContent(key(mode), publicUrl);

    return NextResponse.json({ ok: true, url: publicUrl, mode });
  } catch (err) {
    console.error('[POST /api/admin/content/logo]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/* ── DELETE — remove logo for a given mode ──────────────── */
export async function DELETE(req: NextRequest) {
  try {
    const { mode } = await req.json() as { mode?: Mode };
    if (mode !== 'dark' && mode !== 'light') {
      return NextResponse.json({ error: 'mode must be "dark" or "light"' }, { status: 400 });
    }

    const sb     = adminClient();
    const oldUrl = await getContent(key(mode)) as string | null;
    if (oldUrl) await removeFromStorage(sb, oldUrl);

    await setContent(key(mode), null);
    return NextResponse.json({ ok: true, mode });
  } catch (err) {
    console.error('[DELETE /api/admin/content/logo]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
