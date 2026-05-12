'use client';

import { useEffect, useRef, useState } from 'react';
import { Server, Zap, Clock, CheckCircle, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

const DURATION = 2000;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

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
        'hover:bg-white dark:hover:bg-slate-800/60',
        'hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-none',
        borderClass,
      ].join(' ')}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white dark:group-hover:text-white group-hover:scale-110">
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
      <dd className="text-slate-500 dark:text-slate-400 text-sm sm:text-[0.9rem] font-medium leading-snug max-w-[10rem] group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
        {label}
      </dd>
    </div>
  );
}

export default function StatsBar() {
  const t = useTranslations('stats');

  const borderClasses = [
    'border-e border-b border-slate-200 dark:border-slate-800 lg:border-b-0',
    'border-b border-slate-200 dark:border-slate-800 lg:border-e lg:border-b-0',
    'border-e border-slate-200 dark:border-slate-800',
    '',
  ];

  return (
    <section
      aria-label="Company statistics"
      className="relative border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
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
