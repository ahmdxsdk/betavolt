import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenuButton from './MobileMenuButton';
import NavLinks from './NavLinks';

export default async function Navbar() {
  const t = await getTranslations('nav');

  const links = [
    { href: '/services',  label: t('services'), route: true  },
    { href: '/projects',  label: t('projects'), route: true  },
    { href: '/about',     label: t('about'),    route: true  },
    { href: '#contact',   label: t('contact'),  route: false },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 lg:px-6">
      <nav
        className="
          max-w-7xl mx-auto mt-3
          flex items-center justify-between
          h-14
          rounded-xl
          bg-navy-800/60 backdrop-blur-md
          border border-brand-blue/[0.12]
          shadow-[0_2px_32px_rgba(0,0,0,0.6)]
          px-3 sm:px-5
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
            <span className="text-white">BETA</span><span className="text-brand-blue">VOLT</span>
          </span>
        </Link>

        {/* ── Desktop nav links (≥ 768px) ── */}
        <NavLinks links={links} />

        {/* ── Right side (always visible) ── */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* CTA — only on desktop to avoid crowding at 640–767 px */}
          <a
            href="#contact"
            className="
              hidden md:inline-flex items-center gap-1.5
              px-4 py-2.5 rounded-lg
              bg-brand-blue text-brand-dark font-bold text-sm
              glow-blue-sm hover:bg-brand-blue-hover
              transition-all duration-200 hover:scale-105 active:scale-100
              min-h-[44px]
            "
          >
            {t('cta')}
          </a>

          <MobileMenuButton links={links} ctaLabel={t('cta')} />
        </div>

      </nav>
    </header>
  );
}
