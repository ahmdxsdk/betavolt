import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { cairo, orbitron } from '@/lib/fonts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/layout/ThemeProvider';
import { getContent } from '@/lib/content-store';
import '@/app/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getContent('favicon') as string | null;
  return {
    title: 'BetaVolt – Engineering & Contracting',
    description:
      'BetaVolt specializes in electrical systems, low current, communications, solar energy, and smart infrastructure contracting.',
    ...(faviconUrl && {
      icons: { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl },
    }),
  };
}

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
      suppressHydrationWarning
    >
      <body className={`${cairo.className} bg-white dark:bg-slate-950 antialiased min-h-screen transition-colors duration-300`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
