'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Zap, Wifi, Server, ClipboardCheck, Building2, type LucideIcon } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Style tokens ───────────────────────────────────── */
const LABEL    = 'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const SUB      = 'text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 block';
const INPUT    = 'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';
const TEXTAREA = INPUT + ' resize-none leading-relaxed';

/* ─── Bilingual UI labels ────────────────────────────── */
const L = {
  en: {
    pageTitle:      'Services Page Content',
    pageDesc:       'Edit the bilingual content for the public Services page — header text and all service cards.',
    sectionA:       'Page Header',
    sectionB:       'Service Cards',
    sectionBDesc:   'Each card maps to a panel on the public Services page. Enter bullet points one per line.',
    eyebrow:        'Eyebrow Tag',
    title:          'Page Title',
    subtitle:       'Subtitle',
    ctaHeading:     'CTA Section Heading',
    ctaSubtitle:    'CTA Subtitle',
    ctaButton:      'CTA Button Label',
    cardTitle:      'Service Title',
    cardDesc:       'Description',
    cardBullets:    'Features / Bullet Points',
    cardBulletsHint:'One item per line',
    savesTo:        'Saves to',
    savesAnd:       'and',
    savesLive:      '— live immediately.',
    save:           'Save Changes',
    saving:         'Saving…',
    saved:          '✓ Saved!',
  },
  ar: {
    pageTitle:      'محتوى صفحة الخدمات',
    pageDesc:       'عدّل المحتوى ثنائي اللغة لصفحة الخدمات العامة — نص الرأس وجميع بطاقات الخدمات.',
    sectionA:       'رأس الصفحة',
    sectionB:       'بطاقات الخدمات',
    sectionBDesc:   'تتوافق كل بطاقة مع قسم في صفحة الخدمات العامة. أدخل نقاط القائمة سطراً واحداً لكل عنصر.',
    eyebrow:        'الوسم التعريفي',
    title:          'عنوان الصفحة',
    subtitle:       'العنوان الفرعي',
    ctaHeading:     'عنوان قسم الدعوة للإجراء',
    ctaSubtitle:    'العنوان الفرعي للدعوة',
    ctaButton:      'نص زر الدعوة للإجراء',
    cardTitle:      'عنوان الخدمة',
    cardDesc:       'الوصف',
    cardBullets:    'الميزات / نقاط القائمة',
    cardBulletsHint:'عنصر واحد في كل سطر',
    savesTo:        'يحفظ في',
    savesAnd:       'و',
    savesLive:      '— فوري بعد الحفظ.',
    save:           'حفظ التغييرات',
    saving:         'جارٍ الحفظ…',
    saved:          '✓ تم الحفظ!',
  },
};

/* ─── Types ──────────────────────────────────────────── */
interface PageHeader {
  eyebrow: string; title: string; subtitle: string;
  cta_title: string; cta_subtitle: string; cta_button: string;
}
interface CardLocale { title: string; description: string; items: string; }
interface CardEntry  { id: string; en: CardLocale; ar: CardLocale; }
interface EditorState {
  pageHeader: { en: PageHeader; ar: PageHeader };
  cards: CardEntry[];
}

/* ─── Card icon map ──────────────────────────────────── */
const CARD_META: Record<string, { Icon: LucideIcon; color: string }> = {
  'power-electrical':   { Icon: Zap,            color: 'text-blue-500'  },
  'low-current-smart':  { Icon: Wifi,            color: 'text-blue-500'  },
  'data-centers-comms': { Icon: Server,          color: 'text-amber-500' },
  'engineering-testing':{ Icon: ClipboardCheck,  color: 'text-blue-500'  },
  'contracting-trading':{ Icon: Building2,       color: 'text-blue-500'  },
};

/* ─── BiField ────────────────────────────────────────── */
function BiField({
  label, valueEn, valueAr, onEn, onAr,
  rows = 1, placeholderEn = '', placeholderAr = '', hint = '',
}: {
  label: string;
  valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  rows?: number; placeholderEn?: string; placeholderAr?: string; hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <p className={LABEL}>{label}</p>
        {hint && <span className="text-[10px] text-slate-400 dark:text-slate-600 normal-case font-normal">{hint}</span>}
      </div>
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
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
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

/* ─── ServiceCardEditor ──────────────────────────────── */
function ServiceCardEditor({
  card, index, t, lang, onUpdate,
}: {
  card: CardEntry; index: number;
  t: typeof L['en']; lang: 'en' | 'ar';
  onUpdate: (updated: CardEntry) => void;
}) {
  const [open, setOpen] = useState(index === 0);
  const meta = CARD_META[card.id] ?? { Icon: Zap, color: 'text-blue-500' };
  const { Icon } = meta;

  function update(lang: 'en' | 'ar', field: keyof CardLocale, value: string) {
    onUpdate({ ...card, [lang]: { ...card[lang], [field]: value } });
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 text-start hover:bg-slate-100/60 dark:hover:bg-slate-700/30 transition-colors duration-150"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <Icon size={14} strokeWidth={1.75} className={meta.color} />
        </div>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex-1 min-w-0 truncate">
          {card[lang].title || `${t.cardTitle} ${index + 1}`}
        </span>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 shrink-0 hidden sm:block">
          {card.id}
        </span>
        <ChevronDown
          size={14} strokeWidth={2.5}
          className={['text-slate-400 transition-transform duration-300 shrink-0', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>

      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4 flex flex-col gap-3 sm:gap-4 border-t border-slate-200 dark:border-slate-700/60">
          <BiField
            label={t.cardTitle}
            valueEn={card.en.title}         valueAr={card.ar.title}
            onEn={v => update('en', 'title', v)} onAr={v => update('ar', 'title', v)}
          />
          <BiField
            label={t.cardDesc}
            rows={3}
            valueEn={card.en.description}         valueAr={card.ar.description}
            onEn={v => update('en', 'description', v)} onAr={v => update('ar', 'description', v)}
          />
          <BiField
            label={t.cardBullets}
            hint={t.cardBulletsHint}
            rows={7}
            valueEn={card.en.items}         valueAr={card.ar.items}
            onEn={v => update('en', 'items', v)} onAr={v => update('ar', 'items', v)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ServicesContentPage() {
  const { lang } = useAdminLang();
  const t        = L[lang];
  const dir      = lang === 'ar' ? 'rtl' : 'ltr';

  const [state,   setState]   = useState<EditorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/services')
      .then(r => r.json())
      .then(d => setState(d as EditorState))
      .finally(() => setLoading(false));
  }, []);

  /* ── Header updater ── */
  function updateHeader(lang: 'en' | 'ar', key: keyof PageHeader, value: string) {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pageHeader: { ...prev.pageHeader, [lang]: { ...prev.pageHeader[lang], [key]: value } },
      };
    });
  }

  /* ── Card updater ── */
  function updateCard(updated: CardEntry) {
    setState(prev => {
      if (!prev) return prev;
      return { ...prev, cards: prev.cards.map(c => c.id === updated.id ? updated : c) };
    });
  }

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    if (!state) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/services', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(state),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مجدداً.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [state, lang]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {lang === 'ar' ? 'فشل تحميل المحتوى.' : 'Failed to load content.'}
        </p>
      </div>
    );
  }

  const { pageHeader, cards } = state;

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-2 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      {/* Page heading */}
      <div className="px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      {/* ── A — Page Header ───────────────────────────────── */}
      <SectionCard title={t.sectionA} badge="A" defaultOpen>

        <BiField
          label={t.eyebrow}
          valueEn={pageHeader.en.eyebrow}         valueAr={pageHeader.ar.eyebrow}
          onEn={v => updateHeader('en', 'eyebrow', v)} onAr={v => updateHeader('ar', 'eyebrow', v)}
          placeholderEn="Our Expertise"
          placeholderAr="خبراتنا"
        />

        <BiField
          label={t.title}
          valueEn={pageHeader.en.title}         valueAr={pageHeader.ar.title}
          onEn={v => updateHeader('en', 'title', v)} onAr={v => updateHeader('ar', 'title', v)}
          placeholderEn="Services & Capabilities"
          placeholderAr="خدماتنا وقدراتنا"
        />

        <BiField
          label={t.subtitle}
          rows={3}
          valueEn={pageHeader.en.subtitle}         valueAr={pageHeader.ar.subtitle}
          onEn={v => updateHeader('en', 'subtitle', v)} onAr={v => updateHeader('ar', 'subtitle', v)}
          placeholderEn="Comprehensive electrical, low current, and communications contracting…"
          placeholderAr="مقاولات متكاملة في الكهرباء والتيار الخفيف والاتصالات…"
        />

        <FieldDivider label="CTA" />

        <BiField
          label={t.ctaHeading}
          valueEn={pageHeader.en.cta_title}         valueAr={pageHeader.ar.cta_title}
          onEn={v => updateHeader('en', 'cta_title', v)} onAr={v => updateHeader('ar', 'cta_title', v)}
          placeholderEn="Ready to Start Your Project?"
          placeholderAr="هل أنت مستعد لبدء مشروعك؟"
        />

        <BiField
          label={t.ctaSubtitle}
          rows={2}
          valueEn={pageHeader.en.cta_subtitle}         valueAr={pageHeader.ar.cta_subtitle}
          onEn={v => updateHeader('en', 'cta_subtitle', v)} onAr={v => updateHeader('ar', 'cta_subtitle', v)}
          placeholderEn="Contact our engineering team for a detailed consultation and project quote."
          placeholderAr="تواصل مع فريقنا الهندسي للحصول على استشارة مفصّلة وعرض سعر."
        />

        <BiField
          label={t.ctaButton}
          valueEn={pageHeader.en.cta_button}         valueAr={pageHeader.ar.cta_button}
          onEn={v => updateHeader('en', 'cta_button', v)} onAr={v => updateHeader('ar', 'cta_button', v)}
          placeholderEn="Get a Free Quote"
          placeholderAr="احصل على عرض سعر مجاني"
        />

      </SectionCard>

      {/* ── B — Service Cards ─────────────────────────────── */}
      <SectionCard title={t.sectionB} badge="B" defaultOpen>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.sectionBDesc}</p>
        <div className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <ServiceCardEditor
              key={card.id}
              card={card}
              index={i}
              t={t}
              lang={lang}
              onUpdate={updateCard}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── Floating Save Bar ─────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10">
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block flex-1 min-w-0">
            {t.savesTo}{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">messages/en.json</code>
            {' '}{t.savesAnd}{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">services-cards.json</code>
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
