import type { ReactNode } from 'react';

// Root layout — html/body are provided by [locale]/layout.tsx for i18n routing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RootLayout({ children }: { children: ReactNode }): any {
  return children;
}
