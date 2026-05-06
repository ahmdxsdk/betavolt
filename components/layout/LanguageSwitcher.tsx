'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const label = locale === 'ar' ? 'EN' : 'عربي';

  function handleSwitch() {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      aria-label="Switch language"
      className="
        inline-flex items-center gap-1.5
        px-3 py-2.5
        min-h-[44px] min-w-[44px]
        rounded-full
        border border-brand-blue/20 bg-brand-blue/[0.06]
        text-sm font-semibold text-brand-blue/80
        hover:text-brand-blue hover:border-brand-blue/40 hover:bg-brand-blue/10
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
