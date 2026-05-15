import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenuButton from './MobileMenuButton';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import QuoteModalButton from './QuoteModalButton';
import { loadQuoteModalOptions } from '@/lib/load-quote-modal-options';

export default async function Navbar() {
  const t       = await getTranslations('nav');
  const options = await loadQuoteModalOptions();

  const links = [
    { href: '/services',  label: t('services'), route: true  },
    { href: '/projects',  label: t('projects'), route: true  },
    { href: '/about',     label: t('about'),    route: true  },
    { href: '/contact',   label: t('contact'),  route: true  },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 lg:px-6 animate-[navbar-in_0.4s_ease_forwards]">
      <nav
        className="
          max-w-7xl mx-auto mt-3
          flex items-center justify-between
          h-14
          rounded-xl
          bg-white/90 dark:bg-slate-900/90
          backdrop-blur-md
          border border-slate-200 dark:border-slate-800
          shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]
          px-3 sm:px-5
          transition-colors duration-300
        "
        aria-label="Main navigation"
      >

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 select-none min-h-[44px] min-w-[44px]"
          aria-label="BetaVolt home"
        >
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 object-contain"
            priority
          />
          <span className="font-orbitron font-black text-base sm:text-lg tracking-wide leading-none">
            <span className="text-slate-900 dark:text-white">BETA</span><span className="text-brand-blue">VOLT</span>
          </span>
        </Link>

        {/* ── Desktop nav links (≥ 768px) ── */}
        <NavLinks links={links} />

        {/* ── Right side (always visible) ── */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {/* CTA — only on desktop to avoid crowding at 640–767 px */}
          <QuoteModalButton ctaLabel={t('cta')} projectTypes={options.projectTypes} timelines={options.timelines} />

          <MobileMenuButton links={links} ctaLabel={t('cta')} projectTypes={options.projectTypes} timelines={options.timelines} />
        </div>

      </nav>
    </header>
  );
}
