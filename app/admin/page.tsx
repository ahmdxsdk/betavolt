'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, Mail, Layers, FolderPlus, Inbox,
  LayoutDashboard, ArrowUpRight, CheckCheck, Clock, RefreshCw,
} from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';
import { useAdminRole } from '@/components/admin/AdminRoleProvider';

/* ─── Types ──────────────────────────────────────────────── */
type Status = 'new' | 'read' | 'replied';

interface Inquiry {
  id:         string;
  full_name:  string;
  email:      string;
  subject:    string;
  status:     Status;
  created_at: string;
}

interface DashboardData {
  stats: { totalProjects: number; newInquiries: number; totalServices: number };
  recentInquiries: Inquiry[];
}

/* ─── Bilingual labels ───────────────────────────────────── */
const L = {
  en: {
    welcome:       'Welcome to BetaVolt Command Center',
    welcomeSub:    "Here's a quick overview of your site's current status.",
    statProjects:  'Total Projects',
    statInquiries: 'New Inquiries',
    statServices:  'Active Services',
    quickTitle:    'Quick Actions',
    qa1Label:      'Add New Project',        qa1Sub: 'Publish a new portfolio item',
    qa2Label:      'View Inbox',             qa2Sub: 'Read incoming messages',
    qa3Label:      'Edit Home Page',         qa3Sub: 'Update hero & sections',
    recentTitle:   'Recent Inquiries',
    viewAll:       'View All',
    colName:       'Name',
    colSubject:    'Subject',
    colDate:       'Date',
    colStatus:     'Status',
    sNew:          'New',
    sRead:         'Read',
    sReplied:      'Replied',
    noInquiries:   'No inquiries yet.',
    errLoad:       'Failed to load data.',
  },
  ar: {
    welcome:       'مرحباً بك في لوحة تحكم بيتا فولت',
    welcomeSub:    'إليك نظرة سريعة على الحالة الراهنة لموقعك.',
    statProjects:  'إجمالي المشاريع',
    statInquiries: 'استفسارات جديدة',
    statServices:  'الخدمات المفعّلة',
    quickTitle:    'إجراءات سريعة',
    qa1Label:      'إضافة مشروع جديد',      qa1Sub: 'نشر عنصر جديد في المحفظة',
    qa2Label:      'صندوق الوارد',           qa2Sub: 'قراءة الرسائل الواردة',
    qa3Label:      'تعديل الصفحة الرئيسية', qa3Sub: 'تحديث قسم البطل والأقسام',
    recentTitle:   'أحدث الاستفسارات',
    viewAll:       'عرض الكل',
    colName:       'الاسم',
    colSubject:    'الموضوع',
    colDate:       'التاريخ',
    colStatus:     'الحالة',
    sNew:          'جديد',
    sRead:         'مقروء',
    sReplied:      'تم الرد',
    noInquiries:   'لا توجد استفسارات بعد.',
    errLoad:       'فشل تحميل البيانات.',
  },
};

/* ─── Subject translation map ────────────────────────────── */
const SUBJECT_MAP: Record<string, { en: string; ar: string }> = {
  'infrastructure':   { en: 'Infrastructure',              ar: 'البنية التحتية'                 },
  'data-centers':     { en: 'Data Centers',                ar: 'مراكز البيانات'                 },
  'low-current':      { en: 'Low Current & Smart Systems', ar: 'التيار الخفيف والأنظمة الذكية'  },
  'power-electrical': { en: 'Power & Electrical',          ar: 'القوى والكهرباء'                },
  'bms':              { en: 'Smart Building (BMS)',         ar: 'المباني الذكية (BMS)'           },
  'automation':       { en: 'Industrial Automation',       ar: 'الأتمتة الصناعية'               },
};

/* ─── Status config ──────────────────────────────────────── */
const STATUS_CFG: Record<Status, { cls: string; dot: string; key: 'sNew' | 'sRead' | 'sReplied' }> = {
  new:     { cls: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',                 dot: 'bg-blue-500',    key: 'sNew'     },
  read:    { cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',                dot: 'bg-slate-400',   key: 'sRead'    },
  replied: { cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50', dot: 'bg-emerald-500', key: 'sReplied' },
};

/* ─── Grid classes (shared between header row and data rows) */
const TABLE_GRID =
  'grid-cols-[minmax(0,1fr)_auto] ' +
  'sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] ' +
  'md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)_auto_auto]';

/* ─── Helpers ────────────────────────────────────────────── */
function formatDate(iso: string, lang: 'en' | 'ar') {
  return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/* ─── Sub-components ─────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, highlight = false, loading = false,
}: { icon: React.ElementType; label: string; value: number; highlight?: boolean; loading?: boolean }) {
  return (
    <div className={[
      'relative rounded-2xl border p-5 sm:p-6 shadow-sm overflow-hidden',
      highlight
        ? 'bg-blue-600 border-blue-500 text-white'
        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800',
    ].join(' ')}>
      <div className={[
        'absolute -end-4 -top-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-10',
        highlight ? 'bg-white' : 'bg-blue-500',
      ].join(' ')} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className={[
            'text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase mb-2 sm:mb-3',
            highlight ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400',
          ].join(' ')}>
            {label}
          </p>
          {loading ? (
            <div className={[
              'h-8 sm:h-10 w-14 sm:w-16 rounded-lg animate-pulse',
              highlight ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700',
            ].join(' ')} />
          ) : (
            <p className={[
              'text-3xl sm:text-4xl font-black leading-none',
              highlight ? 'text-white' : 'text-slate-900 dark:text-white',
            ].join(' ')}>
              {value}
            </p>
          )}
        </div>
        <div className={[
          'shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center',
          highlight
            ? 'bg-white/20'
            : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50',
        ].join(' ')}>
          <Icon size={20} strokeWidth={1.75} className={highlight ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, sub }: {
  href: string; icon: React.ElementType; label: string; sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 sm:px-5 py-3.5 sm:py-4 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200"
    >
      <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-200">
        <Icon size={19} strokeWidth={1.75} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-200" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{sub}</p>
      </div>
      <ArrowUpRight size={14} strokeWidth={2} className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors duration-200" />
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminOverviewPage() {
  const { lang } = useAdminLang();
  const role = useAdminRole();
  const t   = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const canContent   = role === 'super_admin' || role === 'content_manager';
  const canInquiries = role === 'super_admin' || role === 'sales';

  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats  = data?.stats;
  const recent = data?.recentInquiries ?? [];

  return (
    <div className="max-w-5xl mx-auto pb-10 flex flex-col gap-5 sm:gap-8" dir={dir}>

      {/* ── Welcome banner ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5">
          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <LayoutDashboard size={20} strokeWidth={2} className="text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {t.welcome}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t.welcomeSub}
            </p>
          </div>
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm">
          <Mail size={15} className="shrink-0" />
          <span className="flex-1">{t.errLoad}</span>
          <button
            onClick={load}
            className="shrink-0 flex items-center gap-1.5 font-bold underline text-xs"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* ── Statistics grid ───────────────────────────────────
           Mobile → 1 col · sm → 3 cols                       */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard icon={Briefcase} label={t.statProjects}  value={stats?.totalProjects  ?? 0} loading={loading} />
        <StatCard icon={Mail}      label={t.statInquiries} value={stats?.newInquiries   ?? 0} loading={loading} highlight />
        <StatCard icon={Layers}    label={t.statServices}  value={stats?.totalServices  ?? 0} loading={loading} />
      </div>

      {/* ── Quick actions ─────────────────────────────────────
           Mobile → 1 col · sm → 3 cols                       */}
      {(canContent || canInquiries) && (
        <section>
          <h3 className="text-[11px] font-black tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 mb-3 sm:mb-4">
            {t.quickTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {canContent   && <QuickAction href="/admin/content/projects" icon={FolderPlus}     label={t.qa1Label} sub={t.qa1Sub} />}
            {canInquiries && <QuickAction href="/admin/inquiries"        icon={Inbox}           label={t.qa2Label} sub={t.qa2Sub} />}
            {canContent   && <QuickAction href="/admin/content/home"     icon={LayoutDashboard} label={t.qa3Label} sub={t.qa3Sub} />}
          </div>
        </section>
      )}

      {/* ── Recent inquiries ──────────────────────────────────── */}
      {canInquiries && <section>
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <h3 className="text-[11px] font-black tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500">
            {t.recentTitle}
          </h3>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
          >
            {t.viewAll} <ArrowUpRight size={12} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">

          {/* ── Table head
               Mobile:  Name · Status
               sm:      Name · Subject · Status
               md:      Name · Subject · Date · Status          */}
          {!loading && recent.length > 0 && (
            <div className={`grid ${TABLE_GRID} gap-3 sm:gap-4 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500`}>
              <span>{t.colName}</span>
              <span className="hidden sm:block">{t.colSubject}</span>
              <span className="hidden md:block">{t.colDate}</span>
              <span>{t.colStatus}</span>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`grid ${TABLE_GRID} gap-3 sm:gap-4 items-center px-4 sm:px-5 py-3.5`}>
                  {/* Name skeleton */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
                    <div className="h-3 w-24 sm:w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  </div>
                  {/* Subject skeleton */}
                  <div className="hidden sm:block h-3 w-32 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  {/* Date skeleton */}
                  <div className="hidden md:block h-3 w-20 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  {/* Status skeleton */}
                  <div className="h-5 w-14 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse justify-self-start" />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && recent.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400 dark:text-slate-500">
              {t.noInquiries}
            </div>
          )}

          {/* ── Rows ── */}
          {!loading && recent.length > 0 && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((inq) => {
                const cfg = STATUS_CFG[inq.status] ?? STATUS_CFG.new;
                return (
                  <Link
                    key={inq.id}
                    href="/admin/inquiries"
                    className={`grid ${TABLE_GRID} gap-3 sm:gap-4 items-center px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150`}
                  >
                    {/* Name + avatar */}
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="shrink-0 w-7 h-7 rounded-md bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center text-[10px] font-black border border-blue-100 dark:border-blue-900/40 select-none">
                        {inq.full_name.trim()[0]?.toUpperCase() ?? '?'}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {inq.full_name}
                      </p>
                    </div>

                    {/* Subject */}
                    <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 truncate">
                      {SUBJECT_MAP[inq.subject]?.[lang] ?? inq.subject}
                    </p>

                    {/* Date */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      <Clock size={11} strokeWidth={2} className="shrink-0" />
                      {formatDate(inq.created_at, lang)}
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold leading-none border shrink-0 ${cfg.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                      {t[cfg.key]}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Footer ── */}
          {!loading && (
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-end">
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <CheckCheck size={13} strokeWidth={2.5} />
                {t.viewAll}
              </Link>
            </div>
          )}
        </div>
      </section>}

    </div>
  );
}
