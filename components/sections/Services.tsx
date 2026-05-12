import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

function PowerIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="currentColor" stroke="none"/></svg>;
}
function SolarIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
}
function ShieldIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function ServerIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
}
function BmsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/></svg>;
}
function AutoIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
}

const CARDS = [
  { key: 'power',        Icon: PowerIcon,  accent: false },
  { key: 'solar',        Icon: SolarIcon,  accent: true  },
  { key: 'low_current',  Icon: ShieldIcon, accent: false },
  { key: 'data_centers', Icon: ServerIcon, accent: false },
  { key: 'bms',          Icon: BmsIcon,    accent: false },
  { key: 'plc_scada',    Icon: AutoIcon,   accent: true  },
] as const;

export default async function Services() {
  const t = await getTranslations('services_section');

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-x-hidden bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      {/* Top separator glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(75,163,227,0.25), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="
            inline-flex items-center gap-2
            text-xs sm:text-sm font-bold tracking-[0.2em] uppercase
            text-blue-600/80 dark:text-blue-400/80
            mb-3 sm:mb-4
          ">
            <span className="block w-6 h-px bg-brand-blue/40 dark:bg-blue-500/40" aria-hidden="true" />
            {t('eyebrow')}
            <span className="block w-6 h-px bg-brand-blue/40 dark:bg-blue-500/40" aria-hidden="true" />
          </p>

          <h2 className="
            font-black tracking-tight leading-tight
            text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]
            text-slate-900 dark:text-white
            mb-3 sm:mb-4
            max-w-3xl mx-auto
          ">
            {t('title')}
          </h2>

          <p className="
            text-slate-600 dark:text-slate-400 leading-relaxed
            text-sm sm:text-base lg:text-[1.05rem]
            max-w-xl lg:max-w-2xl mx-auto
          ">
            {t('subtitle')}
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {CARDS.map(({ key, Icon, accent }) => (
            <div
              key={key}
              className="
                group relative flex flex-col gap-4
                p-5 sm:p-6
                rounded-xl sm:rounded-2xl
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/60
                shadow-sm dark:shadow-none
                hover:border-blue-400/40 dark:hover:border-blue-600/40
                hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/20
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* Corner glow on hover */}
              <div
                className="pointer-events-none absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: accent ? 'radial-gradient(circle, rgba(234,179,8,0.14) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Icon box */}
              <div className={`
                w-11 h-11 sm:w-12 sm:h-12
                flex items-center justify-center
                rounded-lg sm:rounded-xl
                border backdrop-blur-sm
                transition-all duration-300
                shrink-0
                ${accent
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-brand-accent group-hover:bg-brand-accent/15 group-hover:border-brand-accent/40'
                  : 'bg-blue-50  dark:bg-blue-950/40  border-blue-200  dark:border-blue-800/60  text-blue-600 dark:text-blue-400 group-hover:bg-blue-600/15 group-hover:border-blue-600/40'}
              `}>
                <Icon />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug transition-colors duration-300">
                {t(`cards.${key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1">
                {t(`cards.${key}.desc`)}
              </p>

              {/* Bottom accent line */}
              <div
                className={`
                  absolute bottom-0 inset-x-0 h-[2px]
                  scale-x-0 group-hover:scale-x-100
                  transition-transform duration-500 origin-start
                  ${accent
                    ? 'bg-gradient-to-r from-brand-accent/60 via-brand-accent/30 to-transparent'
                    : 'bg-gradient-to-r from-brand-blue/60 via-brand-blue/30  to-transparent'}
                `}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-10 sm:mt-12 lg:mt-14">
          <Link
            href="/services"
            className="
              inline-flex items-center gap-2
              px-6 sm:px-8 py-3 sm:py-3.5
              min-h-[48px]
              rounded-lg
              border border-blue-600/25 dark:border-blue-500/30
              text-blue-600 dark:text-blue-400
              font-semibold
              text-sm sm:text-base
              hover:border-blue-600/50 dark:hover:border-blue-400/50
              hover:bg-blue-600/[0.07] dark:hover:bg-blue-500/[0.10]
              transition-all duration-200
            "
          >
            {t('cta')}
            <span className="rtl:rotate-180 shrink-0" aria-hidden="true"><ArrowIcon /></span>
          </Link>
        </div>

      </div>
    </section>
  );
}
