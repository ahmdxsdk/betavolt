'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open:        boolean;
  title:       string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:     boolean;
  onConfirm:   () => void;
  onCancel:    () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  danger       = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  /* Focus confirm button when modal opens */
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-[0_24px_64px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-in zoom-in-95 fade-in duration-200">

        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 end-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.5} />
        </button>

        <div className="p-6 flex flex-col items-center text-center gap-4">

          {/* Icon */}
          <div className={[
            'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
            danger
              ? 'bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50'
              : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50',
          ].join(' ')}>
            <AlertTriangle
              size={26}
              strokeWidth={1.75}
              className={danger ? 'text-red-500' : 'text-amber-500'}
            />
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <h3
              id="confirm-modal-title"
              className="text-base font-black text-slate-900 dark:text-white leading-snug"
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors duration-150"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={onConfirm}
              className={[
                'flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors duration-150',
                danger
                  ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                  : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
              ].join(' ')}
            >
              {confirmLabel}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
