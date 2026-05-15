import { readFileSync } from 'fs';
import { join } from 'path';

export interface ModalOption {
  en: string;
  ar: string;
}

export interface QuoteModalOptions {
  projectTypes: ModalOption[];
  timelines:    ModalOption[];
}

const DEFAULTS: QuoteModalOptions = {
  projectTypes: [],
  timelines:    [],
};

export function loadQuoteModalOptions(): QuoteModalOptions {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'quote-modal-options.json'), 'utf-8'),
    );
  } catch {
    return DEFAULTS;
  }
}
