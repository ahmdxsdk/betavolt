import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir = join(process.cwd(), 'messages');
const optionsPath = join(process.cwd(), 'data', 'quote-modal-options.json');

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

async function getOptions() {
  const db = await getContent('quote-modal-options');
  if (db) return db;
  try { return JSON.parse(readFileSync(optionsPath, 'utf-8')); }
  catch { return { projectTypes: [], timelines: [] }; }
}

export async function GET() {
  try {
    const [en, ar, options] = await Promise.all([
      getMessages('en'),
      getMessages('ar'),
      getOptions(),
    ]);
    return NextResponse.json({
      modal: {
        en: en.quote_modal as Record<string, string>,
        ar: ar.quote_modal as Record<string, string>,
      },
      options,
    });
  } catch (err) {
    console.error('[GET /api/admin/content/quote-modal]', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      modal:   { en: Record<string, string>; ar: Record<string, string> };
      options: { projectTypes: { en: string; ar: string }[]; timelines: { en: string; ar: string }[] };
    };
    if (!body.modal) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, quote_modal: body.modal.en }),
      setContent('messages.ar', { ...baseAr, quote_modal: body.modal.ar }),
      ...(body.options ? [setContent('quote-modal-options', body.options)] : []),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/quote-modal]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
