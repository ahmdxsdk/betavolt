import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
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
  challenge_en: string; challenge_ar:string;
  solution_en:  string; solution_ar: string;
  sort_order:   number;
}

interface ProjectEntry {
  id:        string;
  category:  string;
  image_url: string;
  gallery:   GalleryItem[];
  map_url:   string;
  sort_order:number;
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
    title:    { en: r.title_en,    ar: r.title_ar    },
    location: { en: r.location_en, ar: r.location_ar },
    challenge:{ en: r.challenge_en,ar: r.challenge_ar },
    solution: { en: r.solution_en, ar: r.solution_ar  },
  };
}

function entryToRow(p: ProjectEntry, idx: number): Omit<ProjectRow, never> {
  return {
    id: p.id, category: p.category, image_url: p.image_url,
    gallery: p.gallery, map_url: p.map_url, sort_order: idx,
    title_en: p.title.en,       title_ar: p.title.ar,
    location_en: p.location.en, location_ar: p.location.ar,
    challenge_en:p.challenge.en,challenge_ar:p.challenge.ar,
    solution_en: p.solution.en, solution_ar: p.solution.ar,
  };
}

/* ─── Messages helpers ───────────────────────────────── */
function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/* ─── GET ────────────────────────────────────────────── */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const [en, ar] = [readMessages('en'), readMessages('ar')];

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

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

    /* 1 — Save page header to message files */
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, projects_page: body.pageHeader.en });
    writeMessages('ar', { ...fullAr, projects_page: body.pageHeader.ar });

    /* 2 — Sync projects to Supabase */
    const supabase = await createSupabaseServerClient();
    const incomingIds = body.projects.map(p => p.id);

    /* Delete rows that were removed in the editor */
    const { data: existing } = await supabase
      .from('projects')
      .select('id');

    const existingIds = (existing ?? []).map((r: { id: string }) => r.id);
    const toDelete    = existingIds.filter((id: string) => !incomingIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from('projects').delete().in('id', toDelete);
    }

    /* Upsert everything in the new list (preserves sort order via index) */
    if (body.projects.length > 0) {
      const rows = body.projects.map((p, i) => entryToRow(p, i + 1));
      const { error } = await supabase
        .from('projects')
        .upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/projects]', err);
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}
