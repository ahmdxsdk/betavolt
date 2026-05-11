'use client';

import { useEffect, useRef, useState } from 'react';
import { Server, Zap, Clock, CheckCircle, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ── Config ─────────────────────────────────────────────────────────────────

const STATS: {
  Icon: LucideIcon;
  target: number;
  suffix: string;
  labelKey: 'stat1_label' | 'stat2_label' | 'stat3_label' | 'stat4_label';
}[] = [
  { Icon: Zap,         target: 50,  suffix: '+',  labelKey: 'stat1_label' },
  { Icon: Server,      target: 10,  suffix: '+',  labelKey: 'stat2_label' },
  { Icon: Clock,       target: 24,  suffix: '/7', labelKey: 'stat3_label' },
  { Icon: CheckCircle, target: 100, suffix: '%',  labelKey: 'stat4_label' },
];

const DURATION = 2000; // ms

// ── easeOutExpo — fast start, graceful stop near target ────────────────────
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ── Single animated stat cell ──────────────────────────────────────────────

function StatItem({
  Icon,
  target,
  suffix,
  label,
  borderClass,
}: {
  Icon: LucideIcon;
  target: number;
  suffix: string;
  label: string;
  borderClass: string;
}) {
  const [count, setCount] = useState(0);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const started  = useRef(false);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / DURATION, 1);
          setCount(Math.round(easeOutExpo(progress) * target));
          if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <div
      ref={wrapRef}
      className={[
        'group flex flex-col items-center gap-3 py-8 sm:py-10 px-4 text-center',
        'transition-all duration-300',
        'hover:bg-slate-800/40 hover:backdrop-blur-md',
        'hover:shadow-[0_0_20px_rgba(59,130,246,0.10)]',
        borderClass,
      ].join(' ')}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/60 text-brand-blue transition-all duration-300 group-hover:bg-brand-blue/15 group-hover:border-brand-blue/50 group-hover:scale-110 backdrop-blur-sm">
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Animated value */}
      <dt
        className="font-black text-3xl sm:text-4xl tracking-tight text-brand-accent leading-none tabular-nums"
        aria-label={`${target}${suffix}`}
      >
        {count}
        <span>{suffix}</span>
      </dt>

      {/* Label */}
      <dd className="text-slate-300 text-sm sm:text-[0.9rem] font-medium leading-snug max-w-[10rem] group-hover:text-white transition-colors duration-300">
        {label}
      </dd>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function StatsBar() {
  const t = useTranslations('stats');

  // Pre-compute border classes for the 2-col (mobile) / 4-col (desktop) grid
  const borderClasses = [
    'border-e border-b border-slate-700/50 lg:border-b-0',       // item 0
    'border-b border-slate-700/50 lg:border-e lg:border-b-0',    // item 1
    'border-e border-slate-700/50',                               // item 2
    '',                                                           // item 3 — no border
  ];

  return (
    <section
      aria-label="Company statistics"
      className="relative border-y border-slate-700/50 bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ Icon, target, suffix, labelKey }, i) => (
            <StatItem
              key={labelKey}
              Icon={Icon}
              target={target}
              suffix={suffix}
              label={t(labelKey)}
              borderClass={borderClasses[i]}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
