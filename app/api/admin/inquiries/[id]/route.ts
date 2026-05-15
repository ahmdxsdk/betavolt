import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await req.json() as { status: string };

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[PATCH /api/admin/inquiries]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PATCH /api/admin/inquiries]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[DELETE /api/admin/inquiries]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/inquiries]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
