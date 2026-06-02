import ja from './ja.json';
import en from './en.json';

export type Locale = 'ja' | 'en';
type Messages = typeof ja;
export type MessageKey = keyof Messages;

const messages: Record<Locale, Messages> = { ja, en };

export function useTranslations(locale: Locale) {
  return function t(key: MessageKey): string {
    return messages[locale][key] ?? messages['ja'][key] ?? key;
  };
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return 'ja';
}

export function localePath(locale: Locale, path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'ja') return `${base}${clean}`;
  return `${base}/en${clean}`;
}
