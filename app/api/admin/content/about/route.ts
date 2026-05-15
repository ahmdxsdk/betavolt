import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir  = join(process.cwd(), 'messages');
const dataFilePath = join(process.cwd(), 'data', 'about-content.json');

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
function readAboutContent() {
  return JSON.parse(readFileSync(dataFilePath, 'utf-8'));
}
function writeAboutContent(data: unknown) {
  writeFileSync(dataFilePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function GET() {
  try {
    const [en, ar] = [readMessages('en'), readMessages('ar')];
    const content  = readAboutContent();

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

    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, about: body.pageHeader.en });
    writeMessages('ar', { ...fullAr, about: body.pageHeader.ar });
    writeAboutContent(body.content);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/about]', err);
    return NextResponse.json({ error: 'Failed to save about content' }, { status: 500 });
  }
}
