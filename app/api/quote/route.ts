import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string;
      company: string;
      project_type: string;
      timeline: string;
      requirements: string;
      file_name?: string;
    };

    const { name, company, project_type, timeline, requirements, file_name } = body;

    if (!name || !company || !project_type || !timeline || !requirements) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subject  = `${project_type} — ${timeline}`;
    const message  = file_name
      ? `${requirements}\n\n[مرفق: ${file_name}]`
      : requirements;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('inquiries').insert({
      full_name: name,
      company,
      subject,
      message,
      source: 'quote_form',
      status: 'new',
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/quote]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
