import { getRequestConfig } from 'next-intl/server';
import { unstable_cache } from 'next/cache';
import { routing } from './routing';

/* Cache translated messages for 60 s — invalidated by admin save via revalidateTag */
const fetchMessages = unstable_cache(
  async (locale: string) => {
    try {
      const { getContent } = await import('@/lib/content-store');
      return await getContent(`messages.${locale}`);
    } catch {
      return null;
    }
  },
  ['site-messages'],
  { tags: ['site-messages'], revalidate: 60 },
);

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale;
  }

  /* Try DB first (admin-editable), fall back to static bundled file */
  const dbMessages = await fetchMessages(locale);
  const messages   = dbMessages
    ?? (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
