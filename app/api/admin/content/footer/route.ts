import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir   = join(process.cwd(), 'messages');
const footerPath    = join(process.cwd(), 'data', 'footer-content.json');

interface FooterContent {
  social: { linkedin: string; twitter: string; youtube: string; whatsapp: string };
}

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
function readFooterContent(): FooterContent {
  return JSON.parse(readFileSync(footerPath, 'utf-8'));
}
function writeFooterContent(data: FooterContent) {
  writeFileSync(footerPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function GET() {
  try {
    const [en, ar] = [readMessages('en'), readMessages('ar')];
    return NextResponse.json({
      pageContent: {
        en: en.footer as Record<string, string>,
        ar: ar.footer as Record<string, string>,
      },
      footerContent: readFooterContent(),
    });
  } catch (err) {
    console.error('[GET /api/admin/content/footer]', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageContent:   { en: Record<string, string>; ar: Record<string, string> };
      footerContent: FooterContent;
    };
    if (!body.pageContent || !body.footerContent) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, footer: body.pageContent.en });
    writeMessages('ar', { ...fullAr, footer: body.pageContent.ar });
    writeFooterContent(body.footerContent);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/footer]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
