'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Inbox, Search, X, Trash2, CheckCheck, MailOpen,
  RefreshCw, Building2, Phone, Tag, Mail,
  MessageSquare, Calendar, Clock,
} from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Types ────────────────────────────────────────────── */
type Status = 'new' | 'read' | 'replied';
type Lang   = 'en' | 'ar';

interface Inquiry {
  id:         string;
  created_at: string;
  full_name:  string;
  email:      string;
  company?:   string | null;
  phone?:     string | null;
  subject:    string;
  message:    string;
  status:     Status;
  source:     string;
}

/* ─── Bilingual labels ─────────────────────────────────── */
const L = {
  en: {
    title: 'Inquiries',
    subtitle: 'Incoming messages from the contact form.',
    search: 'Search name or email…',
    filter_all: 'All', filter_new: 'New', filter_read: 'Read', filter_replied: 'Replied',
    col_name: 'Name', col_subject: 'Subject', col_date: 'Date', col_status: 'Status',
    lbl_email: 'Email', lbl_company: 'Company', lbl_phone: 'Phone',
    lbl_message: 'Message', lbl_source: 'Source', lbl_date: 'Received',
    source_contact: 'Contact Form',
    btn_markRead: 'Mark as Read', btn_markReplied: 'Mark as Replied',
    btn_delete: 'Delete', btn_refresh: 'Refresh', btn_close: 'Close',
    empty_title: 'Inbox is empty',
    empty_desc: 'New messages from the contact form will appear here.',
    delete_confirm: 'Delete this inquiry? This action cannot be undone.',
    err_load: 'Failed to load inquiries. Check your Supabase connection.',
  },
  ar: {
    title: 'الاستفسارات',
    subtitle: 'الرسائل الواردة من نموذج التواصل.',
    search: 'البحث بالاسم أو البريد…',
    filter_all: 'الكل', filter_new: 'جديد', filter_read: 'مقروء', filter_replied: 'تم الرد',
    col_name: 'الاسم', col_subject: 'الموضوع', col_date: 'التاريخ', col_status: 'الحالة',
    lbl_email: 'البريد الإلكتروني', lbl_company: 'الشركة', lbl_phone: 'الهاتف',
    lbl_message: 'الرسالة', lbl_source: 'المصدر', lbl_date: 'تاريخ الاستلام',
    source_contact: 'نموذج التواصل',
    btn_markRead: 'تعيين كمقروء', btn_markReplied: 'تعيين كمُجاب',
    btn_delete: 'حذف', btn_refresh: 'تحديث', btn_close: 'إغلاق',
    empty_title: 'صندوق الوارد فارغ',
    empty_desc: 'ستظهر الرسائل الجديدة من نموذج التواصل هنا.',
    delete_confirm: 'حذف هذا الاستفسار؟ لا يمكن التراجع عن هذا الإجراء.',
    err_load: 'فشل تحميل الاستفسارات. تحقق من اتصال Supabase.',
  },
} as const;

/* ─── Status config ────────────────────────────────────── */
const STATUS_CFG: Record<Status, { en: string; ar: string; cls: string; dot: string }> = {
  new: {
    en: 'New', ar: 'جديد',
    cls: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50',
    dot: 'bg-blue-500',
  },
  read: {
    en: 'Read', ar: 'مقروء',
    cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  replied: {
    en: 'Replied', ar: 'تم الرد',
    cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50',
    dot: 'bg-emerald-500',
  },
};

/* ─── Subject translation map ──────────────────────────── */
const SUBJECT_MAP: Record<string, { en: string; ar: string }> = {
  'infrastructure':   { en: 'Infrastructure',               ar: 'البنية التحتية'                  },
  'data-centers':     { en: 'Data Centers',                 ar: 'مراكز البيانات'                  },
  'low-current':      { en: 'Low Current & Smart Systems',  ar: 'التيار الخفيف والأنظمة الذكية'   },
  'power-electrical': { en: 'Power & Electrical',           ar: 'القوى والكهرباء'                 },
  'bms':              { en: 'Smart Building (BMS)',          ar: 'المباني الذكية (BMS)'            },
  'automation':       { en: 'Industrial Automation',        ar: 'الأتمتة الصناعية'                },
};

function translateSubject(raw: string, lang: Lang): string {
  return SUBJECT_MAP[raw]?.[lang] ?? raw;
}

/* ─── Helpers ──────────────────────────────────────────── */
function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function timeAgo(iso: string, lang: Lang): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hrs   = Math.floor(mins / 60);
  const days  = Math.floor(hrs / 24);
  if (lang === 'ar') {
    if (mins < 1)   return 'الآن';
    if (mins < 60)  return `منذ ${mins} د`;
    if (hrs  < 24)  return `منذ ${hrs} س`;
    if (days < 30)  return `منذ ${days} يوم`;
    return formatDate(iso, lang);
  }
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  if (days < 30)  return `${days}d ago`;
  return formatDate(iso, lang);
}

function Avatar({ name }: { name: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="w-9 h-9 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-black shrink-0 select-none border border-blue-100 dark:border-blue-900/40">
      {initials}
    </div>
  );
}

function StatusBadge({ status, lang }: { status: Status; lang: Lang }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold leading-none shrink-0 ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {lang === 'ar' ? cfg.ar : cfg.en}
    </span>
  );
}

/* ─── Skeleton row ─────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-36 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-2.5 w-48 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse hidden sm:block" />
      <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse hidden md:block" />
      <div className="h-5 w-14 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function InquiriesPage() {
  const { lang } = useAdminLang();
  const [inquiries,  setInquiries]  = useState<Inquiry[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [hasError,   setHasError]   = useState(false);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState<Status | 'all'>('all');
  const [selected,   setSelected]   = useState<Inquiry | null>(null);
  const [actionLoad, setActionLoad] = useState(false);

  const t   = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  /* Keep last-selected so panel content stays visible during slide-out animation */
  const lastSelected = useRef<Inquiry | null>(null);
  if (selected) lastSelected.current = selected;
  const panelContent = selected ?? lastSelected.current;

  /* ── Load ── */
  const load = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setInquiries(json.inquiries ?? []);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => inquiries.filter(inq => {
    if (filter !== 'all' && inq.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return inq.full_name.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q);
    }
    return true;
  }), [inquiries, filter, search]);

  /* ── Counts ── */
  const counts = useMemo(() => ({
    all:     inquiries.length,
    new:     inquiries.filter(i => i.status === 'new').length,
    read:    inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
  }), [inquiries]);

  /* ── Actions ── */
  const updateStatus = useCallback(async (id: string, status: Status) => {
    setActionLoad(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
      }
    } finally {
      setActionLoad(false);
    }
  }, []);

  const deleteInquiry = useCallback(async (id: string) => {
    if (!confirm(t.delete_confirm)) return;
    setActionLoad(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        setSelected(prev => prev?.id === id ? null : prev);
      }
    } finally {
      setActionLoad(false);
    }
  }, [t.delete_confirm]);

  const openDetail = useCallback((inq: Inquiry) => {
    setSelected(inq);
    if (inq.status === 'new') updateStatus(inq.id, 'read');
  }, [updateStatus]);

  /* ── Filter tabs config ── */
  const FILTERS = [
    { key: 'all'     as const, label: t.filter_all,     count: counts.all     },
    { key: 'new'     as const, label: t.filter_new,     count: counts.new     },
    { key: 'read'    as const, label: t.filter_read,    count: counts.read    },
    { key: 'replied' as const, label: t.filter_replied, count: counts.replied },
  ];

  /* ── Responsive table grid ── */
  const TABLE_GRID_OPEN   = 'grid-cols-[minmax(0,1fr)_auto]';
  const TABLE_GRID_CLOSED = 'grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]';
  const TABLE_GRID = selected ? TABLE_GRID_OPEN : TABLE_GRID_CLOSED;

  /* ── Detail meta items ── */
  const metaItems = panelContent ? [
    { icon: Mail,      label: t.lbl_email,   value: panelContent.email           },
    panelContent.company  ? { icon: Building2, label: t.lbl_company, value: panelContent.company } : null,
    panelContent.phone    ? { icon: Phone,     label: t.lbl_phone,   value: panelContent.phone   } : null,
    { icon: Tag,       label: t.lbl_source,  value: t.source_contact         },
    { icon: Calendar,  label: t.lbl_date,    value: formatDate(panelContent.created_at, lang) },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir={dir}>

      {/* ── Sticky header ─────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={load}
              disabled={loading}
              title={t.btn_refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} strokeWidth={2.5} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t.btn_refresh}</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full ps-9 pe-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto">
            {FILTERS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all duration-150',
                  filter === key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                ].join(' ')}
              >
                {label}
                {count > 0 && (
                  <span className={[
                    'text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center',
                    filter === key && key === 'new'
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
                      : 'bg-slate-200 dark:bg-slate-600/60 text-slate-500 dark:text-slate-400',
                  ].join(' ')}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="p-4 sm:p-6">

        {/* Error */}
        {hasError && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm mb-4">
            <Mail size={16} className="shrink-0" />
            {t.err_load}
          </div>
        )}

        {/* Table card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">

          {/* Table head */}
          {!loading && filtered.length > 0 && (
            <div className={`grid gap-3 sm:gap-4 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 text-[11px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 ${TABLE_GRID}`}>
              <div className="flex items-center justify-start">{t.col_name}</div>
              {!selected && <div className="hidden sm:flex items-center justify-start">{t.col_subject}</div>}
              {!selected && <div className="hidden md:flex items-center justify-start">{t.col_date}</div>}
              <div className="flex items-center justify-start">{t.col_status}</div>
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-5">
                <Inbox size={34} strokeWidth={1.25} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{t.empty_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px]">{t.empty_desc}</p>
            </div>
          )}

          {/* Rows */}
          {!loading && filtered.length > 0 && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(inq => (
                <button
                  key={inq.id}
                  onClick={() => openDetail(inq)}
                  className={[
                    'w-full grid gap-3 sm:gap-4 items-center px-4 sm:px-5 py-4 text-start transition-colors duration-150',
                    'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                    selected?.id === inq.id
                      ? 'bg-blue-50/60 dark:bg-blue-950/20 border-s-[3px] border-blue-500'
                      : inq.status === 'new'
                        ? 'border-s-[3px] border-blue-300 dark:border-blue-700'
                        : 'border-s-[3px] border-transparent',
                    TABLE_GRID,
                  ].join(' ')}
                >
                  {/* Col 1: Avatar + Name + Email */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={inq.full_name} />
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${inq.status === 'new' ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {inq.full_name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{inq.email}</p>
                    </div>
                  </div>

                  {/* Col 2: Subject (hidden when panel open) */}
                  {!selected && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate hidden sm:block text-start">
                      {translateSubject(inq.subject, lang)}
                    </p>
                  )}

                  {/* Col 3: Date (hidden when panel open) */}
                  {!selected && (
                    <div className="hidden md:flex items-center justify-start gap-1.5 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      <Clock size={11} strokeWidth={2} className="shrink-0" />
                      {formatDate(inq.created_at, lang)}
                    </div>
                  )}

                  {/* Col 4: Status */}
                  <div className="flex justify-start">
                    <StatusBadge status={inq.status} lang={lang} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Backdrop (mobile) ──────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSelected(null)}
          aria-hidden="true"
        />
      )}

      {/* ── Detail slide-over ──────────────────────────────── */}
      <aside
        className={[
          'fixed top-16 bottom-0 right-0 z-40',
          'w-full sm:w-[420px]',
          'bg-white dark:bg-slate-900',
          'border-l border-slate-200 dark:border-slate-800',
          'shadow-[−8px_0_32px_rgba(0,0,0,0.08)] dark:shadow-[−8px_0_32px_rgba(0,0,0,0.4)]',
          'flex flex-col transition-transform duration-300 ease-in-out',
          selected ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        dir={dir}
      >
        {panelContent && (
          <>
            {/* Panel header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/80 dark:bg-slate-800/30">
              <Avatar name={panelContent.full_name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{panelContent.full_name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{panelContent.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={panelContent.status} lang={lang} />
                <button
                  onClick={() => setSelected(null)}
                  aria-label={t.btn_close}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-150"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Panel body — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

              {/* Meta info grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {metaItems.map(({ icon: Icon, label, value }, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <Icon size={14} strokeWidth={1.75} className="shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 break-all leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <Tag size={10} strokeWidth={2.5} />
                  {t.col_subject}
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{translateSubject(panelContent.subject, lang)}</p>
              </div>

              {/* Message */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 flex-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <MessageSquare size={10} strokeWidth={2.5} />
                  {t.lbl_message}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{panelContent.message}</p>
              </div>
            </div>

            {/* Panel footer — actions */}
            <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              {panelContent.status === 'new' && (
                <button
                  onClick={() => updateStatus(panelContent.id, 'read')}
                  disabled={actionLoad}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 disabled:opacity-50"
                >
                  <MailOpen size={15} strokeWidth={2} />
                  {t.btn_markRead}
                </button>
              )}
              {panelContent.status !== 'replied' && (
                <button
                  onClick={() => updateStatus(panelContent.id, 'replied')}
                  disabled={actionLoad}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold transition-colors duration-150 disabled:opacity-50 shadow-sm"
                >
                  <CheckCheck size={15} strokeWidth={2.5} />
                  {t.btn_markReplied}
                </button>
              )}
              <button
                onClick={() => deleteInquiry(panelContent.id)}
                disabled={actionLoad}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-sm font-bold transition-colors duration-150 disabled:opacity-50"
              >
                <Trash2 size={15} strokeWidth={2} />
                {t.btn_delete}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
