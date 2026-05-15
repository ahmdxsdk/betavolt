import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const messagesDir = join(process.cwd(), 'messages');

/* ─── DB types ───────────────────────────────────────── */
interface GalleryItem { type: 'image' | 'video'; url: string; }

interface ProjectRow {
  id:           string;
  category:     string;
  image_url:    string;
  gallery:      GalleryItem[];
  map_url:      string;
  title_en:     string; title_ar:    string;
  location_en:  string; location_ar: string;
  challenge_en: string; challenge_ar: string;
  solution_en:  string; solution_ar: string;
  sort_order:   number;
}

interface ProjectEntry {
  id:        string;
  category:  string;
  image_url: string;
  gallery:   GalleryItem[];
  map_url:   string;
  sort_order: number;
  title:     { en: string; ar: string };
  location:  { en: string; ar: string };
  challenge: { en: string; ar: string };
  solution:  { en: string; ar: string };
}

/* ─── Converters ─────────────────────────────────────── */
function rowToEntry(r: ProjectRow): ProjectEntry {
  return {
    id: r.id, category: r.category, image_url: r.image_url,
    gallery: r.gallery, map_url: r.map_url, sort_order: r.sort_order,
    title:    { en: r.title_en,     ar: r.title_ar     },
    location: { en: r.location_en,  ar: r.location_ar  },
    challenge:{ en: r.challenge_en, ar: r.challenge_ar },
    solution: { en: r.solution_en,  ar: r.solution_ar  },
  };
}

function entryToRow(p: ProjectEntry, idx: number): ProjectRow {
  return {
    id: p.id, category: p.category, image_url: p.image_url,
    gallery: p.gallery, map_url: p.map_url, sort_order: idx,
    title_en: p.title.en,        title_ar: p.title.ar,
    location_en: p.location.en,  location_ar: p.location.ar,
    challenge_en: p.challenge.en, challenge_ar: p.challenge.ar,
    solution_en: p.solution.en,  solution_ar: p.solution.ar,
  };
}

/* ─── Messages helpers ───────────────────────────────── */
function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

/* ─── GET ────────────────────────────────────────────── */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const [[en, ar], { data, error }] = await Promise.all([
      Promise.all([getMessages('en'), getMessages('ar')]),
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    ]);

    if (error) throw error;

    return NextResponse.json({
      pageHeader: {
        en: en.projects_page as Record<string, string>,
        ar: ar.projects_page as Record<string, string>,
      },
      projects: (data as ProjectRow[]).map(rowToEntry),
    });
  } catch (err) {
    console.error('[GET /api/admin/content/projects]', err);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}

/* ─── POST ───────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageHeader: { en: Record<string, string>; ar: Record<string, string> };
      projects:   ProjectEntry[];
    };

    if (!body.pageHeader || !Array.isArray(body.projects)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    /* 1 — Save page header translations to Supabase content store */
    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, projects_page: body.pageHeader.en }),
      setContent('messages.ar', { ...baseAr, projects_page: body.pageHeader.ar }),
    ]);
    revalidateTag('site-messages');

    /* 2 — Sync projects to Supabase projects table */
    const supabase = await createSupabaseServerClient();
    const incomingIds = body.projects.map(p => p.id);

    const { data: existing } = await supabase.from('projects').select('id');
    const toDelete = (existing ?? [])
      .map((r: { id: string }) => r.id)
      .filter((id: string) => !incomingIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from('projects').delete().in('id', toDelete);
    }

    if (body.projects.length > 0) {
      const rows = body.projects.map((p, i) => entryToRow(p, i + 1));
      const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/projects]', err);
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}
