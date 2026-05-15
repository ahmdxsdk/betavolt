import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, service, details } = body;

    if (!name || !email || !service || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('inquiries').insert([{
      full_name: name,
      email,
      company:   company || null,
      phone:     phone   || null,
      subject:   service,
      message:   details,
      status:    'new',
      source:    'contact_form',
    }]);

    if (error) {
      console.error('[Contact API] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
