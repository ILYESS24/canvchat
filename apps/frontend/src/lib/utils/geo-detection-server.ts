import { type Locale } from '@/i18n/config';

export function detectBestLocaleFromHeaders(request: Request): Locale {
  return 'en';
}
