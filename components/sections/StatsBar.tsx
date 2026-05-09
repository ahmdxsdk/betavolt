'use client';

import { Server, Zap, Clock, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const STATS = [
  {
    Icon: Zap,
    valueKey: 'stat1_value' as const,
    labelKey: 'stat1_label' as const,
  },
  {
    Icon: Server,
    valueKey: 'stat2_value' as const,
    labelKey: 'stat2_label' as const,
  },
  {
    Icon: Clock,
    valueKey: 'stat3_value' as const,
    labelKey: 'stat3_label' as const,
  },
  {
    Icon: CheckCircle,
    valueKey: 'stat4_value' as const,
    labelKey: 'stat4_label' as const,
  },
] as const;

export default function StatsBar() {
  const t = useTranslations('stats');

  return (
    <section
      aria-label="Company statistics"
      className="relative border-y border-slate-800 bg-slate-900/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ Icon, valueKey, labelKey }, i) => (
            <div
              key={valueKey}
              className={[
                'group flex flex-col items-center gap-3 py-8 sm:py-10 px-4 text-center',
                'transition-colors duration-300 hover:bg-brand-blue/[0.04]',
                i < STATS.length - 1
                  ? 'border-e border-slate-800 [&:nth-child(2)]:border-e-0 lg:[&:nth-child(2)]:border-e'
                  : '',
                i < 2 ? 'border-b border-slate-800 lg:border-b-0' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue transition-all duration-300 group-hover:bg-brand-blue/15 group-hover:border-brand-blue/35 group-hover:scale-110">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* Value */}
              <dt className="font-black text-3xl sm:text-4xl tracking-tight text-brand-accent leading-none">
                {t(valueKey)}
              </dt>

              {/* Label */}
              <dd className="text-slate-300 text-sm sm:text-[0.9rem] font-medium leading-snug max-w-[10rem]">
                {t(labelKey)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
