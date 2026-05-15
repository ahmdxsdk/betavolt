import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir = join(process.cwd(), 'messages');

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(
    join(messagesDir, `${locale}.json`),
    JSON.stringify(data, null, 2) + '\n',
    'utf-8',
  );
}

export async function GET() {
  try {
    const en = readMessages('en');
    const ar = readMessages('ar');
    return NextResponse.json({ en, ar });
  } catch {
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { en: Record<string, unknown>; ar: Record<string, unknown> };

    if (!body.en || !body.ar) {
      return NextResponse.json({ error: 'Missing en or ar payload' }, { status: 400 });
    }

    writeMessages('en', body.en);
    writeMessages('ar', body.ar);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to write messages' }, { status: 500 });
  }
}
