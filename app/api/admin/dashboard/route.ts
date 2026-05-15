import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    /* ── Run all queries in parallel ─────────────────────── */
    const [
      { count: totalProjects },
      { count: newInquiries  },
      { data:  recentRows    },
    ] = await Promise.all([
      supabase.from('projects')  .select('*', { count: 'exact', head: true }),
      supabase.from('inquiries') .select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('inquiries')
        .select('id, full_name, email, subject, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4),
    ]);

    /* ── Services count from JSON file ───────────────────── */
    let totalServices = 0;
    try {
      const raw = readFileSync(join(process.cwd(), 'data', 'services-cards.json'), 'utf-8');
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : (parsed.cards ?? []);
      totalServices = arr.length;
    } catch { /* fallback to 0 */ }

    return NextResponse.json({
      stats: {
        totalProjects:  totalProjects  ?? 0,
        newInquiries:   newInquiries   ?? 0,
        totalServices,
      },
      recentInquiries: recentRows ?? [],
    });
  } catch (err) {
    console.error('[GET /api/admin/dashboard]', err);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
