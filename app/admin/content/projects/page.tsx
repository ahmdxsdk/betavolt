'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Save, RefreshCw, CheckCircle2, AlertCircle, ChevronDown,
  Plus, Pencil, Trash2, X, MapPin, Upload, LayoutGrid,
  ImageIcon, Film, Loader2,
} from 'lucide-react';
import { supabase, BUCKET } from '@/lib/supabase';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Types ─────────────────────────────────────────── */
type ProjectCategory = 'data-centers' | 'low-current' | 'power-electrical' | 'infrastructure';

interface GalleryItem { type: 'image' | 'video'; url: string; }

interface ProjectEntry {
  id: string;
  category: ProjectCategory;
  image_url: string;
  gallery: GalleryItem[];
  map_url: string;
  sort_order: number;
  title: { en: string; ar: string };
  location: { en: string; ar: string };
  challenge: { en: string; ar: string };
  solution: { en: string; ar: string };
}

interface PageHeader { eyebrow: string; title: string; subtitle: string; }

interface EditorState {
  pageHeader: { en: PageHeader; ar: PageHeader };
  projects: ProjectEntry[];
}

interface FormState {
  id: string;
  category: ProjectCategory;
  image_url: string;
  gallery: GalleryItem[];
  map_url: string;
  title: { en: string; ar: string };
  location: { en: string; ar: string };
  challenge: { en: string; ar: string };
  solution: { en: string; ar: string };
}

type Status = 'idle' | 'loading' | 'saving' | 'saved' | 'error';
type ModalMode = 'add' | 'edit';

/* ─── Bilingual labels ───────────────────────────────── */
const L = {
  en: {
    pageTitle: 'Projects Management',
    pageDesc: 'Manage bilingual content and project portfolio.',
    sectionA: 'A — Global Page Content',
    sectionB: 'B — Project Portfolio',
    eyebrow: 'Eyebrow Tag',
    pageHTitle: 'Page Title',
    subtitle: 'Subtitle',
    count: (n: number) => `${n} project${n !== 1 ? 's' : ''} · `,
    addNew: 'Add New Project',
    empty: 'No projects yet. Click "Add New Project".',
    save: 'Save Changes',
    saving: 'Saving…',
    saved: 'Saved to Supabase',
    unsaved: 'Unsaved changes',
    savedMsg: 'Changes saved to Supabase.',
    errorMsg: 'Failed to save. Please try again.',
    retry: 'Retry',
    flagEn: '🇬🇧',
    flagAr: '🇸🇦',
    labelEn: 'English',
    labelAr: 'Arabic',
    /* Modal */
    modalAdd: 'Add New Project',
    modalEdit: 'Edit Project',
    modalHint: 'Images upload directly to Supabase Storage on selection.',
    basicInfo: 'Basic Info',
    projectId: 'Project ID (slug)',
    idPlaceholder: 'auto-generated',
    category: 'Category',
    mapsUrl: 'Google Maps URL (optional)',
    mapsPlaceholder: 'https://maps.app.goo.gl/…',
    titleLoc: 'Title & Location',
    projectTitle: 'Project Title',
    location: 'Location',
    coverImage: 'Cover Image',
    gallery: 'Image & Video Gallery',
    challengeSol: 'Challenge & Solution',
    challenge: 'The Challenge',
    solution: 'The Solution',
    cancel: 'Cancel',
    modalSaveAdd: 'Add Project',
    modalSaveEdit: 'Save Changes',
    /* Card */
    edit: 'Edit',
    deleteConfirm: 'Delete permanently?',
    yesDelete: 'Yes, delete',
    galleryCount: (n: number) => `${n} gallery item${n !== 1 ? 's' : ''}`,
    untitled: 'Untitled',
    /* Upload */
    uploadCover: 'Click to upload cover image',
    uploadSpec: 'JPG, PNG, WEBP — max 50 MB',
    replace: 'Replace',
    remove: 'Remove',
    uploading: 'Uploading…',
    addMedia: (n: number) => `Add images or videos (${n} uploaded)`,
    uploadingFiles: 'Uploading files…',
    mediaSpec: 'JPG, PNG, WEBP, WEBM, MP4 — max 50 MB each. Select multiple files at once.',
  },
  ar: {
    pageTitle: 'إدارة المشاريع',
    pageDesc: 'إدارة المحتوى ثنائي اللغة وملف المشاريع.',
    sectionA: 'أ — محتوى الصفحة العام',
    sectionB: 'ب — ملف المشاريع',
    eyebrow: 'نص العنوان الصغير',
    pageHTitle: 'عنوان الصفحة',
    subtitle: 'العنوان الفرعي',
    count: (n: number) => `${n} مشروع · `,
    addNew: 'إضافة مشروع جديد',
    empty: 'لا توجد مشاريع بعد. انقر "إضافة مشروع جديد".',
    save: 'حفظ التغييرات',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ في Supabase',
    unsaved: 'تغييرات غير محفوظة',
    savedMsg: 'تم حفظ التغييرات في Supabase.',
    errorMsg: 'فشل الحفظ. يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
    flagEn: '🇬🇧',
    flagAr: '🇸🇦',
    labelEn: 'الإنجليزية',
    labelAr: 'العربية',
    /* Modal */
    modalAdd: 'إضافة مشروع جديد',
    modalEdit: 'تعديل المشروع',
    modalHint: 'يتم رفع الصور مباشرة إلى Supabase Storage عند الاختيار.',
    basicInfo: 'المعلومات الأساسية',
    projectId: 'معرّف المشروع (slug)',
    idPlaceholder: 'يُنشأ تلقائيًا',
    category: 'التصنيف',
    mapsUrl: 'رابط خرائط جوجل (اختياري)',
    mapsPlaceholder: 'https://maps.app.goo.gl/…',
    titleLoc: 'العنوان والموقع',
    projectTitle: 'عنوان المشروع',
    location: 'الموقع',
    coverImage: 'صورة الغلاف',
    gallery: 'معرض الصور والفيديو',
    challengeSol: 'التحدي والحل',
    challenge: 'التحدي',
    solution: 'الحل',
    cancel: 'إلغاء',
    modalSaveAdd: 'إضافة المشروع',
    modalSaveEdit: 'حفظ التغييرات',
    /* Card */
    edit: 'تعديل',
    deleteConfirm: 'حذف نهائيًا؟',
    yesDelete: 'نعم، احذف',
    galleryCount: (n: number) => `${n} عنصر في المعرض`,
    untitled: 'بدون عنوان',
    /* Upload */
    uploadCover: 'انقر لرفع صورة الغلاف',
    uploadSpec: 'JPG, PNG, WEBP — الحجم الأقصى 50 ميجابايت',
    replace: 'استبدال',
    remove: 'حذف',
    uploading: 'جارٍ الرفع…',
    addMedia: (n: number) => `إضافة صور أو فيديوهات (${n} مرفوع)`,
    uploadingFiles: 'جارٍ رفع الملفات…',
    mediaSpec: 'JPG, PNG, WEBP, WEBM, MP4 — الحجم الأقصى 50 ميجابايت لكل ملف.',
  },
};

type T = typeof L['en'];

/* ─── Categories ─────────────────────────────────────── */
const CATEGORIES: { value: ProjectCategory; label: { en: string; ar: string } }[] = [
  { value: 'infrastructure', label: { en: 'Infrastructure', ar: 'البنية التحتية' } },
  { value: 'power-electrical', label: { en: 'Power & Electrical', ar: 'الكهرباء والطاقة' } },
  { value: 'low-current', label: { en: 'Low Current & Smart', ar: 'التيار الخفيف والذكي' } },
  { value: 'data-centers', label: { en: 'Data Centers', ar: 'مراكز البيانات' } },
];

const CAT_BADGE: Record<ProjectCategory, string> = {
  'infrastructure': 'bg-blue-50   dark:bg-blue-950/40   text-blue-700   dark:text-blue-400   border-blue-200   dark:border-blue-900/50',
  'power-electrical': 'bg-amber-50  dark:bg-amber-950/40  text-amber-700  dark:text-amber-400  border-amber-200  dark:border-amber-900/50',
  'low-current': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
  'data-centers': 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
};

const EMPTY_FORM: FormState = {
  id: '', category: 'infrastructure', image_url: '', gallery: [], map_url: '',
  title: { en: '', ar: '' }, location: { en: '', ar: '' },
  challenge: { en: '', ar: '' }, solution: { en: '', ar: '' },
};

/* ─── Storage helpers ────────────────────────────────── */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

function fileExt(name: string) { return name.split('.').pop()?.toLowerCase() ?? 'bin'; }

function isVideo(name: string) { return /\.(webm|mp4|mov)$/i.test(name); }

async function uploadToStorage(file: File, folder: string): Promise<string> {
  const ext = fileExt(file.name);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, cacheControl: '3600' });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ─── Primitive UI ───────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 mb-1.5">
      {children}
    </p>
  );
}

function Input({ value, onChange, dir = 'ltr', placeholder }: {
  value: string; onChange: (v: string) => void; dir?: 'ltr' | 'rtl'; placeholder?: string;
}) {
  return (
    <input
      type="text" value={value} dir={dir} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-500 transition-colors"
    />
  );
}

function Textarea({ value, onChange, dir = 'ltr', rows = 3 }: {
  value: string; onChange: (v: string) => void; dir?: 'ltr' | 'rtl'; rows?: number;
}) {
  return (
    <textarea
      value={value} dir={dir} rows={rows}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-500 transition-colors resize-none"
    />
  );
}

function SelectField({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-500 transition-colors"
    >
      {children}
    </select>
  );
}

function ColHeader({ flag, label }: { flag: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-base leading-none">{flag}</span>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

/* BiRow: stacks on mobile, side-by-side on sm+ */
function BiRow({ label, enV, arV, onEn, onAr, multi, rows }: {
  label: string; enV: string; arV: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  multi?: boolean; rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
        {multi
          ? <><Textarea value={enV} onChange={onEn} dir="ltr" rows={rows} /><Textarea value={arV} onChange={onAr} dir="rtl" rows={rows} /></>
          : <><Input value={enV} onChange={onEn} dir="ltr" /><Input value={arV} onChange={onAr} dir="rtl" /></>
        }
      </div>
    </div>
  );
}

/* SectionCard — animated open/close */
function SectionCard({ badge, title, open, onToggle, children }: {
  badge: string; title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <button
        type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-[10px] font-black shrink-0">
          {badge}
        </span>
        <span className="font-bold text-slate-950 dark:text-white text-sm flex-1">{title}</span>
        <ChevronDown size={16} strokeWidth={2} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-5 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Cover Image Uploader ───────────────────────────── */
function CoverUploader({ url, projectId, onUploaded, t }: {
  url: string; projectId: string; onUploaded: (url: string) => void; t: T;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const folder = `covers/${projectId || 'new'}`;
      const publicUrl = await uploadToStorage(file, folder);
      onUploaded(publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <img src={url} alt="cover" className="w-full h-40 sm:h-44 object-cover" />
          <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg shadow hover:bg-slate-100 transition-colors"
            >
              {t.replace}
            </button>
            <button
              type="button"
              onClick={() => onUploaded('')}
              className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
            >
              {t.remove}
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <Loader2 size={24} className="text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 w-full h-36 sm:h-44 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors text-slate-400 dark:text-slate-600 disabled:opacity-50"
        >
          {uploading
            ? <Loader2 size={22} className="animate-spin text-blue-500" />
            : <Upload size={22} strokeWidth={1.5} />}
          <span className="text-xs font-medium">
            {uploading ? t.uploading : t.uploadCover}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-600">{t.uploadSpec}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Gallery Uploader ───────────────────────────────── */
function GalleryUploader({ items, projectId, onChange, t }: {
  items: GalleryItem[]; projectId: string; onChange: (items: GalleryItem[]) => void; t: T;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError('');
    setUploading(true);
    try {
      const folder = `gallery/${projectId || 'new'}`;
      const uploaded: GalleryItem[] = await Promise.all(
        files.map(async (file) => ({
          type: isVideo(file.name) ? 'video' : 'image' as 'video' | 'image',
          url: await uploadToStorage(file, folder),
        }))
      );
      onChange([...items, ...uploaded]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {items.map((item, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              {item.type === 'video'
                ? (
                  <div className="flex items-center justify-center h-full">
                    <Film size={20} strokeWidth={1.5} className="text-slate-400" />
                  </div>
                )
                : <img src={item.url} alt="" className="w-full h-full object-cover" />
              }
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 end-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} strokeWidth={3} />
              </button>
              {item.type === 'video' && (
                <span className="absolute bottom-1 start-1 text-[8px] font-bold bg-slate-900/70 text-white px-1 rounded">VID</span>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors text-slate-400 dark:text-slate-600 text-xs font-medium disabled:opacity-50"
      >
        {uploading
          ? <><Loader2 size={14} className="animate-spin text-blue-500" /> {t.uploadingFiles}</>
          : <><Upload size={14} strokeWidth={1.75} /> {t.addMedia(items.length)}</>}
      </button>
      <input ref={inputRef} type="file" accept="image/*,video/webm,video/mp4,video/quicktime" multiple className="hidden" onChange={handleFiles} />
      <p className="text-[10px] text-slate-400 dark:text-slate-600">{t.mediaSpec}</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Project Card ───────────────────────────────────── */
function ProjectCard({ project, lang, t, onEdit, onDelete, confirmingDelete, onConfirm, onCancelDelete }: {
  project: ProjectEntry;
  lang: 'en' | 'ar';
  t: T;
  onEdit: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onConfirm: () => void;
  onCancelDelete: () => void;
}) {
  const badge = CAT_BADGE[project.category] ?? '';
  const catLabel = CATEGORIES.find(c => c.value === project.category)?.label[lang] ?? project.category;
  const titleText = project.title[lang] || project.title[lang === 'en' ? 'ar' : 'en'];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-36 bg-slate-100 dark:bg-slate-800 shrink-0">
        {project.image_url
          ? <img src={project.image_url} alt="" className="w-full h-full object-cover" />
          : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon size={22} strokeWidth={1.5} className="text-slate-300 dark:text-slate-600" />
            </div>
          )
        }
        <span className={`absolute top-2 start-2 text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md border ${badge}`}>
          {catLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1">
        <p
          className="text-sm font-bold text-slate-950 dark:text-white leading-snug line-clamp-2"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {titleText || <span className="italic text-slate-400">{t.untitled}</span>}
        </p>
        {project.location[lang] && (
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={10} strokeWidth={2} className="shrink-0" />
            {project.location[lang]}
          </p>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-auto pt-1">
          {t.galleryCount(project.gallery.length)}
        </p>
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex items-center gap-2">
        {confirmingDelete ? (
          <>
            <span className="text-xs text-red-500 font-medium me-auto">{t.deleteConfirm}</span>
            <button type="button" onClick={onConfirm} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors">
              {t.yesDelete}
            </button>
            <button type="button" onClick={onCancelDelete} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {t.cancel}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Pencil size={11} strokeWidth={2} /> {t.edit}
            </button>
            <button type="button" onClick={onDelete} className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2 size={11} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Project Modal ──────────────────────────────────── */
function ProjectModal({ mode, form, lang, t, onChange, onClose, onSave }: {
  mode: ModalMode;
  form: FormState;
  lang: 'en' | 'ar';
  t: T;
  onChange: (p: Partial<FormState>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) { onChange({ [k]: v }); }
  function bi(k: 'title' | 'location' | 'challenge' | 'solution', l: 'en' | 'ar', v: string) {
    onChange({ [k]: { ...form[k], [l]: v } });
  }

  const projectFolder = form.id || 'new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-4xl max-h-[94vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="min-w-0">
            <h3 className="font-black text-sm sm:text-base text-slate-950 dark:text-white">
              {mode === 'add' ? t.modalAdd : t.modalEdit}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{t.modalHint}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ms-3">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col gap-3 sm:gap-5">

          {/* ── Basic Info ── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">{t.basicInfo}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" dir="ltr">
              <div>
                <Label>{t.projectId}</Label>
                <Input value={form.id} onChange={v => set('id', v)} placeholder={t.idPlaceholder} />
              </div>
              <div>
                <Label>{t.category}</Label>
                <SelectField value={form.category} onChange={v => set('category', v as ProjectCategory)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label[lang]}</option>)}
                </SelectField>
              </div>
            </div>

            <div>
              <Label>{t.mapsUrl}</Label>
              <Input value={form.map_url} onChange={v => set('map_url', v)} placeholder={t.mapsPlaceholder} dir="ltr" />
            </div>
          </div>

          {/* ── Title & Location ── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">{t.titleLoc}</p>
            <div className="hidden sm:grid grid-cols-2 gap-3 mb-1" dir="ltr">
              <ColHeader flag={t.flagEn} label={t.labelEn} />
              <ColHeader flag={t.flagAr} label={t.labelAr} />
            </div>
            <BiRow
              label={t.projectTitle}
              enV={form.title.en} arV={form.title.ar}
              onEn={v => { bi('title', 'en', v); if (mode === 'add' && !form.id) set('id', slugify(v)); }}
              onAr={v => bi('title', 'ar', v)}
            />
            <BiRow
              label={t.location}
              enV={form.location.en} arV={form.location.ar}
              onEn={v => bi('location', 'en', v)} onAr={v => bi('location', 'ar', v)}
            />
          </div>

          {/* ── Cover Image ── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-3 sm:p-5 flex flex-col gap-3">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">{t.coverImage}</p>
            <CoverUploader
              url={form.image_url}
              projectId={projectFolder}
              onUploaded={url => set('image_url', url)}
              t={t}
            />
          </div>

          {/* ── Gallery ── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-3 sm:p-5 flex flex-col gap-3">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">{t.gallery}</p>
            <GalleryUploader
              items={form.gallery}
              projectId={projectFolder}
              onChange={items => set('gallery', items)}
              t={t}
            />
          </div>

          {/* ── Challenge & Solution ── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">{t.challengeSol}</p>
            <div className="hidden sm:grid grid-cols-2 gap-3 mb-1" dir="ltr">
              <ColHeader flag={t.flagEn} label={t.labelEn} />
              <ColHeader flag={t.flagAr} label={t.labelAr} />
            </div>
            <BiRow
              label={t.challenge}
              enV={form.challenge.en} arV={form.challenge.ar}
              onEn={v => bi('challenge', 'en', v)} onAr={v => bi('challenge', 'ar', v)}
              multi rows={4}
            />
            <BiRow
              label={t.solution}
              enV={form.solution.en} arV={form.solution.ar}
              onEn={v => bi('solution', 'en', v)} onAr={v => bi('solution', 'ar', v)}
              multi rows={4}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {t.cancel}
          </button>
          <button type="button" onClick={onSave} className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
            <Save size={14} strokeWidth={2} />
            {mode === 'add' ? t.modalSaveAdd : t.modalSaveEdit}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ProjectsContentPage() {
  const { lang } = useAdminLang();
  const t = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [state, setState] = useState<EditorState | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [headerOpen, setHeaderOpen] = useState(true);
  const [cardsOpen, setCardsOpen] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/content/projects');
      const data = await res.json() as EditorState;
      setState(data);
      setStatus('idle');
    } catch { setStatus('error'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!state) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/content/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      setStatus(res.ok ? 'saved' : 'error');
      if (res.ok) setTimeout(() => setStatus('idle'), 3000);
    } catch { setStatus('error'); }
  }

  function updateHeader(l: 'en' | 'ar', key: keyof PageHeader, value: string) {
    setState(prev => prev ? {
      ...prev,
      pageHeader: { ...prev.pageHeader, [l]: { ...prev.pageHeader[l], [key]: value } },
    } : prev);
  }

  function openAdd() {
    setForm(EMPTY_FORM); setModalMode('add'); setEditingId(null); setModalOpen(true);
  }

  function openEdit(p: ProjectEntry) {
    setForm({
      id: p.id, category: p.category, image_url: p.image_url,
      gallery: p.gallery, map_url: p.map_url,
      title: { ...p.title }, location: { ...p.location },
      challenge: { ...p.challenge }, solution: { ...p.solution },
    });
    setModalMode('edit'); setEditingId(p.id); setModalOpen(true);
  }

  function closeModal() { setModalOpen(false); setEditingId(null); }

  function commitModal() {
    const project: ProjectEntry = {
      id: form.id || slugify(form.title.en) + '-' + Math.random().toString(36).slice(2, 6),
      category: form.category,
      image_url: form.image_url,
      gallery: form.gallery,
      map_url: form.map_url,
      sort_order: 0,
      title: { ...form.title },
      location: { ...form.location },
      challenge: { ...form.challenge },
      solution: { ...form.solution },
    };
    setState(prev => {
      if (!prev) return prev;
      if (modalMode === 'add') return { ...prev, projects: [...prev.projects, project] };
      return { ...prev, projects: prev.projects.map(p => p.id === editingId ? project : p) };
    });
    closeModal();
  }

  function confirmDelete(id: string) {
    setState(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== id) } : prev);
    setDeleteId(null);
  }

  /* ── Render ── */
  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
        <RefreshCw size={20} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.errorMsg}{' '}
          <button onClick={load} className="text-blue-500 underline">{t.retry}</button>
        </p>
      </div>
    );
  }

  const HEADER_FIELDS: { key: keyof PageHeader; label: string; multi?: boolean }[] = [
    { key: 'eyebrow', label: t.eyebrow },
    { key: 'title', label: t.pageHTitle },
    { key: 'subtitle', label: t.subtitle, multi: true },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 pb-28 sm:pb-32" dir={dir}>

      {/* Page heading */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">{t.pageTitle}</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t.pageDesc}</p>
      </div>

      {/* Status banners */}
      {status === 'saved' && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <CheckCircle2 size={16} strokeWidth={2} /> {t.savedMsg}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-sm font-medium">
          <AlertCircle size={16} strokeWidth={2} /> {t.errorMsg}
        </div>
      )}

      {/* EN/AR column header hint — hidden on mobile since BiRow stacks there */}
      <div className="hidden sm:grid grid-cols-2 gap-3 px-4 sm:px-6 mb-3" dir="ltr">
        <ColHeader flag={t.flagEn} label={t.labelEn} />
        <ColHeader flag={t.flagAr} label={t.labelAr} />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">

        {/* Section A — Page Header */}
        <SectionCard badge="A" title={t.sectionA} open={headerOpen} onToggle={() => setHeaderOpen(v => !v)}>
          {HEADER_FIELDS.map(({ key, label, multi }) => (
            <BiRow
              key={key} label={label}
              enV={state.pageHeader.en[key]} arV={state.pageHeader.ar[key]}
              onEn={v => updateHeader('en', key, v)} onAr={v => updateHeader('ar', key, v)}
              multi={multi}
            />
          ))}
        </SectionCard>

        {/* Section B — Project Portfolio */}
        <SectionCard badge="B" title={t.sectionB} open={cardsOpen} onToggle={() => setCardsOpen(v => !v)}>
          <div className="flex items-center justify-between -mt-1 flex-wrap gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.count(state.projects.length)}
            </p>
            <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
              <Plus size={13} strokeWidth={2.5} /> {t.addNew}
            </button>
          </div>

          {state.projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 gap-3">
              <LayoutGrid size={28} strokeWidth={1.5} className="text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-400 dark:text-slate-600 text-center px-4">{t.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {state.projects.map(p => (
                <ProjectCard
                  key={p.id} project={p} lang={lang} t={t}
                  onEdit={() => openEdit(p)}
                  onDelete={() => setDeleteId(p.id)}
                  confirmingDelete={deleteId === p.id}
                  onConfirm={() => confirmDelete(p.id)}
                  onCancelDelete={() => setDeleteId(null)}
                />
              ))}
            </div>
          )}
        </SectionCard>

      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10 pointer-events-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 flex justify-end pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              {status === 'saving' ? t.saving : status === 'saved' ? t.saved : t.unsaved}
            </span>
            <button
              type="button" onClick={save} disabled={status === 'saving'}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-colors whitespace-nowrap"
            >
              {status === 'saving'
                ? <RefreshCw size={15} strokeWidth={2} className="animate-spin" />
                : <Save size={15} strokeWidth={2} />}
              {status === 'saving' ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          mode={modalMode} form={form} lang={lang} t={t}
          onChange={patch => setForm(prev => ({ ...prev, ...patch }))}
          onClose={closeModal} onSave={commitModal}
        />
      )}

    </div>
  );
}
