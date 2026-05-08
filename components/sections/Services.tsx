import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

/* ── Service card icon components (24×24) ── */
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

/* One card uses brand-accent tint, the rest use brand-blue */
const CARDS = [
  { key: 'power',       Icon: PowerIcon,  accent: false },
  { key: 'solar',       Icon: SolarIcon,  accent: true  },
  { key: 'low_current', Icon: ShieldIcon, accent: false },
  { key: 'data_centers',Icon: ServerIcon, accent: false },
  { key: 'bms',         Icon: BmsIcon,    accent: false },
  { key: 'plc_scada',   Icon: AutoIcon,   accent: true  },
] as const;

export default async function Services() {
  const t = await getTranslations('services_section');

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-x-hidden"
    >
      {/* Subtle mid-page glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(75,163,227,0.2), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          {/* Eyebrow */}
          <p className="
            inline-flex items-center gap-2
            text-xs sm:text-sm font-bold tracking-[0.2em] uppercase
            text-brand-blue/70
            mb-3 sm:mb-4
          ">
            <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
            {t('eyebrow')}
            <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
          </p>

          <h2 className="
            font-black tracking-tight leading-tight
            text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]
            text-white
            mb-3 sm:mb-4
            max-w-3xl mx-auto
          ">
            {t('title')}
          </h2>

          <p className="
            text-slate-400 leading-relaxed
            text-sm sm:text-base lg:text-[1.05rem]
            max-w-xl lg:max-w-2xl mx-auto
          ">
            {t('subtitle')}
          </p>
        </div>

        {/* ── Cards grid ── */}
        {/* mobile: 1 col | sm: 2 col | lg: 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {CARDS.map(({ key, Icon, accent }) => (
            <div
              key={key}
              className="
                group relative flex flex-col gap-4
                p-5 sm:p-6
                rounded-xl sm:rounded-2xl
                border border-brand-blue/[0.1]
                bg-navy-800/30
                hover:border-brand-blue/25 hover:bg-navy-800/50
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* Corner glow on hover */}
              <div
                className="pointer-events-none absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: accent ? 'radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(75,163,227,0.12) 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Icon box */}
              <div className={`
                w-11 h-11 sm:w-12 sm:h-12
                flex items-center justify-center
                rounded-lg sm:rounded-xl
                transition-colors duration-300
                shrink-0
                ${accent
                  ? 'bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent/15'
                  : 'bg-brand-blue/10  text-brand-blue  group-hover:bg-brand-blue/15'}
              `}>
                <Icon />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {t(`cards.${key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
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
              border border-brand-blue/25 text-brand-blue/90 font-semibold
              text-sm sm:text-base
              hover:border-brand-blue/50 hover:bg-brand-blue/[0.07] hover:text-brand-blue
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
