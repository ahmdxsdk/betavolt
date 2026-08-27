import type { ReactNode } from 'react';
import { cairo, orbitron } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata = {
  title: 'BetaVolt – Engineering & Contracting',
  description:
    'BetaVolt specializes in electrical systems, low current, communications, solar energy, and smart infrastructure contracting.',
  icons: {
    icon: '/images/logo-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${orbitron.variable} dark`} suppressHydrationWarning>
      <body className={`${cairo.className} bg-[#080c13] text-[#E5E7EB] antialiased min-h-screen selection:bg-brand-blue/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
