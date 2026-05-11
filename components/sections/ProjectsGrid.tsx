'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { projectsData, type FilterKey, type Project } from '@/lib/projects-data';

// ── Types ──────────────────────────────────────────────────────────────────

type Lang = 'en' | 'ar';

type FilterDef = { key: FilterKey; tKey: string };

const FILTERS: FilterDef[] = [
  { key: 'all',               tKey: 'filter_all'           },
  { key: 'data-centers',      tKey: 'filter_data_centers'  },
  { key: 'low-current',       tKey: 'filter_low_current'   },
  { key: 'power-electrical',  tKey: 'filter_power'         },
  { key: 'infrastructure',    tKey: 'filter_infrastructure' },
];

const CATEGORY_STYLE: Record<string, string> = {
  'data-centers':     'bg-brand-accent/15 text-brand-accent   border-brand-accent/30',
  'low-current':      'bg-brand-blue/15   text-brand-blue     border-brand-blue/30',
  'power-electrical': 'bg-yellow-500/15   text-yellow-400     border-yellow-500/30',
  'infrastructure':   'bg-emerald-500/15  text-emerald-400    border-emerald-500/30',
};

const CATEGORY_LABEL: Record<string, { en: string; ar: string }> = {
  'data-centers':     { en: 'Data Centers',          ar: 'مراكز البيانات'          },
  'low-current':      { en: 'Low Current & Smart',   ar: 'التيار الخفيف والذكي'    },
  'power-electrical': { en: 'Power & Electrical',    ar: 'القوى والكهرباء'          },
  'infrastructure':   { en: 'Infrastructure',        ar: 'البنية التحتية'           },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}

function Badge({ category, lang }: { category: string; lang: Lang }) {
  return (
    <span className={`inline-block text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${CATEGORY_STYLE[category]}`}>
      {CATEGORY_LABEL[category]?.[lang] ?? category}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────

function Modal({ project, lang, onClose, t }: {
  project: Project;
  lang: Lang;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-brand-blue/[0.15] shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
          <Image
            src={project.image}
            alt={project.title[lang]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-black/20 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label={t('modal_close')}
            className="absolute top-3 end-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/80 transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">

          {/* Title block */}
          <div className="mb-5">
            <Badge category={project.category} lang={lang} />
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mt-2 mb-1">
              {project.title[lang]}
            </h2>
            <p className="text-slate-400 text-sm flex items-center gap-1.5">
              <PinIcon />{project.location[lang]}
            </p>
          </div>

          {/* Challenge / Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="rounded-xl p-4 bg-navy-800/60 border border-white/[0.05]">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-brand-accent mb-2">
                {t('modal_challenge')}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{project.challenge[lang]}</p>
            </div>
            <div className="rounded-xl p-4 bg-navy-800/60 border border-white/[0.05]">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-brand-blue mb-2">
                {t('modal_solution')}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{project.solution[lang]}</p>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-500 mb-3">
              {t('modal_gallery')}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {project.gallery.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-navy-800">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 30vw, 200px"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ProjectsGrid({ locale }: { locale: string }) {
  const t = useTranslations('projects_page');
  const lang = locale as Lang;

  const [activeFilter, setActiveFilter]     = useState<FilterKey>('all');
  const [displayedFilter, setDisplayedFilter] = useState<FilterKey>('all');
  const [exiting, setExiting]               = useState(false);
  const [activeProject, setActiveProject]   = useState<Project | null>(null);
  const [mounted, setMounted]               = useState(false);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  useEffect(() => () => { if (exitTimer.current) window.clearTimeout(exitTimer.current); }, []);

  function handleFilterChange(key: FilterKey) {
    if (key === activeFilter) return;
    setActiveFilter(key);
    setExiting(true);
    exitTimer.current = window.setTimeout(() => {
      setDisplayedFilter(key);
      setExiting(false);
    }, 220);
  }

  const filtered =
    displayedFilter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === displayedFilter);

  return (
    <div>

      {/* ── Filter Tabs ───────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 justify-center mb-10 sm:mb-12"
        role="group"
        aria-label="Filter projects"
      >
        {FILTERS.map(({ key, tKey }) => {
          const active = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`
                px-4 sm:px-5 py-2 rounded-full
                text-sm font-semibold border
                transition-all duration-200
                ${active
                  ? 'bg-brand-blue border-brand-blue text-brand-dark shadow-[0_0_12px_rgba(75,163,227,0.35)]'
                  : 'border-white/10 text-slate-400 hover:border-brand-blue/30 hover:text-white bg-transparent'}
              `}
            >
              {t(tKey)}
            </button>
          );
        })}
      </div>

      {/* ── Cards Grid ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-20">{t('no_results')}</p>
      ) : (
        <div
          key={displayedFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          style={{
            transition: 'opacity 200ms ease, transform 200ms ease',
            ...(exiting
              ? { opacity: 0, transform: 'translateY(8px)' }
              : { opacity: 1, transform: 'translateY(0)' }),
          }}
        >
          {filtered.map((project, i) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project)}
              style={{
                animation: `card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms both`,
              }}
              className="
                group text-start
                rounded-2xl overflow-hidden
                border border-brand-blue/[0.1]
                bg-navy-800/30
                hover:border-brand-blue/30 hover:bg-navy-800/50
                transition-colors duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue
              "
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title[lang]}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-5 py-2.5 rounded-lg bg-brand-blue text-brand-dark font-bold text-sm glow-blue-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {t('view_details')}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 sm:p-5">
                <Badge category={project.category} lang={lang} />
                <h3 className="text-base sm:text-[1.05rem] font-bold text-white leading-snug mt-2.5 mb-1.5 line-clamp-2">
                  {project.title[lang]}
                </h3>
                <p className="text-slate-400 text-sm flex items-center gap-1.5">
                  <PinIcon />{project.location[lang]}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {mounted && activeProject && (
        <Modal
          project={activeProject}
          lang={lang}
          onClose={() => setActiveProject(null)}
          t={t}
        />
      )}

    </div>
  );
}
