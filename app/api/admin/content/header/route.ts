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
    return NextResponse.json({
      nav: {
        en: en.nav as Record<string, string>,
        ar: ar.nav as Record<string, string>,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/content/header]', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { nav: { en: Record<string, string>; ar: Record<string, string> } };
    if (!body.nav) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, nav: body.nav.en }),
      setContent('messages.ar', { ...baseAr, nav: body.nav.ar }),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/header]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
