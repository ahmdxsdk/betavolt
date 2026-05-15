import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir = join(process.cwd(), 'messages');
const footerPath  = join(process.cwd(), 'data', 'footer-content.json');

interface FooterContent {
  social: {
    linkedin: string; twitter: string; youtube: string; whatsapp: string;
    facebook: string; instagram: string; snapchat: string; tiktok: string;
  };
}

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

async function getFooterContent(): Promise<FooterContent> {
  const db = await getContent('footer-content');
  if (db) return db as unknown as FooterContent;
  return JSON.parse(readFileSync(footerPath, 'utf-8'));
}

export async function GET() {
  try {
    const [en, ar, footerContent] = await Promise.all([
      getMessages('en'),
      getMessages('ar'),
      getFooterContent(),
    ]);
    return NextResponse.json({
      pageContent: {
        en: en.footer as Record<string, string>,
        ar: ar.footer as Record<string, string>,
      },
      footerContent,
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

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, footer: body.pageContent.en }),
      setContent('messages.ar', { ...baseAr, footer: body.pageContent.ar }),
      setContent('footer-content', body.footerContent),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/footer]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
