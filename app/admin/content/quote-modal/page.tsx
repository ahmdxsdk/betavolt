'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Types ──────────────────────────────────────────── */
interface ModalOption { en: string; ar: string; }

/* ─── Bilingual labels ───────────────────────────────── */
const L = {
  en: {
    pageTitle:        'Quote Modal Content',
    pageDesc:         'Edit all bilingual text inside the "Request a Quote" popup modal.',
    sectionA:         'A — Modal Header',
    sectionB:         'B — Form Field Labels',
    sectionC:         'C — Project Type Options',
    sectionD:         'D — Timeline Options',
    sectionE:         'E — Button & Status Messages',
    title:            'Title',
    subtitle:         'Subtitle',
    contactPerson:    'Contact Person Field',
    companyName:      'Company Name Field',
    divProjectType:   'Project Type Dropdown',
    dropdownLabel:    'Dropdown Label',
    dropdownPH:       'Dropdown Placeholder',
    divTimeline:      'Timeline Dropdown',
    divUpload:        'File Upload',
    uploadLabel:      'Upload Section Label',
    uploadCta:        'Upload CTA Text',
    uploadHint:       'Upload Hint',
    divRequirements:  'Requirements Textarea',
    textareaLabel:    'Textarea Label',
    textareaPH:       'Textarea Placeholder',
    projectTypeDesc:  'These options appear in the Project Type dropdown inside the quote modal.',
    timelineDesc:     'These options appear in the Estimated Timeline dropdown inside the quote modal.',
    addOption:        'Add Option',
    submitBtn:        'Submit Button',
    submitting:       'Submitting (Loading) State',
    divSuccess:       'Success State',
    successTitle:     'Success Title',
    successBody:      'Success Body',
    closeBtn:         'Close Button',
    divError:         'Error State',
    errorMsg:         'Error Message',
    optionEn:         'Option in English',
    optionAr:         'الخيار بالعربية',
    flagEn:           '🇬🇧', flagAr: '🇸🇦', colEn: 'English', colAr: 'Arabic',
    save:             'Save Changes', saving: 'Saving…', saved: '✓ Saved!',
    saveHint:         'Saves all modal translations to the EN/AR message files.',
  },
  ar: {
    pageTitle:        'محتوى نموذج طلب العرض',
    pageDesc:         'تعديل جميع النصوص ثنائية اللغة داخل نافذة "طلب عرض سعر".',
    sectionA:         'أ — رأس النافذة',
    sectionB:         'ب — تسميات حقول النموذج',
    sectionC:         'ج — خيارات نوع المشروع',
    sectionD:         'د — خيارات الجدول الزمني',
    sectionE:         'هـ — الأزرار ورسائل الحالة',
    title:            'العنوان',
    subtitle:         'العنوان الفرعي',
    contactPerson:    'حقل الشخص المسؤول',
    companyName:      'حقل اسم الشركة',
    divProjectType:   'قائمة نوع المشروع',
    dropdownLabel:    'تسمية القائمة',
    dropdownPH:       'نص التلميح في القائمة',
    divTimeline:      'قائمة الجدول الزمني',
    divUpload:        'رفع الملفات',
    uploadLabel:      'تسمية قسم الرفع',
    uploadCta:        'نص زر الرفع',
    uploadHint:       'تلميح الرفع',
    divRequirements:  'حقل المتطلبات',
    textareaLabel:    'تسمية حقل النص',
    textareaPH:       'نص التلميح في حقل النص',
    projectTypeDesc:  'تظهر هذه الخيارات في قائمة نوع المشروع داخل نافذة طلب العرض.',
    timelineDesc:     'تظهر هذه الخيارات في قائمة الجدول الزمني داخل نافذة طلب العرض.',
    addOption:        'إضافة خيار',
    submitBtn:        'زر الإرسال',
    submitting:       'حالة الإرسال (تحميل)',
    divSuccess:       'حالة النجاح',
    successTitle:     'عنوان النجاح',
    successBody:      'نص النجاح',
    closeBtn:         'زر الإغلاق',
    divError:         'حالة الخطأ',
    errorMsg:         'رسالة الخطأ',
    optionEn:         'Option in English',
    optionAr:         'الخيار بالعربية',
    flagEn:           '🇬🇧', flagAr: '🇸🇦', colEn: 'الإنجليزية', colAr: 'العربية',
    save:             'حفظ التغييرات', saving: 'جارٍ الحفظ…', saved: '✓ تم الحفظ!',
    saveHint:         'يتم حفظ جميع ترجمات النافذة في ملفات الرسائل EN/AR.',
  },
};

type T = typeof L['en'];

/* ─── Style tokens ───────────────────────────────────── */
const LABEL    = 'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const INPUT    = 'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';
const TEXTAREA = INPUT + ' resize-none leading-relaxed';

/* ─── BiField ────────────────────────────────────────── */
function BiField({ label, valueEn, valueAr, onEn, onAr, rows = 1, placeholderEn = '', placeholderAr = '', t }: {
  label: string; valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  rows?: number; placeholderEn?: string; placeholderAr?: string; t: T;
}) {
  return (
    <div className="space-y-2">
      <p className={LABEL}>{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagEn}</span>{t.colEn}
          </span>
          {rows > 1
            ? <textarea className={TEXTAREA} value={valueEn} onChange={e => onEn(e.target.value)} rows={rows} dir="ltr" placeholder={placeholderEn} />
            : <input    className={INPUT}    value={valueEn} onChange={e => onEn(e.target.value)} dir="ltr"  placeholder={placeholderEn} />}
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagAr}</span>{t.colAr}
          </span>
          {rows > 1
            ? <textarea className={TEXTAREA} value={valueAr} onChange={e => onAr(e.target.value)} rows={rows} dir="rtl" placeholder={placeholderAr} />
            : <input    className={INPUT}    value={valueAr} onChange={e => onAr(e.target.value)} dir="rtl"  placeholder={placeholderAr} />}
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

function FieldDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

/* ─── OptionList ─────────────────────────────────────── */
function OptionList({ options, onAdd, onRemove, onSetEn, onSetAr, t }: {
  options: ModalOption[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onSetEn: (i: number, v: string) => void;
  onSetAr: (i: number, v: string) => void;
  t: T;
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 w-5 text-center shrink-0">{i + 1}</span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <span>{t.flagEn}</span>{t.colEn}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <span>{t.flagAr}</span>{t.colAr}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
                  <input className={INPUT} value={opt.en} onChange={e => onSetEn(i, e.target.value)}
                    dir="ltr" placeholder={t.optionEn} />
                  <input className={INPUT} value={opt.ar} onChange={e => onSetAr(i, e.target.value)}
                    dir="rtl" placeholder={t.optionAr} />
                </div>
              </div>
            </div>
            <button type="button" onClick={() => onRemove(i)}
              className="mt-6 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800/50 transition-all duration-150">
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 text-sm font-semibold transition-all duration-150 w-full justify-center">
        <Plus size={15} strokeWidth={2.5} />
        {t.addOption}
      </button>
    </>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function QuoteModalContentPage() {
  const { lang } = useAdminLang();
  const t = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [modalEn,      setModalEn]      = useState<Record<string, string>>({});
  const [modalAr,      setModalAr]      = useState<Record<string, string>>({});
  const [projectTypes, setProjectTypes] = useState<ModalOption[]>([]);
  const [timelines,    setTimelines]    = useState<ModalOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/quote-modal')
      .then(r => r.json())
      .then(d => {
        setModalEn(d.modal?.en ?? {});
        setModalAr(d.modal?.ar ?? {});
        setProjectTypes(d.options?.projectTypes ?? []);
        setTimelines(d.options?.timelines ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const en    = (k: string) => modalEn[k] ?? '';
  const ar    = (k: string) => modalAr[k] ?? '';
  const setEn = (k: string, v: string) => setModalEn(p => ({ ...p, [k]: v }));
  const setAr = (k: string, v: string) => setModalAr(p => ({ ...p, [k]: v }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/quote-modal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ modal: { en: modalEn, ar: modalAr }, options: { projectTypes, timelines } }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مرة أخرى.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [modalEn, modalAr, projectTypes, timelines, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw size={20} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      {/* A — Modal Header */}
      <SectionCard title={t.sectionA} badge="A" defaultOpen>
        <BiField t={t} label={t.title}
          valueEn={en('title')} valueAr={ar('title')}
          onEn={v => setEn('title', v)} onAr={v => setAr('title', v)}
          placeholderEn="Request a Technical Proposal" placeholderAr="طلب عرض سعر فني" />
        <BiField t={t} label={t.subtitle} rows={2}
          valueEn={en('subtitle')} valueAr={ar('subtitle')}
          onEn={v => setEn('subtitle', v)} onAr={v => setAr('subtitle', v)}
          placeholderEn="Provide your project details…" placeholderAr="قدّم تفاصيل مشروعك…" />
      </SectionCard>

      {/* B — Form Field Labels */}
      <SectionCard title={t.sectionB} badge="B" defaultOpen>
        <BiField t={t} label={t.contactPerson}
          valueEn={en('field_name')} valueAr={ar('field_name')}
          onEn={v => setEn('field_name', v)} onAr={v => setAr('field_name', v)}
          placeholderEn="Contact Person" placeholderAr="الشخص المسؤول" />
        <BiField t={t} label={t.companyName}
          valueEn={en('field_company')} valueAr={ar('field_company')}
          onEn={v => setEn('field_company', v)} onAr={v => setAr('field_company', v)}
          placeholderEn="Company Name" placeholderAr="اسم الشركة" />

        <FieldDivider label={t.divProjectType} />
        <BiField t={t} label={t.dropdownLabel}
          valueEn={en('field_project_type')} valueAr={ar('field_project_type')}
          onEn={v => setEn('field_project_type', v)} onAr={v => setAr('field_project_type', v)}
          placeholderEn="Project Type" placeholderAr="نوع المشروع" />
        <BiField t={t} label={t.dropdownPH}
          valueEn={en('field_project_placeholder')} valueAr={ar('field_project_placeholder')}
          onEn={v => setEn('field_project_placeholder', v)} onAr={v => setAr('field_project_placeholder', v)}
          placeholderEn="Select project type" placeholderAr="اختر نوع المشروع" />

        <FieldDivider label={t.divTimeline} />
        <BiField t={t} label={t.dropdownLabel}
          valueEn={en('field_timeline')} valueAr={ar('field_timeline')}
          onEn={v => setEn('field_timeline', v)} onAr={v => setAr('field_timeline', v)}
          placeholderEn="Estimated Timeline" placeholderAr="الجدول الزمني المتوقع" />
        <BiField t={t} label={t.dropdownPH}
          valueEn={en('field_timeline_placeholder')} valueAr={ar('field_timeline_placeholder')}
          onEn={v => setEn('field_timeline_placeholder', v)} onAr={v => setAr('field_timeline_placeholder', v)}
          placeholderEn="Select timeline" placeholderAr="اختر الجدول الزمني" />

        <FieldDivider label={t.divUpload} />
        <BiField t={t} label={t.uploadLabel}
          valueEn={en('field_upload')} valueAr={ar('field_upload')}
          onEn={v => setEn('field_upload', v)} onAr={v => setAr('field_upload', v)}
          placeholderEn="Project Specifications / BoQ" placeholderAr="مواصفات المشروع / جداول الكميات" />
        <BiField t={t} label={t.uploadCta}
          valueEn={en('field_upload_cta')} valueAr={ar('field_upload_cta')}
          onEn={v => setEn('field_upload_cta', v)} onAr={v => setAr('field_upload_cta', v)}
          placeholderEn="Click to upload or drag & drop" placeholderAr="انقر للرفع أو اسحب وأفلت" />
        <BiField t={t} label={t.uploadHint}
          valueEn={en('field_upload_hint')} valueAr={ar('field_upload_hint')}
          onEn={v => setEn('field_upload_hint', v)} onAr={v => setAr('field_upload_hint', v)}
          placeholderEn="PDF, JPG, PNG — max 10 MB each" placeholderAr="PDF, JPG, PNG — حجم أقصى 10 ميغابايت" />

        <FieldDivider label={t.divRequirements} />
        <BiField t={t} label={t.textareaLabel}
          valueEn={en('field_requirements')} valueAr={ar('field_requirements')}
          onEn={v => setEn('field_requirements', v)} onAr={v => setAr('field_requirements', v)}
          placeholderEn="Detailed Requirements" placeholderAr="المتطلبات التفصيلية" />
        <BiField t={t} label={t.textareaPH} rows={2}
          valueEn={en('field_requirements_placeholder')} valueAr={ar('field_requirements_placeholder')}
          onEn={v => setEn('field_requirements_placeholder', v)} onAr={v => setAr('field_requirements_placeholder', v)}
          placeholderEn="Describe your project scope…" placeholderAr="صف نطاق مشروعك…" />
      </SectionCard>

      {/* C — Project Type Options */}
      <SectionCard title={t.sectionC} badge="C">
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.projectTypeDesc}</p>
        <OptionList
          options={projectTypes} t={t}
          onAdd={() => setProjectTypes(p => [...p, { en: '', ar: '' }])}
          onRemove={i => setProjectTypes(p => p.filter((_, idx) => idx !== i))}
          onSetEn={(i, v) => setProjectTypes(p => p.map((o, idx) => idx === i ? { ...o, en: v } : o))}
          onSetAr={(i, v) => setProjectTypes(p => p.map((o, idx) => idx === i ? { ...o, ar: v } : o))}
        />
      </SectionCard>

      {/* D — Timeline Options */}
      <SectionCard title={t.sectionD} badge="D">
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">{t.timelineDesc}</p>
        <OptionList
          options={timelines} t={t}
          onAdd={() => setTimelines(p => [...p, { en: '', ar: '' }])}
          onRemove={i => setTimelines(p => p.filter((_, idx) => idx !== i))}
          onSetEn={(i, v) => setTimelines(p => p.map((o, idx) => idx === i ? { ...o, en: v } : o))}
          onSetAr={(i, v) => setTimelines(p => p.map((o, idx) => idx === i ? { ...o, ar: v } : o))}
        />
      </SectionCard>

      {/* E — Button & Status Messages */}
      <SectionCard title={t.sectionE} badge="E">
        <BiField t={t} label={t.submitBtn}
          valueEn={en('submit')} valueAr={ar('submit')}
          onEn={v => setEn('submit', v)} onAr={v => setAr('submit', v)}
          placeholderEn="Submit Quote Request" placeholderAr="إرسال طلب التسعير" />
        <BiField t={t} label={t.submitting}
          valueEn={en('submitting')} valueAr={ar('submitting')}
          onEn={v => setEn('submitting', v)} onAr={v => setAr('submitting', v)}
          placeholderEn="Submitting…" placeholderAr="جارٍ الإرسال…" />

        <FieldDivider label={t.divSuccess} />
        <BiField t={t} label={t.successTitle}
          valueEn={en('success_title')} valueAr={ar('success_title')}
          onEn={v => setEn('success_title', v)} onAr={v => setAr('success_title', v)}
          placeholderEn="Request Submitted" placeholderAr="تم إرسال الطلب" />
        <BiField t={t} label={t.successBody} rows={2}
          valueEn={en('success_body')} valueAr={ar('success_body')}
          onEn={v => setEn('success_body', v)} onAr={v => setAr('success_body', v)}
          placeholderEn="Our engineering team will review your requirements…"
          placeholderAr="سيراجع فريقنا الهندسي متطلباتك…" />
        <BiField t={t} label={t.closeBtn}
          valueEn={en('success_close')} valueAr={ar('success_close')}
          onEn={v => setEn('success_close', v)} onAr={v => setAr('success_close', v)}
          placeholderEn="Close" placeholderAr="إغلاق" />

        <FieldDivider label={t.divError} />
        <BiField t={t} label={t.errorMsg} rows={2}
          valueEn={en('error')} valueAr={ar('error')}
          onEn={v => setEn('error', v)} onAr={v => setAr('error', v)}
          placeholderEn="Something went wrong. Please try again…"
          placeholderAr="حدث خطأ ما. يرجى المحاولة مرة أخرى…" />
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
