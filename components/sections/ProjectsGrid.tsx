'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { projectsData, type FilterKey, type Project, type GalleryItem } from '@/lib/projects-data';

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

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

// ── Image Lightbox ─────────────────────────────────────────────────────────

function ImageLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-10"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-11 end-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-150 text-sm font-medium"
          aria-label="Close image"
        >
          <CloseIcon />
          <span>Close</span>
        </button>

        {/* Image container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_100px_rgba(0,0,0,0.9)] bg-black max-h-[82vh] flex items-center justify-center">
          <img
            src={url}
            alt=""
            fetchPriority="high"
            decoding="sync"
            className="w-full h-auto max-h-[82vh] object-contain block"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Video Lightbox ─────────────────────────────────────────────────────────

function VideoLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-11 end-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-150 text-sm font-medium"
          aria-label="Close video"
        >
          <CloseIcon />
          <span>Close</span>
        </button>

        {/* Video container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_100px_rgba(0,0,0,0.9)] bg-black aspect-video">
          <video
            src={url}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>,
    document.body
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

function Modal({ project, lang, onClose, onPlayVideo, onViewImage, t }: {
  project: Project;
  lang: Lang;
  onClose: () => void;
  onPlayVideo: (url: string) => void;
  onViewImage: (url: string) => void;
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
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <PinIcon />{project.location[lang]}
              </p>
              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover border border-brand-blue/25 hover:border-brand-blue/60 hover:bg-brand-blue/[0.08] px-2.5 py-1 rounded-lg transition-all duration-200"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {lang === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                </a>
              )}
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {project.gallery.map((item: GalleryItem, i: number) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                  {item.type === 'image' ? (
                    <button
                      onClick={() => onViewImage(item.url)}
                      className="group relative w-full h-full block"
                      aria-label="View image"
                    >
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        priority={i < 6}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) calc(50vw - 24px), 210px"
                      />
                      {/* Scrim + zoom icon on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center text-white">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                          </svg>
                        </div>
                      </div>
                    </button>
                  ) : (
                    /* ── Video thumbnail card ── */
                    <button
                      onClick={() => onPlayVideo(item.url)}
                      className="group relative w-full h-full flex items-center justify-center"
                      aria-label="Play video"
                    >
                      {/* Video thumbnail — first frame via preload="metadata" */}
                      <video
                        src={item.url}
                        preload="metadata"
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        tabIndex={-1}
                      />

                      {/* Dark scrim so play button pops */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />

                      {/* Play button */}
                      <div className="
                        relative z-10
                        w-14 h-14 rounded-full
                        flex items-center justify-center ps-1
                        bg-white/10 border border-white/25
                        text-white
                        backdrop-blur-sm
                        shadow-[0_0_28px_rgba(75,163,227,0.35)]
                        group-hover:bg-brand-blue group-hover:border-brand-blue
                        group-hover:shadow-[0_0_36px_rgba(75,163,227,0.6)]
                        transition-all duration-300 group-hover:scale-110
                      ">
                        <PlayIcon />
                      </div>

                      {/* Bottom shimmer line */}
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </button>
                  )}
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

  const [activeFilter, setActiveFilter]       = useState<FilterKey>('all');
  const [displayedFilter, setDisplayedFilter] = useState<FilterKey>('all');
  const [exiting, setExiting]                 = useState(false);
  const [activeProject, setActiveProject]     = useState<Project | null>(null);
  const [activeVideo, setActiveVideo]         = useState<string | null>(null);
  const [activeImage, setActiveImage]         = useState<string | null>(null);
  const [mounted, setMounted]                 = useState(false);
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
              onMouseEnter={() => {
                project.gallery
                  .filter((g) => g.type === 'image')
                  .slice(0, 6)
                  .forEach((g) => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = g.url;
                    document.head.appendChild(link);
                  });
              }}
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
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-slate-400 text-sm flex items-center gap-1.5 min-w-0 truncate">
                    <PinIcon />{project.location[lang]}
                  </p>
                  {project.mapUrl && (
                    <a
                      href={project.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-brand-blue/70 hover:text-brand-blue border border-brand-blue/20 hover:border-brand-blue/50 hover:bg-brand-blue/[0.07] px-2 py-1 rounded-md transition-all duration-200"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      {lang === 'ar' ? 'الخريطة' : 'Map'}
                    </a>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Project Modal ─────────────────────────────────────────────── */}
      {mounted && activeProject && (
        <Modal
          project={activeProject}
          lang={lang}
          onClose={() => setActiveProject(null)}
          onPlayVideo={(url) => setActiveVideo(url)}
          onViewImage={(url) => setActiveImage(url)}
          t={t}
        />
      )}

      {/* ── Video Lightbox ────────────────────────────────────────────── */}
      {mounted && activeVideo && (
        <VideoLightbox
          url={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* ── Image Lightbox ────────────────────────────────────────────── */}
      {mounted && activeImage && (
        <ImageLightbox
          url={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}

    </div>
  );
}
