'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Style tokens ───────────────────────────────────── */
const LABEL    = 'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const SUB      = 'text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 block';
const INPUT    = 'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';
const TEXTAREA = INPUT + ' resize-none leading-relaxed';

/* ─── Bilingual UI labels ────────────────────────────── */
const L = {
  en: {
    pageTitle:        'Home Page Content',
    pageDesc:         'Edit every bilingual text field on the home page. Changes are live immediately after saving.',
    sectionA:         'Hero Section',
    sectionB:         'Stats Bar',
    sectionC:         'Services Section Intro',
    statsDesc:        'The four key metrics displayed beneath the hero. The value is shared across both languages; only the label is translated.',
    heroBadge:        'Hero Badge / Eyebrow',
    headlineDiv:      'Main Headline',
    headlineLine1:    'Headline — Line 1',
    headlineLine2:    'Headline — Line 2 (rendered in accent colour)',
    accentTag:        'Accent Tag',
    subHeadline:      'Sub-headline',
    ctaDiv:           'CTA Buttons',
    primaryBtn:       'Primary Button',
    secondaryBtn:     'Secondary Button',
    statLabel:        'Stat',
    statValue:        'Value',
    statValueNote:    '(displayed identically in both languages)',
    statLabelField:   'Label',
    eyebrow:          'Eyebrow Tag',
    sectionHeading:   'Section Heading',
    introParagraph:   'Intro Paragraph',
    ctaButton:        'CTA Button',
    savesTo:          'Saves to',
    savesAnd:         'and',
    savesLive:        '— live immediately.',
    save:             'Save Changes',
    saving:           'Saving…',
    saved:            '✓ Saved!',
  },
  ar: {
    pageTitle:        'محتوى الصفحة الرئيسية',
    pageDesc:         'عدّل جميع حقول النصوص ثنائية اللغة في الصفحة الرئيسية. التغييرات فورية بعد الحفظ.',
    sectionA:         'قسم الهيرو',
    sectionB:         'شريط الإحصائيات',
    sectionC:         'مقدمة قسم الخدمات',
    statsDesc:        'الأرقام الأربعة الرئيسية أسفل الهيرو. القيمة مشتركة بين اللغتين، ويُترجم التسمية فقط.',
    heroBadge:        'شارة / وسم الهيرو',
    headlineDiv:      'العنوان الرئيسي',
    headlineLine1:    'العنوان — السطر الأول',
    headlineLine2:    'العنوان — السطر الثاني (يُعرض بلون التمييز)',
    accentTag:        'وسم التمييز',
    subHeadline:      'العنوان الفرعي',
    ctaDiv:           'أزرار الدعوة للإجراء',
    primaryBtn:       'الزر الرئيسي',
    secondaryBtn:     'الزر الثانوي',
    statLabel:        'إحصائية',
    statValue:        'القيمة',
    statValueNote:    '(تُعرض بشكل متطابق في كلتا اللغتين)',
    statLabelField:   'التسمية',
    eyebrow:          'الوسم التعريفي',
    sectionHeading:   'عنوان القسم',
    introParagraph:   'الفقرة التمهيدية',
    ctaButton:        'نص زر الدعوة للإجراء',
    savesTo:          'يحفظ في',
    savesAnd:         'و',
    savesLive:        '— فوري بعد الحفظ.',
    save:             'حفظ التغييرات',
    saving:           'جارٍ الحفظ…',
    saved:            '✓ تم الحفظ!',
  },
};

/* ─── BiField — EN always left, AR always right ──────── */
function BiField({
  label, valueEn, valueAr, onEn, onAr,
  rows = 1, placeholderEn = '', placeholderAr = '',
}: {
  label: string;
  valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  rows?: number; placeholderEn?: string; placeholderAr?: string;
}) {
  return (
    <div className="space-y-2">
      <p className={LABEL}>{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
        <div>
          <span className={SUB}>EN — English</span>
          {rows > 1
            ? <textarea className={TEXTAREA} value={valueEn} onChange={e => onEn(e.target.value)} rows={rows} dir="ltr"  placeholder={placeholderEn} />
            : <input    className={INPUT}    value={valueEn} onChange={e => onEn(e.target.value)}          dir="ltr"  placeholder={placeholderEn} />}
        </div>
        <div>
          <span className={SUB}>AR — العربية</span>
          {rows > 1
            ? <textarea className={TEXTAREA} value={valueAr} onChange={e => onAr(e.target.value)} rows={rows} dir="rtl" placeholder={placeholderAr} />
            : <input    className={INPUT}    value={valueAr} onChange={e => onAr(e.target.value)}          dir="rtl" placeholder={placeholderAr} />}
        </div>
      </div>
    </div>
  );
}

/* ─── SectionCard ────────────────────────────────────── */
function SectionCard({
  title, badge, children, defaultOpen = false,
}: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-start hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150"
      >
        {badge && (
          <span className="shrink-0 w-6 h-6 rounded-md bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
            {badge}
          </span>
        )}
        <span className="flex-1 font-bold text-slate-900 dark:text-white text-sm">{title}</span>
        <ChevronDown
          size={15} strokeWidth={2.5}
          className={['shrink-0 text-slate-400 transition-transform duration-300', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>
      {/* Smooth open/close via max-height — keeps children mounted so values aren't lost */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? '4000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── FieldDivider ───────────────────────────────────── */
function FieldDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

/* ─── StatRow ────────────────────────────────────────── */
const STAT_PH = {
  value:   ['50+',  '10+',               '24/7',         '100%'],
  labelEn: ['Completed Projects', 'Years of Expertise', 'Tech Support', 'Smart Infrastructure'],
  labelAr: ['مشروع منجز',         'سنوات من الخبرة',    'دعم فني',      'بنية تحتية ذكية'],
};

function StatRow({
  index, t, value, labelEn, labelAr, onValue, onLabelEn, onLabelAr,
}: {
  index: number; t: typeof L['en'];
  value: string; labelEn: string; labelAr: string;
  onValue: (v: string) => void; onLabelEn: (v: string) => void; onLabelAr: (v: string) => void;
}) {
  const i = index - 1;
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
          {index}
        </span>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.statLabel} {index}
        </span>
      </div>

      <div>
        <label className={LABEL}>
          {t.statValue}{' '}
          <span className="normal-case font-normal text-slate-400 dark:text-slate-500 tracking-normal">
            {t.statValueNote}
          </span>
        </label>
        <input
          className={INPUT}
          value={value}
          onChange={e => onValue(e.target.value)}
          dir="ltr"
          placeholder={STAT_PH.value[i] ?? ''}
        />
      </div>

      <div className="space-y-2">
        <p className={LABEL}>{t.statLabelField}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
          <div>
            <span className={SUB}>EN — English</span>
            <input className={INPUT} value={labelEn} onChange={e => onLabelEn(e.target.value)}
              dir="ltr" placeholder={STAT_PH.labelEn[i] ?? ''} />
          </div>
          <div>
            <span className={SUB}>AR — العربية</span>
            <input className={INPUT} value={labelAr} onChange={e => onLabelAr(e.target.value)}
              dir="rtl" placeholder={STAT_PH.labelAr[i] ?? ''} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
type MsgMap = Record<string, Record<string, unknown>>;

export default function HomeContentPage() {
  const { lang }  = useAdminLang();
  const t         = L[lang];

  const [enMsg,   setEnMsg]   = useState<MsgMap>({});
  const [arMsg,   setArMsg]   = useState<MsgMap>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/home')
      .then(r => r.json())
      .then(d => {
        setEnMsg(d.en ?? {});
        setArMsg(d.ar ?? {});
      })
      .finally(() => setLoading(false));
  }, []);

  const en    = (ns: string, k: string): string => (enMsg[ns] as Record<string, string>)?.[k] ?? '';
  const ar    = (ns: string, k: string): string => (arMsg[ns] as Record<string, string>)?.[k] ?? '';
  const setEn = (ns: string, k: string, v: string) =>
    setEnMsg(p => ({ ...p, [ns]: { ...(p[ns] as Record<string, string> ?? {}), [k]: v } }));
  const setAr = (ns: string, k: string, v: string) =>
    setArMsg(p => ({ ...p, [ns]: { ...(p[ns] as Record<string, string> ?? {}), [k]: v } }));

  const setStatValue = (n: number, v: string) => {
    setEn('stats', `stat${n}_value`, v);
    setAr('stats', `stat${n}_value`, v);
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/home', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ en: enMsg, ar: arMsg }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مجدداً.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [enMsg, arMsg, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-2 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      {/* Page heading */}
      <div className="px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      {/* ── A — Hero ─────────────────────────────────────── */}
      <SectionCard title={t.sectionA} badge="A" defaultOpen>

        <BiField
          label={t.heroBadge}
          valueEn={en('hero', 'badge')}         valueAr={ar('hero', 'badge')}
          onEn={v => setEn('hero', 'badge', v)} onAr={v => setAr('hero', 'badge', v)}
          placeholderEn="Certified Electrical, Low Current & Smart Infrastructure Contractor"
          placeholderAr="مقاول معتمد في الكهرباء والتيار الخفيف والبنية التحتية الذكية"
        />

        <FieldDivider label={t.headlineDiv} />

        <BiField
          label={t.headlineLine1}
          valueEn={en('hero', 'headline_line1')}         valueAr={ar('hero', 'headline_line1')}
          onEn={v => setEn('hero', 'headline_line1', v)} onAr={v => setAr('hero', 'headline_line1', v)}
          placeholderEn="Advanced Energy"
          placeholderAr="حلول طاقة"
        />

        <BiField
          label={t.headlineLine2}
          valueEn={en('hero', 'headline_line2')}         valueAr={ar('hero', 'headline_line2')}
          onEn={v => setEn('hero', 'headline_line2', v)} onAr={v => setAr('hero', 'headline_line2', v)}
          placeholderEn="Solutions"
          placeholderAr="متقدمة"
        />

        <BiField
          label={t.accentTag}
          valueEn={en('hero', 'headline_accent')}         valueAr={ar('hero', 'headline_accent')}
          onEn={v => setEn('hero', 'headline_accent', v)} onAr={v => setAr('hero', 'headline_accent', v)}
          placeholderEn="Smart. Scalable. Reliable."
          placeholderAr="ذكي. قابل للتوسع. موثوق."
        />

        <BiField
          label={t.subHeadline}
          rows={3}
          valueEn={en('hero', 'subtitle')}         valueAr={ar('hero', 'subtitle')}
          onEn={v => setEn('hero', 'subtitle', v)} onAr={v => setAr('hero', 'subtitle', v)}
          placeholderEn="From high-voltage electrical installations and solar energy to low current systems…"
          placeholderAr="من منشآت الجهد العالي وأنظمة الطاقة الشمسية إلى أنظمة التيار الخفيف…"
        />

        <FieldDivider label={t.ctaDiv} />

        <BiField
          label={t.primaryBtn}
          valueEn={en('hero', 'cta_primary')}         valueAr={ar('hero', 'cta_primary')}
          onEn={v => setEn('hero', 'cta_primary', v)} onAr={v => setAr('hero', 'cta_primary', v)}
          placeholderEn="View Our Projects"
          placeholderAr="استعرض مشاريعنا"
        />

        <BiField
          label={t.secondaryBtn}
          valueEn={en('hero', 'cta_secondary')}         valueAr={ar('hero', 'cta_secondary')}
          onEn={v => setEn('hero', 'cta_secondary', v)} onAr={v => setAr('hero', 'cta_secondary', v)}
          placeholderEn="Explore Services"
          placeholderAr="استكشف خدماتنا"
        />

      </SectionCard>

      {/* ── B — Stats ─────────────────────────────────────── */}
      <SectionCard title={t.sectionB} badge="B" defaultOpen>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.statsDesc}</p>
        {([1, 2, 3, 4] as const).map(n => (
          <StatRow
            key={n}
            index={n}
            t={t}
            value={en('stats', `stat${n}_value`)}
            labelEn={en('stats', `stat${n}_label`)}
            labelAr={ar('stats', `stat${n}_label`)}
            onValue={v => setStatValue(n, v)}
            onLabelEn={v => setEn('stats', `stat${n}_label`, v)}
            onLabelAr={v => setAr('stats', `stat${n}_label`, v)}
          />
        ))}
      </SectionCard>

      {/* ── C — Services Intro ────────────────────────────── */}
      <SectionCard title={t.sectionC} badge="C" defaultOpen>

        <BiField
          label={t.eyebrow}
          valueEn={en('services_section', 'eyebrow')}         valueAr={ar('services_section', 'eyebrow')}
          onEn={v => setEn('services_section', 'eyebrow', v)} onAr={v => setAr('services_section', 'eyebrow', v)}
          placeholderEn="What We Do"
          placeholderAr="ما نقدمه"
        />

        <BiField
          label={t.sectionHeading}
          valueEn={en('services_section', 'title')}         valueAr={ar('services_section', 'title')}
          onEn={v => setEn('services_section', 'title', v)} onAr={v => setAr('services_section', 'title', v)}
          placeholderEn="End-to-End Electrical & Smart Infrastructure"
          placeholderAr="حلول كهربائية وبنية تحتية ذكية متكاملة"
        />

        <BiField
          label={t.introParagraph}
          rows={3}
          valueEn={en('services_section', 'subtitle')}         valueAr={ar('services_section', 'subtitle')}
          onEn={v => setEn('services_section', 'subtitle', v)} onAr={v => setAr('services_section', 'subtitle', v)}
          placeholderEn="From initial design to commissioning — integrated solutions that power, protect, and connect modern facilities."
          placeholderAr="من التصميم الأولي حتى التشغيل — حلول متكاملة تُشغّل وتحمي وتربط المنشآت الحديثة."
        />

        <BiField
          label={t.ctaButton}
          valueEn={en('services_section', 'cta')}         valueAr={ar('services_section', 'cta')}
          onEn={v => setEn('services_section', 'cta', v)} onAr={v => setAr('services_section', 'cta', v)}
          placeholderEn="View All Services"
          placeholderAr="عرض جميع الخدمات"
        />

      </SectionCard>

      {/* ── Floating Save Bar ─────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10">
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block flex-1 min-w-0">
            {t.savesTo}{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">messages/en.json</code>
            {' '}{t.savesAnd}{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">messages/ar.json</code>
            {' '}{t.savesLive}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={[
              'ms-auto flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm select-none whitespace-nowrap',
              saved  ? 'bg-emerald-500 text-white'     : 'bg-blue-600 hover:bg-blue-700 text-white',
              saving ? 'opacity-60 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                {t.saving}
              </>
            ) : saved ? t.saved : t.save}
          </button>
        </div>
      </div>

    </div>
  );
}
