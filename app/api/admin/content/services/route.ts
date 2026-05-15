import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const messagesDir   = join(process.cwd(), 'messages');
const cardsFilePath = join(process.cwd(), 'data', 'services-cards.json');

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

interface CardLocale  { title: string; description: string; items: string; }
interface CardEntry   { id: string; en: CardLocale; ar: CardLocale; }

function readCards(): CardEntry[] {
  if (!existsSync(cardsFilePath)) return [];
  return JSON.parse(readFileSync(cardsFilePath, 'utf-8')) as CardEntry[];
}

export async function GET() {
  try {
    const en = readMessages('en');
    const ar = readMessages('ar');
    const cards = readCards();
    return NextResponse.json({
      pageHeader: {
        en: en.services_page as Record<string, string>,
        ar: ar.services_page as Record<string, string>,
      },
      cards,
    });
  } catch {
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

    /* Update services_page key in both message files */
    const [fullEn, fullAr] = [readMessages('en'), readMessages('ar')];
    writeMessages('en', { ...fullEn, services_page: body.pageHeader.en });
    writeMessages('ar', { ...fullAr, services_page: body.pageHeader.ar });

    /* Write cards */
    writeFileSync(cardsFilePath, JSON.stringify(body.cards, null, 2) + '\n', 'utf-8');

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
