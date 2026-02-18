'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './translations/en.json';
import zh from './translations/zh.json';

export type Locale = 'en' | 'zh';
type Translations = Record<string, string>;

const translationMap: Record<Locale, Translations> = { en, zh };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('luckin-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('luckin-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = translationMap[locale]?.[key] || translationMap['en']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  };

  // Prevent hydration mismatch by returning English on server
  if (!mounted) {
    const serverT = (key: string, params?: Record<string, string | number>): string => {
      let value = translationMap['en']?.[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    };

    return (
      <LanguageContext.Provider value={{ locale: 'en', setLocale, t: serverT }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
