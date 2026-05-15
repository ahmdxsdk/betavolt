import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir = join(process.cwd(), 'messages');
const optionsPath = join(process.cwd(), 'data', 'quote-modal-options.json');

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
function readOptions() {
  try { return JSON.parse(readFileSync(optionsPath, 'utf-8')); }
  catch { return { projectTypes: [], timelines: [] }; }
}
function writeOptions(data: unknown) {
  writeFileSync(optionsPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function GET() {
  try {
    const [en, ar] = [readMessages('en'), readMessages('ar')];
    return NextResponse.json({
      modal: {
        en: en.quote_modal as Record<string, string>,
        ar: ar.quote_modal as Record<string, string>,
      },
      options: readOptions(),
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
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, quote_modal: body.modal.en });
    writeMessages('ar', { ...fullAr, quote_modal: body.modal.ar });
    if (body.options) writeOptions(body.options);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/quote-modal]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
