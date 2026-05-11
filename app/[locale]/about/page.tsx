import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'About Us – BetaVolt Engineering & Contracting',
  description:
    'BetaVolt delivers precision-engineered electrical, low current, and smart infrastructure solutions across Saudi Arabia and the UAE.',
};

type Props = { params: Promise<{ locale: string }> };
type Lang  = 'en' | 'ar';

// ── Icon components ────────────────────────────────────────────────────────

function BadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  );
}

// ── Bilingual data ─────────────────────────────────────────────────────────

const DNA = [
  {
    gold: false,
    title:  { en: 'Vision',  ar: 'الرؤية'  },
    body: {
      en: 'To be the leading smart infrastructure contractor in MENA — powering and connecting the facilities of tomorrow with precision-engineered solutions.',
      ar: 'أن نكون المقاول الرائد في البنية التحتية الذكية بمنطقة الشرق الأوسط وشمال أفريقيا — نُشغّل منشآت الغد ونربطها بحلول مُهندَسة بدقة.',
    },
  },
  {
    gold: true,
    title:  { en: 'Mission', ar: 'المهمة' },
    body: {
      en: 'Deliver certified, precision-engineered electrical, low current, and smart systems — on time, within budget, with zero compromise on quality.',
      ar: 'تقديم أنظمة كهربائية وتيار خفيف وذكية معتمدة ومُهندَسة بدقة — في الوقت المحدد، ضمن الميزانية، دون أي تنازل عن الجودة.',
    },
  },
  {
    gold: false,
    title:  { en: 'Values',  ar: 'القيم'   },
    body: {
      en: 'Precision. Integrity. Innovation. We treat every conduit run and control panel as a direct reflection of our engineering identity.',
      ar: 'الدقة. النزاهة. الابتكار. نتعامل مع كل مسار كابل ولوحة تحكم باعتبارها انعكاساً مباشراً لهويتنا الهندسية.',
    },
  },
] as const;

const STATS = [
  {
    value: { en: '+50,000 m', ar: '+50,000 م'   },
    label: { en: 'Fiber Optic Cables Laid',   ar: 'كوابل ألياف بصرية مُدَّت'   },
  },
  {
    value: { en: '+10 MW',    ar: '+10 ميغاواط' },
    label: { en: 'Solar Power Installed',     ar: 'طاقة شمسية مُركَّبة'         },
  },
  {
    value: { en: '+5,000',    ar: '+5,000'       },
    label: { en: 'Smart Nodes Configured',   ar: 'عقدة ذكية مُهيَّأة'           },
  },
  {
    value: { en: 'Zero',      ar: 'صفر'          },
    label: { en: 'Downtime Delivered',       ar: 'توقف غير مجدول'               },
  },
] as const;

const CITIES = [
  { name: { en: 'Riyadh', ar: 'الرياض' }, top: '38%', left: '57%', gold: false },
  { name: { en: 'Jeddah', ar: 'جدة'    }, top: '52%', left: '33%', gold: true  },
  { name: { en: 'Abha',   ar: 'أبها'   }, top: '67%', left: '43%', gold: false },
] as const;

const WHY = [
  {
    Icon: BadgeIcon,
    gold: false,
    title: { en: 'Certified Engineers',        ar: 'مهندسون معتمدون'               },
    body:  {
      en: 'Our team holds international certifications across electrical systems, fiber networks, CCTV, fire safety, and intelligent building controls.',
      ar: 'يحمل فريقنا شهادات دولية في الأنظمة الكهربائية والألياف البصرية والمراقبة وإنذار الحريق وأنظمة التحكم الذكي في المباني.',
    },
  },
  {
    Icon: ClockIcon,
    gold: true,
    title: { en: 'On-Time Delivery',           ar: 'التسليم في الموعد'             },
    body:  {
      en: 'A 100% on-time project delivery track record backed by rigorous scheduling, milestone tracking, and proactive risk management.',
      ar: 'سجل حافل بتسليم المشاريع في موعدها، مدعوماً بجدولة صارمة وتتبع دقيق للمراحل وإدارة استباقية للمخاطر.',
    },
  },
  {
    Icon: HeadsetIcon,
    gold: false,
    title: { en: '24/7 Tech Support',          ar: 'دعم فني على مدار الساعة'       },
    body:  {
      en: 'Round-the-clock technical support and preventive maintenance contracts — ensuring your critical infrastructure never misses a beat.',
      ar: 'دعم فني وعقود صيانة وقائية على مدار الساعة — لضمان أن بنيتك التحتية الحيوية لا تتوقف أبداً.',
    },
  },
] as const;

// ── Shared eyebrow component ───────────────────────────────────────────────

function Eyebrow({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-brand-blue/70 mb-4">
      <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
      {label}
      <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale as Lang;
  const t    = await getTranslations('about');

  return (
    <main className="overflow-x-hidden bg-slate-900 text-white">

      {/* ── 1. Blueprint Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[72vh] flex items-center justify-center pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(75,163,227,0.13) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        {/* Top edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right,transparent,rgba(75,163,227,0.3),transparent)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow label={t('eyebrow')} />
          <h1
            className="font-black tracking-tight leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-white mb-6"
            style={lang === 'ar' ? { lineHeight: '1.5' } : undefined}
          >
            {t('hero_headline')}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Bottom fade into slate-900 */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-900 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ── 2. Company DNA — Circuit Pathway ──────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Eyebrow label={t('dna_eyebrow')} />
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white">
              {t('dna_title')}
            </h2>
          </div>

          {/* Vertical circuit line + nodes */}
          <div className="relative">
            {/* Glowing vertical line */}
            <div
              className="absolute start-[13px] top-5 bottom-5 w-px"
              style={{
                background:
                  'linear-gradient(to bottom,rgba(75,163,227,0.8),rgba(234,179,8,0.7),rgba(75,163,227,0.8))',
              }}
              aria-hidden="true"
            />

            <div className="flex flex-col">
              {DNA.map((node, i) => (
                <div key={i} className="relative flex items-start gap-6 sm:gap-8 pb-10 last:pb-0">

                  {/* Glowing dot node */}
                  <div className="relative z-10 shrink-0 mt-1">
                    <div
                      className={[
                        'w-7 h-7 rounded-full border-2 flex items-center justify-center bg-slate-900',
                        node.gold
                          ? 'border-brand-accent shadow-[0_0_14px_rgba(234,179,8,0.55)]'
                          : 'border-brand-blue  shadow-[0_0_14px_rgba(75,163,227,0.55)]',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'w-2.5 h-2.5 rounded-full animate-pulse',
                          node.gold ? 'bg-brand-accent' : 'bg-brand-blue',
                        ].join(' ')}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md p-5 sm:p-6 hover:border-brand-blue/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.10)] transition-all duration-300">
                    <h3
                      className={[
                        'text-base font-black mb-2 uppercase tracking-widest',
                        node.gold ? 'text-brand-accent' : 'text-brand-blue',
                      ].join(' ')}
                    >
                      {node.title[lang]}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {node.body[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Heavy Engineering Stats ────────────────────────────────── */}
      <section className="py-20 sm:py-28 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow label={t('stats_eyebrow')} />
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white">
              {t('stats_title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3 p-6 sm:p-8 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300"
              >
                <p className="font-black text-2xl sm:text-3xl lg:text-4xl text-brand-accent tabular-nums leading-none">
                  {s.value[lang]}
                </p>
                <p className="text-slate-300 text-sm sm:text-[0.9rem] font-medium leading-snug">
                  {s.label[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Glowing Map — Our Footprint ────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow label={t('map_eyebrow')} />
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white">
              {t('map_title')}
            </h2>
          </div>

          {/* Stylised map container */}
          <div
            className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/40 backdrop-blur-md"
            style={{
              backgroundImage: 'radial-gradient(rgba(75,163,227,0.08) 1px,transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          >
            {/* Ambient center glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 65% 65% at 52% 50%,rgba(75,163,227,0.07) 0%,transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Saudi Arabia silhouette hint — decorative border lines */}
            <div
              className="pointer-events-none absolute inset-6 rounded-xl border border-slate-700/30"
              aria-hidden="true"
            />

            {/* City markers */}
            {CITIES.map((city) => (
              <div
                key={city.name.en}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                style={{ top: city.top, left: city.left }}
              >
                {/* Layered ping animation */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={[
                      'absolute inline-flex h-10 w-10 rounded-full opacity-30 animate-ping',
                      city.gold ? 'bg-brand-accent' : 'bg-brand-blue',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'absolute inline-flex h-6 w-6 rounded-full opacity-25 animate-pulse',
                      city.gold ? 'bg-brand-accent' : 'bg-brand-blue',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'relative inline-flex h-3.5 w-3.5 rounded-full',
                      city.gold
                        ? 'bg-brand-accent shadow-[0_0_10px_rgba(234,179,8,0.7)]'
                        : 'bg-brand-blue  shadow-[0_0_10px_rgba(75,163,227,0.7)]',
                    ].join(' ')}
                  />
                </div>

                {/* City label pill */}
                <span
                  className={[
                    'text-[11px] font-bold tracking-wide whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/80 border',
                    city.gold
                      ? 'text-brand-accent border-brand-accent/35'
                      : 'text-brand-blue  border-brand-blue/35',
                  ].join(' ')}
                >
                  {city.name[lang]}
                </span>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 end-4 flex flex-col gap-1.5 bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50 px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0" />
                {lang === 'ar' ? 'مكتب رئيسي' : 'Main Office'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0" />
                {lang === 'ar' ? 'فرع إقليمي' : 'Regional Branch'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Why BetaVolt ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow label={t('why_eyebrow')} />
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white">
              {t('why_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
            {WHY.map(({ Icon, gold, title, body }, i) => (
              <div
                key={i}
                className="group relative flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden"
              >
                {/* Corner glow on hover */}
                <div
                  className="pointer-events-none absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: gold
                      ? 'radial-gradient(circle,rgba(234,179,8,0.15) 0%,transparent 70%)'
                      : 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                {/* Icon box */}
                <div
                  className={[
                    'w-12 h-12 rounded-xl flex items-center justify-center border backdrop-blur-sm shrink-0 transition-all duration-300',
                    gold
                      ? 'bg-slate-700/50 border-slate-600/50 text-brand-accent group-hover:bg-brand-accent/15 group-hover:border-brand-accent/40'
                      : 'bg-slate-700/50 border-slate-600/50 text-brand-blue  group-hover:bg-brand-blue/15  group-hover:border-brand-blue/40',
                  ].join(' ')}
                >
                  <Icon />
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {title[lang]}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed flex-1">
                  {body[lang]}
                </p>

                {/* Bottom accent line */}
                <div
                  className={[
                    'absolute bottom-0 inset-x-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-start',
                    gold
                      ? 'bg-gradient-to-r from-brand-accent/70 via-brand-accent/35 to-transparent'
                      : 'bg-gradient-to-r from-brand-blue/70  via-brand-blue/35  to-transparent',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
