import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir = join(process.cwd(), 'messages');

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

export async function GET() {
  try {
    const [en, ar] = await Promise.all([getMessages('en'), getMessages('ar')]);
    return NextResponse.json({ en: en.home, ar: ar.home });
  } catch (err) {
    console.error('[GET /api/admin/content/home]', err);
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { en: Record<string, unknown>; ar: Record<string, unknown> };
    if (!body.en || !body.ar) {
      return NextResponse.json({ error: 'Missing en or ar payload' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, home: body.en }),
      setContent('messages.ar', { ...baseAr, home: body.ar }),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/home]', err);
    return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
  }
}
