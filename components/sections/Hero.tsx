import { getTranslations } from 'next-intl/server';

/* ── SVG icons ── */
function BoltIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/></svg>; }
function SunIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>; }
function WifiIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>; }
function CameraIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function ServerIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function CpuIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/></svg>; }
function GearIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function GlobeIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function ArrowIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }

const SERVICE_ICONS = [BoltIcon, SunIcon, WifiIcon, CameraIcon, ServerIcon, CpuIcon, GearIcon, GlobeIcon];
const SERVICE_KEYS  = [
  'industrial_electrical', 'solar_energy', 'low_current', 'cctv_fire',
  'data_centers', 'bms', 'plc_scada', 'networks',
] as const;

export default async function Hero() {
  const t = await getTranslations();

  return (
    <section
      id="home"
      className="
        relative flex items-center justify-center
        min-h-screen
        bg-grid overflow-x-hidden
        pt-20 pb-12
        sm:pt-24 sm:pb-16
        lg:pt-32 lg:pb-24
      "
    >
      {/* ── Primary glow orb ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(1000px,200vw)] h-[500px] sm:h-[600px]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(75,163,227,0.11) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* ── Secondary orb (hidden on small screens to reduce paint cost) ── */}
      <div
        className="pointer-events-none absolute bottom-1/4 -end-20 sm:-end-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(75,163,227,0.4) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ── Decorative gold nodes (desktop only) ── */}
      <div className="pointer-events-none hidden sm:block absolute top-1/3 start-[8%] w-2 h-2 rounded-full bg-brand-accent/40 animate-pulse-slow" aria-hidden="true" />
      <div className="pointer-events-none hidden sm:block absolute top-2/3 end-[12%] w-1.5 h-1.5 rounded-full bg-brand-accent/30 animate-pulse-slow [animation-delay:1s]" aria-hidden="true" />
      <div className="pointer-events-none hidden lg:block absolute top-1/2 start-[18%] w-1 h-1 rounded-full bg-brand-accent/25 animate-pulse-slow [animation-delay:1.8s]" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          mb-5 sm:mb-6 lg:mb-8
          px-3 sm:px-4 py-1.5 rounded-full
          border border-brand-blue/20 bg-brand-blue/[0.06]
          text-brand-blue text-xs sm:text-sm font-semibold tracking-wide
          max-w-full
          animate-fade-up
        ">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse-slow shrink-0" aria-hidden="true" />
          <span className="truncate">{t('hero.badge')}</span>
        </div>

        {/* Headline — mobile-first scale */}
        <h1 className="
          font-black tracking-tight leading-[1.1]
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]
          mb-3 sm:mb-4 lg:mb-5
          animate-fade-up [animation-delay:80ms]
        ">
          <span className="text-white">{t('hero.headline_line1')}</span>
          <br />
          <span className="text-brand-blue text-glow-blue">{t('hero.headline_line2')}</span>
        </h1>

        {/* Accent tagline */}
        <p className="
          text-brand-accent/60 font-bold uppercase tracking-[0.2em]
          text-xs sm:text-sm
          mb-4 sm:mb-5 lg:mb-6
          animate-fade-up [animation-delay:160ms]
        ">
          {t('hero.headline_accent')}
        </p>

        {/* Subtitle */}
        <p className="
          text-slate-400 leading-relaxed sm:leading-[1.85]
          text-sm sm:text-base lg:text-[1.05rem]
          max-w-xl sm:max-w-2xl mx-auto
          mb-8 sm:mb-10
          animate-fade-up [animation-delay:240ms]
        ">
          {t('hero.subtitle')}
        </p>

        {/* ── CTA Buttons — stacked on mobile, row on sm+ ── */}
        <div className="
          flex flex-col sm:flex-row items-stretch sm:items-center justify-center
          gap-3
          mb-10 sm:mb-12 lg:mb-14
          animate-fade-up [animation-delay:320ms]
        ">
          <a
            href="#projects"
            className="
              inline-flex items-center justify-center gap-2
              px-6 sm:px-7 py-3.5
              min-h-[48px]
              rounded-lg
              bg-brand-blue text-brand-dark font-bold
              text-sm sm:text-[0.95rem]
              glow-blue hover:bg-brand-blue-hover
              transition-all duration-200 hover:scale-[1.03] active:scale-100
            "
          >
            {t('hero.cta_primary')}
            <span className="rtl:rotate-180 shrink-0" aria-hidden="true"><ArrowIcon /></span>
          </a>

          <a
            href="#services"
            className="
              inline-flex items-center justify-center gap-2
              px-6 sm:px-7 py-3.5
              min-h-[48px]
              rounded-lg
              border border-brand-blue/25 text-brand-blue/90 font-semibold
              text-sm sm:text-[0.95rem]
              hover:border-brand-accent/50 hover:bg-brand-accent/[0.06] hover:text-brand-accent
              transition-all duration-200
            "
          >
            {t('hero.cta_secondary')}
          </a>
        </div>

        {/* ── Service Pills — 2-col grid on mobile → free wrap on md+ ── */}
        <div className="
          grid grid-cols-2 gap-2
          sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5
          animate-fade-up [animation-delay:420ms]
        ">
          {SERVICE_KEYS.map((key, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <div
                key={key}
                className="
                  flex items-center justify-center sm:justify-start gap-2
                  px-3 sm:px-4 py-2.5 sm:py-2
                  rounded-xl sm:rounded-full
                  border border-brand-blue/[0.14] glass
                  text-slate-400 text-[0.72rem] sm:text-[0.8rem] font-medium
                  hover:border-brand-blue/35 hover:text-brand-blue/90
                  transition-colors duration-200 cursor-default select-none
                "
                style={{ animationDelay: `${420 + i * 40}ms` }}
              >
                <span className="text-brand-accent/60 shrink-0" aria-hidden="true">
                  <Icon />
                </span>
                <span className="leading-tight">{t(`services.${key}`)}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Bottom fade ── */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24 sm:h-32"
        style={{ background: 'linear-gradient(to top, #080c13, transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
}
