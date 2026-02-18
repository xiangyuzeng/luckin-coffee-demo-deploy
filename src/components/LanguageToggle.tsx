'use client';

import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
      className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
      aria-label="Toggle language"
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  );
}
