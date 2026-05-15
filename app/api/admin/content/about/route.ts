import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir  = join(process.cwd(), 'messages');
const dataFilePath = join(process.cwd(), 'data', 'about-content.json');

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

async function getAboutContent(): Promise<unknown> {
  return (await getContent('about-content')) ?? JSON.parse(readFileSync(dataFilePath, 'utf-8'));
}

export async function GET() {
  try {
    const [en, ar, content] = await Promise.all([
      getMessages('en'),
      getMessages('ar'),
      getAboutContent(),
    ]);
    return NextResponse.json({
      pageHeader: {
        en: en.about as Record<string, string>,
        ar: ar.about as Record<string, string>,
      },
      content,
    });
  } catch (err) {
    console.error('[GET /api/admin/content/about]', err);
    return NextResponse.json({ error: 'Failed to load about content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageHeader: { en: Record<string, string>; ar: Record<string, string> };
      content: unknown;
    };
    if (!body.pageHeader || !body.content) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, about: body.pageHeader.en }),
      setContent('messages.ar', { ...baseAr, about: body.pageHeader.ar }),
      setContent('about-content', body.content),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/about]', err);
    return NextResponse.json({ error: 'Failed to save about content' }, { status: 500 });
  }
}
