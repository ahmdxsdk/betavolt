import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const messagesDir = join(process.cwd(), 'messages');
const detailsPath = join(process.cwd(), 'data', 'contact-details.json');

interface ContactDetails {
  email_general:  string;
  email_projects: string;
  phone:          string;
  whatsapp:       string;
}

function readMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}
function writeMessages(locale: 'en' | 'ar', data: Record<string, unknown>) {
  writeFileSync(join(messagesDir, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
function readDetails(): ContactDetails {
  return JSON.parse(readFileSync(detailsPath, 'utf-8'));
}
function writeDetails(data: ContactDetails) {
  writeFileSync(detailsPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function GET() {
  try {
    const [en, ar] = [readMessages('en'), readMessages('ar')];
    return NextResponse.json({
      pageContent: {
        en: en.contact_page as Record<string, string>,
        ar: ar.contact_page as Record<string, string>,
      },
      details: readDetails(),
    });
  } catch (err) {
    console.error('[GET /api/admin/content/contact]', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageContent: { en: Record<string, string>; ar: Record<string, string> };
      details: ContactDetails;
    };
    if (!body.pageContent || !body.details) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, contact_page: body.pageContent.en });
    writeMessages('ar', { ...fullAr, contact_page: body.pageContent.ar });
    writeDetails(body.details);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/contact]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
