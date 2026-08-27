'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, Save, RefreshCw, Upload, Trash2, ImageIcon } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Bilingual labels ───────────────────────────────── */
const L = {
  en: {
    pageTitle:      'Navbar Content',
    pageDesc:       'Edit the navigation link labels, logo, favicon, and CTA button text.',
    sectionFavicon: 'Favicon',
    faviconDesc:    'The small icon shown in browser tabs, bookmarks, and mobile home screens.',
    faviconHint:    'PNG or ICO · max 1 MB · recommended 32×32 or 64×64 px',
    currentFavicon: 'Current Favicon',
    noFavicon:      'None — browser default used',
    uploadFavicon:  'Upload Favicon',
    removeFavicon:  'Remove',
    sectionLogo:  'Logo',
    logoDesc:     'Upload separate logos for dark and light mode. Replaces the default BETAVOLT text mark.',
    logoDark:     'Dark Mode Logo',
    logoLight:    'Light Mode Logo',
    logoDarkHint: 'Shown when the site is in dark mode',
    logoLightHint:'Shown when the site is in light mode',
    noLogo:       'None — default mark used',
    uploadLogo:   'Upload',
    uploadHint:   'PNG, SVG or WebP · max 2 MB · recommended height 32 px',
    removeLogo:   'Remove',
    uploading:    'Uploading…',
    deleting:     'Removing…',
    errUpload:    'Upload failed. Try again.',
    errDelete:    'Remove failed. Try again.',
    sectionA:     'A — Navigation Links',
    sectionB:     'B — CTA Button',
    services:     'Services',
    projects:     'Projects',
    aboutUs:      'About Us',
    contact:      'Contact',
    ctaDesc:      'The primary action button displayed in the top-right of the navbar.',
    btnLabel:     'Button Label',
    preview:      'Preview:',
    navPreview:   'Live Preview (EN)',
    flagEn:       '🇬🇧', flagAr: '🇸🇦', colEn: 'English', colAr: 'Arabic',
    save:         'Save Changes', saving: 'Saving…', saved: '✓ Saved!',
    saveHint:     'Saves nav labels to EN/AR message files — live on next page load.',
  },
  ar: {
    pageTitle:      'محتوى شريط التنقل',
    pageDesc:       'تعديل تسميات روابط التنقل واللوجو والفافيكون ونص زر الدعوة للعمل.',
    sectionFavicon: 'الفافيكون',
    faviconDesc:    'الأيقونة الصغيرة التي تظهر في تبويبات المتصفح والإشارات المرجعية وشاشة الجوال.',
    faviconHint:    'PNG أو ICO · الحد الأقصى 1 ميجابايت · الحجم الموصى به 32×32 أو 64×64 بكسل',
    currentFavicon: 'الفافيكون الحالي',
    noFavicon:      'لا يوجد — يُستخدم الافتراضي',
    uploadFavicon:  'رفع فافيكون',
    removeFavicon:  'إزالة',
    sectionLogo:  'اللوجو',
    logoDesc:     'ارفع لوجو منفصل للوضع الليلي وآخر للوضع الفاتح. يحل محل النص الافتراضي BETAVOLT.',
    logoDark:     'لوجو الوضع الليلي',
    logoLight:    'لوجو الوضع الفاتح',
    logoDarkHint: 'يظهر عند تفعيل الوضع الليلي',
    logoLightHint:'يظهر عند تفعيل الوضع الفاتح',
    noLogo:       'لا يوجد — يُستخدم الافتراضي',
    uploadLogo:   'رفع',
    uploadHint:   'PNG أو SVG أو WebP · الحد الأقصى 2 ميجابايت · الارتفاع الموصى به 32 بكسل',
    removeLogo:   'إزالة',
    uploading:    'جارٍ الرفع…',
    deleting:     'جارٍ الإزالة…',
    errUpload:    'فشل الرفع. حاول مجدداً.',
    errDelete:    'فشل الإزالة. حاول مجدداً.',
    sectionA:     'أ — روابط التنقل',
    sectionB:     'ب — زر الدعوة للعمل (CTA)',
    services:     'الخدمات',
    projects:     'المشاريع',
    aboutUs:      'من نحن',
    contact:      'تواصل معنا',
    ctaDesc:      'زر الإجراء الرئيسي الظاهر في أعلى يمين شريط التنقل.',
    btnLabel:     'نص الزر',
    preview:      'معاينة:',
    navPreview:   'معاينة مباشرة (EN)',
    flagEn:       '🇬🇧', flagAr: '🇸🇦', colEn: 'الإنجليزية', colAr: 'العربية',
    save:         'حفظ التغييرات', saving: 'جارٍ الحفظ…', saved: '✓ تم الحفظ!',
    saveHint:     'يتم الحفظ في ملفات الرسائل EN/AR — يسري فور إعادة تحميل الصفحة.',
  },
};

type T = typeof L['en'];

/* ─── Style tokens ───────────────────────────────────── */
const LABEL = 'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const INPUT  = 'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';

/* ─── LogoSlot — single upload/preview for one mode ─────── */
function LogoSlot({ mode, label, hint, url, onUploaded, onRemoved, t }: {
  mode:       'dark' | 'light';
  label:      string;
  hint:       string;
  url:        string | null;
  onUploaded: (url: string) => void;
  onRemoved:  () => void;
  t:          T;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const bg = mode === 'dark'
    ? 'bg-slate-800 border-slate-700'
    : 'bg-slate-100 border-slate-200';

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError(t.errUpload); return; }
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('mode', mode);
      const res = await fetch('/api/admin/content/logo', { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onUploaded(data.url);
    } catch { setError(t.errUpload); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDelete() {
    setDeleting(true); setError(null);
    try {
      const res = await fetch('/api/admin/content/logo', {
<<<<<<< HEAD
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mode }),
=======
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
>>>>>>> origin/main
      });
      if (!res.ok) throw new Error();
      onRemoved();
    } catch { setError(t.errDelete); }
    finally { setDeleting(false); }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <p className={LABEL}>{label}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1 mb-2">{hint}</p>
      </div>

      {/* Preview area */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${bg} min-h-[64px]`}>
        {url ? (
          <>
            <div className="relative h-8 flex-1 min-w-0">
              <Image src={url} alt={label} fill className="object-contain object-left" unoptimized />
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
            >
              {deleting ? <RefreshCw size={11} className="animate-spin" /> : <Trash2 size={11} strokeWidth={2.5} />}
              {deleting ? t.deleting : t.removeLogo}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <ImageIcon size={16} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.noLogo}</p>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/svg+xml,image/webp,image/jpeg"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} strokeWidth={2.5} />}
          {uploading ? t.uploading : t.uploadLogo}
        </button>
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    </div>
  );
}

/* ─── LogoSection ────────────────────────────────────── */
function LogoSection({ t }: { t: T }) {
  const [darkUrl,  setDarkUrl]  = useState<string | null>(null);
  const [lightUrl, setLightUrl] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch('/api/admin/content/logo')
      .then(r => r.json())
      .then(d => { setDarkUrl(d.dark ?? null); setLightUrl(d.light ?? null); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-16 flex items-center">
        <RefreshCw size={16} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.logoDesc}</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">{t.uploadHint}</p>
<<<<<<< HEAD
=======

>>>>>>> origin/main
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LogoSlot
          mode="dark"
          label={t.logoDark}
          hint={t.logoDarkHint}
          url={darkUrl}
          onUploaded={url => setDarkUrl(url)}
          onRemoved={() => setDarkUrl(null)}
          t={t}
        />
        <LogoSlot
          mode="light"
          label={t.logoLight}
          hint={t.logoLightHint}
          url={lightUrl}
          onUploaded={url => setLightUrl(url)}
          onRemoved={() => setLightUrl(null)}
          t={t}
        />
      </div>
    </div>
  );
}

/* ─── FaviconSection ─────────────────────────────────── */
function FaviconSection({ t }: { t: T }) {
  const [url,       setUrl]       = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/content/favicon')
      .then(r => r.json())
      .then(d => setUrl(d.url ?? null))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/content/favicon', { method: 'POST', body: form });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'failed');
      }
      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error && err.message !== 'failed' ? err.message : t.errUpload);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDelete() {
    setDeleting(true); setError(null);
    try {
      const res = await fetch('/api/admin/content/favicon', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setUrl(null);
    } catch { setError(t.errDelete); }
    finally { setDeleting(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.faviconDesc}</p>

      {/* Preview */}
      <div>
        <p className={LABEL}>{t.currentFavicon}</p>
        {loading ? (
          <div className="h-14 flex items-center">
            <RefreshCw size={16} className="text-blue-600 animate-spin" />
          </div>
        ) : url ? (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            {/* Browser-tab mockup */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm text-xs text-slate-600 dark:text-slate-300 font-medium">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="favicon" className="w-4 h-4 object-contain" />
              <span>BetaVolt</span>
              <span className="text-slate-400 dark:text-slate-500">×</span>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
            >
              {deleting ? <RefreshCw size={11} className="animate-spin" /> : <Trash2 size={11} strokeWidth={2.5} />}
              {deleting ? t.deleting : t.removeFavicon}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600">
            <ImageIcon size={18} className="text-slate-400 shrink-0" />
            <p className="text-sm text-slate-400 dark:text-slate-500">{t.noFavicon}</p>
          </div>
        )}
      </div>

      {/* Upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/webp,image/jpeg"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} strokeWidth={2.5} />}
          {uploading ? t.uploading : t.uploadFavicon}
        </button>
        <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">{t.faviconHint}</p>
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    </div>
  );
}

/* ─── BiField ────────────────────────────────────────── */
function BiField({ label, valueEn, valueAr, onEn, onAr, placeholderEn = '', placeholderAr = '', t }: {
  label: string; valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  placeholderEn?: string; placeholderAr?: string; t: T;
}) {
  return (
    <div className="space-y-2">
      <p className={LABEL}>{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagEn}</span>{t.colEn}
          </span>
          <input className={INPUT} value={valueEn} onChange={e => onEn(e.target.value)} dir="ltr" placeholder={placeholderEn} />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagAr}</span>{t.colAr}
          </span>
          <input className={INPUT} value={valueAr} onChange={e => onAr(e.target.value)} dir="rtl" placeholder={placeholderAr} />
        </div>
      </div>
    </div>
  );
}

/* ─── SectionCard ────────────────────────────────────── */
function SectionCard({ title, badge, children, defaultOpen = false }: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-start hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
        {badge && (
          <span className="shrink-0 w-6 h-6 rounded-md bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">{badge}</span>
        )}
        <span className="flex-1 font-bold text-slate-900 dark:text-white text-sm">{title}</span>
        <ChevronDown size={15} strokeWidth={2.5}
          className={['shrink-0 text-slate-400 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── NavPreview ─────────────────────────────────────── */
function NavPreview({ links, t }: { links: { label: string }[]; t: T }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">{t.navPreview}</p>
      <div className="flex items-center gap-1 flex-wrap" dir="ltr">
        {links.map((l, i) => (
          <span key={i} className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            {l.label || <span className="italic text-slate-400">empty</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function HeaderContentPage() {
  const { lang } = useAdminLang();
  const t = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [navEn, setNavEn] = useState<Record<string, string>>({});
  const [navAr, setNavAr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/header')
      .then(r => r.json())
      .then(d => {
        setNavEn(d.nav?.en ?? {});
        setNavAr(d.nav?.ar ?? {});
      })
      .finally(() => setLoading(false));
  }, []);

  const en    = (k: string) => navEn[k] ?? '';
  const ar    = (k: string) => navAr[k] ?? '';
  const setEn = (k: string, v: string) => setNavEn(p => ({ ...p, [k]: v }));
  const setAr = (k: string, v: string) => setNavAr(p => ({ ...p, [k]: v }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/header', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nav: { en: navEn, ar: navAr } }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مرة أخرى.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [navEn, navAr, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw size={20} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { label: en('services') },
    { label: en('projects') },
    { label: en('about')    },
    { label: en('contact')  },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      <NavPreview links={navLinks} t={t} />

      {/* Logo */}
      <SectionCard title={t.sectionLogo} badge="⚡" defaultOpen>
        <LogoSection t={t} />
      </SectionCard>

<<<<<<< HEAD
      {/* Favicon */}
      <SectionCard title={t.sectionFavicon} badge="🔖" defaultOpen>
        <FaviconSection t={t} />
      </SectionCard>

=======
>>>>>>> origin/main
      {/* A — Navigation Links */}
      <SectionCard title={t.sectionA} badge="A" defaultOpen>
        <BiField t={t} label={t.services}
          valueEn={en('services')} valueAr={ar('services')}
          onEn={v => setEn('services', v)} onAr={v => setAr('services', v)}
          placeholderEn="Services" placeholderAr="الخدمات" />
        <BiField t={t} label={t.projects}
          valueEn={en('projects')} valueAr={ar('projects')}
          onEn={v => setEn('projects', v)} onAr={v => setAr('projects', v)}
          placeholderEn="Projects" placeholderAr="المشاريع" />
        <BiField t={t} label={t.aboutUs}
          valueEn={en('about')} valueAr={ar('about')}
          onEn={v => setEn('about', v)} onAr={v => setAr('about', v)}
          placeholderEn="About Us" placeholderAr="من نحن" />
        <BiField t={t} label={t.contact}
          valueEn={en('contact')} valueAr={ar('contact')}
          onEn={v => setEn('contact', v)} onAr={v => setAr('contact', v)}
          placeholderEn="Contact" placeholderAr="تواصل معنا" />
      </SectionCard>

      {/* B — CTA Button */}
      <SectionCard title={t.sectionB} badge="B" defaultOpen>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.ctaDesc}</p>
        <BiField t={t} label={t.btnLabel}
          valueEn={en('cta')} valueAr={ar('cta')}
          onEn={v => setEn('cta', v)} onAr={v => setAr('cta', v)}
          placeholderEn="Get a Quote" placeholderAr="اطلب عرض سعر" />

        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" dir="ltr">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{t.preview}</p>
          <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold">
            {en('cta') || 'Get a Quote'}
          </span>
          <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold" dir="rtl">
            {ar('cta') || 'اطلب عرض سعر'}
          </span>
        </div>
      </SectionCard>

      {/* Floating save bar */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 flex justify-end pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">
              {saving ? t.saving : saved ? t.saved : t.saveHint}
            </span>
            <button type="button" onClick={handleSave} disabled={saving}
              className={['inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm disabled:opacity-60 select-none whitespace-nowrap',
                saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'].join(' ')}>
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} strokeWidth={2} />}
              {saving ? t.saving : saved ? t.saved : t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
