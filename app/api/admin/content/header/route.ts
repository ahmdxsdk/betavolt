import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir = join(process.cwd(), 'messages');

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function GET() {
  try {
    const [en, ar] = [readMessages('en'), readMessages('ar')];
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
    const body = await req.json() as {
      nav: { en: Record<string, string>; ar: Record<string, string> };
    };
    if (!body.nav) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, nav: body.nav.en });
    writeMessages('ar', { ...fullAr, nav: body.nav.ar });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/header]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
