import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir   = join(process.cwd(), 'messages');
const cardsFilePath = join(process.cwd(), 'data', 'services-cards.json');

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

interface CardLocale { title: string; description: string; items: string; }
interface CardEntry  { id: string; en: CardLocale; ar: CardLocale; }

async function getCards(): Promise<CardEntry[]> {
  const db = await getContent('services-cards');
  if (db) return db as unknown as CardEntry[];
  if (!existsSync(cardsFilePath)) return [];
  return JSON.parse(readFileSync(cardsFilePath, 'utf-8')) as CardEntry[];
}

export async function GET() {
  try {
    const [en, ar, cards] = await Promise.all([
      getMessages('en'),
      getMessages('ar'),
      getCards(),
    ]);
    return NextResponse.json({
      pageHeader: {
        en: en.services_page as Record<string, string>,
        ar: ar.services_page as Record<string, string>,
      },
      cards,
    });
  } catch (err) {
    console.error('[GET /api/admin/content/services]', err);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageHeader: { en: Record<string, string>; ar: Record<string, string> };
      cards: CardEntry[];
    };
    if (!body.pageHeader || !body.cards) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, services_page: body.pageHeader.en }),
      setContent('messages.ar', { ...baseAr, services_page: body.pageHeader.ar }),
      setContent('services-cards', body.cards),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/services]', err);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
