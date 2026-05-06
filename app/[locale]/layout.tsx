import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { cairo, orbitron } from '@/lib/fonts';
import Navbar from '@/components/layout/Navbar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'BetaVolt – Engineering & Contracting',
  description:
    'BetaVolt specializes in MEP systems, low current, solar energy, and data center infrastructure.',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${orbitron.variable}`}
    >
      <body className="bg-brand-dark font-cairo antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
