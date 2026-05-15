'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link as LocaleLink, usePathname } from '@/navigation';
import QuoteModal from './QuoteModal';
import type { ModalOption } from '@/lib/load-quote-modal-options';

type NavLink = { href: string; label: string; route?: boolean };
type Props   = { links: NavLink[]; ctaLabel: string; projectTypes: ModalOption[]; timelines: ModalOption[] };

export default function MobileMenuButton({ links, ctaLabel, projectTypes, timelines }: Props) {
  const [isOpen, setIsOpen]           = useState(false);
  const [quoteOpen, setQuoteOpen]     = useState(false);
  const [mounted, setMounted]         = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const overlay = (
    <div
      className={[
        'fixed inset-0 z-[60] bg-white/98 dark:bg-slate-950/98 backdrop-blur-md overflow-y-auto',
        'transition-opacity duration-300 ease-in-out',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={() => setIsOpen(false)}
    >
      {/* Close button — top-end corner */}
      <button
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
        className={[
          'absolute top-4 end-4',
          'w-11 h-11 flex items-center justify-center',
          'rounded-full border border-slate-200 dark:border-slate-700',
          'text-slate-500 dark:text-slate-400',
          'hover:text-slate-900 dark:hover:text-white',
          'hover:border-slate-300 dark:hover:border-slate-600',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75',
        ].join(' ')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      <div
        className={[
          'flex flex-col items-center justify-center min-h-full gap-2 py-20 px-6',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {links.map((link, idx) => {
          const active = link.route
            ? pathname === link.href || pathname.startsWith(link.href + '/')
            : false;
          const cls = [
            'w-full max-w-xs text-center',
            'px-6 py-4 rounded-xl',
            'text-xl font-semibold',
            'transition-all duration-200 ease-in-out',
            'min-h-[56px] flex items-center justify-center',
            isOpen
              ? `opacity-100 translate-y-0 delay-[${50 + idx * 40}ms]`
              : 'opacity-0 translate-y-2',
            active
              ? 'text-blue-600 dark:text-blue-400 bg-blue-600/[0.06] dark:bg-blue-500/[0.10]'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/[0.06] dark:hover:bg-blue-500/[0.10]',
          ].join(' ');
          return link.route ? (
            <LocaleLink
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cls}
            >
              {link.label}
            </LocaleLink>
          ) : (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cls}
            >
              {link.label}
            </a>
          );
        })}

        <div className={[
          'w-full max-w-xs h-px bg-slate-200 dark:bg-slate-800 my-4',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 delay-[220ms]' : 'opacity-0',
        ].join(' ')} />

        <button
          onClick={() => { setIsOpen(false); setQuoteOpen(true); }}
          className={[
            'w-full max-w-xs flex items-center justify-center gap-2',
            'px-8 py-4 rounded-xl',
            'bg-brand-blue text-white font-bold text-lg',
            'hover:bg-brand-blue-hover',
            'transition-all duration-300 ease-in-out',
            'min-h-[56px]',
            isOpen ? 'opacity-100 translate-y-0 delay-[260ms]' : 'opacity-0 translate-y-2',
          ].join(' ')}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger — 44×44 px touch target, mobile only */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="
          md:hidden
          flex flex-col justify-center items-center
          w-11 h-11 gap-[5px]
          rounded-lg
          text-slate-600 dark:text-slate-400
          hover:text-slate-900 dark:hover:text-white
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition-colors duration-150
          shrink-0
        "
      >
        <span className={`block h-0.5 w-5 bg-current rounded-full origin-center transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]'  : ''}`} />
        <span className={`block h-0.5 w-5 bg-current rounded-full             transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0'             : ''}`} />
        <span className={`block h-0.5 w-5 bg-current rounded-full origin-center transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {/* Portal — rendered at <body> level to escape the nav's stacking context */}
      {mounted && createPortal(overlay, document.body)}
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} projectTypes={projectTypes} timelines={timelines} />
    </>
  );
}
