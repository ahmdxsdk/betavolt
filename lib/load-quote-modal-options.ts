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

const DEFAULTS: QuoteModalOptions = { projectTypes: [], timelines: [] };

export async function loadQuoteModalOptions(): Promise<QuoteModalOptions> {
  try {
    /* Try Supabase first (admin-editable) */
    const { getContent } = await import('./content-store');
    const db = await getContent('quote-modal-options');
    if (db) return db as unknown as QuoteModalOptions;
  } catch { /* fall through */ }

  /* Fall back to bundled static file */
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'quote-modal-options.json'), 'utf-8'),
    );
  } catch {
    return DEFAULTS;
  }
}
