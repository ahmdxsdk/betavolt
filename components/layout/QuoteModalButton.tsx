'use client';

import { useState } from 'react';
import QuoteModal from './QuoteModal';
import type { ModalOption } from '@/lib/load-quote-modal-options';

interface Props {
  ctaLabel:     string;
  className?:   string;
  projectTypes: ModalOption[];
  timelines:    ModalOption[];
}

export default function QuoteModalButton({ ctaLabel, className, projectTypes, timelines }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultCls = `
    hidden md:inline-flex items-center gap-1.5
    px-4 py-2.5 rounded-lg
    bg-brand-blue text-white font-bold text-sm
    hover:bg-brand-blue-hover shadow-sm
    transition-all duration-200 hover:scale-105 active:scale-100
    min-h-[44px]
  `;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className ?? defaultCls}
      >
        {ctaLabel}
      </button>

      <QuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} projectTypes={projectTypes} timelines={timelines} />
    </>
  );
}
