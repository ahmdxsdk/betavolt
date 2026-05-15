import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { servicesData } from '@/lib/services-data';
import QuoteModalButton from '@/components/layout/QuoteModalButton';
import { loadQuoteModalOptions } from '@/lib/load-quote-modal-options';

export const metadata: Metadata = {
  title: 'Services – BetaVolt Engineering & Contracting',
  description:
    'Explore BetaVolt\'s full range of services: Power & Electrical Systems, Low Current & Smart Systems, Data Centers, Engineering Testing, and General Contracting.',
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t       = await getTranslations('services_page');
  const options = await loadQuoteModalOptions();
  const lang = locale as 'en' | 'ar';

  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 bg-grid bg-slate-50 dark:bg-transparent overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(75,163,227,0.13) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Top border glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(75,163,227,0.25), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <p className="
            inline-flex items-center gap-2
            text-xs sm:text-sm font-bold tracking-[0.2em] uppercase
            text-blue-600/80 dark:text-brand-blue/70
            mb-4 sm:mb-5
          ">
            <span className="block w-8 h-px bg-brand-blue/40" aria-hidden="true" />
            {t('eyebrow')}
            <span className="block w-8 h-px bg-brand-blue/40" aria-hidden="true" />
          </p>

          <h1 className="
            font-black tracking-tight leading-tight
            text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]
            text-slate-900 dark:text-white mb-5 sm:mb-6
          ">
            {t('title')}
          </h1>

          <p className="
            text-slate-600 dark:text-slate-400 leading-relaxed
            text-base sm:text-lg lg:text-xl
            max-w-2xl mx-auto
          ">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── Service Categories Grid ── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {servicesData.map(({ id, Icon, accent, en, ar }) => {
              const content = lang === 'ar' ? ar : en;
              return (
                <div
                  key={id}
                  className="
                    group relative flex flex-col gap-5
                    p-6 sm:p-7
                    rounded-2xl
                    border border-slate-200 dark:border-brand-blue/[0.1]
                    bg-white dark:bg-navy-800/30
                    shadow-sm
                    hover:border-blue-300 dark:hover:border-brand-blue/25
                    hover:shadow-xl hover:shadow-blue-900/5 dark:hover:bg-navy-800/50
                    transition-all duration-300
                    overflow-hidden
                  "
                >
                  {/* Corner glow on hover */}
                  <div
                    className="pointer-events-none absolute -top-12 -end-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: accent
                        ? 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(75,163,227,0.1) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12
                      flex items-center justify-center
                      rounded-xl
                      shrink-0
                      transition-colors duration-300
                      ${accent
                        ? 'bg-amber-50 text-amber-600 dark:bg-brand-accent/10 dark:text-brand-accent group-hover:bg-amber-100 dark:group-hover:bg-brand-accent/15'
                        : 'bg-blue-50  text-blue-600  dark:bg-brand-blue/10  dark:text-brand-blue  group-hover:bg-blue-100  dark:group-hover:bg-brand-blue/15'}
                    `}
                  >
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {content.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[0.925rem] leading-relaxed">
                    {content.description}
                  </p>

                  {/* Service items */}
                  <ul className="flex flex-col gap-2 mt-auto pt-1">
                    {content.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span
                          className={`mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full ${accent ? 'bg-brand-accent/70' : 'bg-brand-blue/70'}`}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Bottom accent line on hover */}
                  <div
                    className={`
                      absolute bottom-0 inset-x-0 h-[2px]
                      scale-x-0 group-hover:scale-x-100
                      transition-transform duration-500 origin-start
                      ${accent
                        ? 'bg-gradient-to-r from-brand-accent/60 via-brand-accent/30 to-transparent'
                        : 'bg-gradient-to-r from-brand-blue/60  via-brand-blue/30  to-transparent'}
                    `}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-transparent">
        {/* Top divider */}
        <div
          className="pointer-events-none mx-auto max-w-3xl h-px mb-16 sm:mb-20"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(75,163,227,0.18), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="
            font-black tracking-tight
            text-2xl sm:text-3xl md:text-4xl
            text-slate-900 dark:text-white mb-4
          ">
            {t('cta_title')}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            {t('cta_subtitle')}
          </p>
          <QuoteModalButton
            ctaLabel={t('cta_button')}
            projectTypes={options.projectTypes}
            timelines={options.timelines}
            className="
              inline-flex items-center gap-2
              px-8 py-4
              min-h-[52px]
              rounded-xl
              bg-brand-blue text-white font-bold text-base
              glow-blue-sm hover:bg-brand-blue-hover
              transition-all duration-200 hover:scale-105 active:scale-100
            "
          />
        </div>
      </section>

    </main>
  );
}
