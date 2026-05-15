'use client';

import { useActionState, useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Lock, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { loginAction } from './actions';
import ThemeToggle from '@/components/layout/ThemeToggle';

type Lang = 'en' | 'ar';
type ActionState = { error: string } | null;

/* ─── Bilingual labels ───────────────────────────────────── */
const L = {
  en: {
    title:       'Admin Command Center',
    subtitle:    'مركز تحكم الإدارة',
    emailLabel:  'Email Address',
    emailPh:     'admin@betavolt.com',
    passLabel:   'Password',
    passPh:      '••••••••',
    submit:      'Authenticate',
    submitting:  'Authenticating…',
    footer:      'Restricted access · BetaVolt Internal System',
    errorFallback: 'Invalid credentials. Please check your email and password.',
  },
  ar: {
    title:       'مركز تحكم الإدارة',
    subtitle:    'Admin Command Center',
    emailLabel:  'البريد الإلكتروني',
    emailPh:     'admin@betavolt.com',
    passLabel:   'كلمة المرور',
    passPh:      '••••••••',
    submit:      'تسجيل الدخول',
    submitting:  'جارٍ التحقق…',
    footer:      'وصول مقيّد · نظام BetaVolt الداخلي',
    errorFallback: 'بيانات غير صحيحة. تحقق من البريد الإلكتروني وكلمة المرور.',
  },
};

/* ─── Style constants ────────────────────────────────────── */
const INPUT =
  'w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 ' +
  'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';

const LABEL =
  'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5 text-start';

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, null);
  const [lang, setLangState] = useState<Lang>('en');

  /* Read saved lang from cookie on mount */
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)admin-lang=([^;]+)/);
    const saved = match?.[1];
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  /* Persist lang choice + update page direction */
  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `admin-lang=${l};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }

  const t   = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  /* Translate server error if in Arabic */
  const errorMsg = state?.error
    ? (lang === 'ar' ? t.errorFallback : state.error)
    : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-[#07111F] overflow-hidden" dir={dir}>

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px),' +
            'linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Dark-mode radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(37,99,235,0.18),transparent)]"
      />

      {/* Top-right controls */}
      <div className="absolute top-4 end-4 z-10 flex items-center gap-2">

        {/* Language toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-0.5 gap-0.5">
          {(['en', 'ar'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={[
                'px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase transition-all duration-150 select-none',
                lang === l
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
              ].join(' ')}
            >
              {l === 'en' ? 'EN' : 'ع'}
            </button>
          ))}
        </div>

        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_64px_rgba(0,0,0,0.55)] px-5 sm:px-8 py-8 sm:py-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-7 sm:mb-9">
            <Image
              src="/images/logo-icon.png"
              alt="BetaVolt"
              width={34}
              height={34}
              className="object-contain shrink-0"
              priority
            />
            <span className="font-orbitron font-black text-xl tracking-wide leading-none select-none">
              <span className="text-slate-900 dark:text-white">BETA</span>
              <span className="text-blue-600">VOLT</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6 sm:mb-7">
            <h1 className="text-[1.2rem] sm:text-[1.4rem] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 font-medium">
              {t.subtitle}
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/80 to-transparent" />
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-400 text-sm" role="alert">
              <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className={LABEL}>
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail size={15} strokeWidth={1.75}
                  className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={t.emailPh}
                  className={INPUT}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className={LABEL}>
                {t.passLabel}
              </label>
              <div className="relative">
                <Lock size={15} strokeWidth={1.75}
                  className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder={t.passPh}
                  className={INPUT}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className={[
                'mt-1 w-full flex items-center justify-center gap-2.5',
                'px-5 py-3 rounded-xl text-white text-sm font-bold tracking-wide',
                'transition-all duration-200 shadow-sm select-none',
                pending
                  ? 'bg-blue-400 dark:bg-blue-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
              ].join(' ')}
            >
              {pending ? (
                <>
                  <RefreshCw size={15} strokeWidth={2.5} className="animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Shield size={15} strokeWidth={2} />
                  {t.submit}
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-7 text-center text-[11px] text-slate-400 dark:text-slate-600 select-none">
            {t.footer}
          </p>

        </div>
      </div>
    </div>
  );
}
