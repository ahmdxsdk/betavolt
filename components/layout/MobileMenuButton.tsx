'use client';

import { useState, useEffect } from 'react';

type NavLink = { href: string; label: string };
type Props   = { links: NavLink[]; ctaLabel: string };

export default function MobileMenuButton({ links, ctaLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* 44×44 px touch target */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="
          md:hidden
          flex flex-col justify-center items-center
          w-11 h-11 gap-[5px]
          rounded-lg
          text-slate-300 hover:text-white hover:bg-white/[0.06]
          transition-colors duration-150
          shrink-0
        "
      >
        <span className={`block h-0.5 w-5 bg-current rounded-full origin-center transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]'  : ''}`} />
        <span className={`block h-0.5 w-5 bg-current rounded-full             transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0'             : ''}`} />
        <span className={`block h-0.5 w-5 bg-current rounded-full origin-center transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button top-end corner */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="
              absolute top-4 end-4
              w-11 h-11 flex items-center justify-center
              rounded-full border border-white/10
              text-slate-400 hover:text-white hover:border-white/20
              transition-colors duration-150
            "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          <div
            className="flex flex-col items-center justify-center min-h-full gap-2 py-20 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="
                  w-full max-w-xs text-center
                  px-6 py-4 rounded-xl
                  text-xl font-semibold text-slate-300
                  hover:text-brand-blue hover:bg-brand-blue/[0.06]
                  transition-all duration-150
                  min-h-[56px] flex items-center justify-center
                "
              >
                {link.label}
              </a>
            ))}

            <div className="w-full max-w-xs h-px bg-white/[0.06] my-4" />

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="
                w-full max-w-xs flex items-center justify-center gap-2
                px-8 py-4 rounded-xl
                bg-brand-blue text-brand-dark font-bold text-lg
                glow-blue-sm hover:bg-brand-blue-hover
                transition-all duration-200
                min-h-[56px]
              "
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
