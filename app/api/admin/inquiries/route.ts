import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/admin/inquiries]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiries: data });
  } catch (err) {
    console.error('[GET /api/admin/inquiries]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
