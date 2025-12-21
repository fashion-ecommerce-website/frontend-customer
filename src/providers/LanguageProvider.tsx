"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../i18n/en';
import vi from '../i18n/vi';
import type { Translations, Lang as LangType } from '../i18n/types';

type Lang = LangType;

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const TRANSLATIONS: Record<Lang, Translations> = {
  en,
  vi,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize to 'en' to keep server and first client render consistent.
  // Defer reading localStorage to an effect so initial HTML matches server-rendered HTML.
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') as Lang | null;
      if (stored && stored !== lang) setLang(stored);
    } catch {
      // ignore
    }
  // run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const translations = TRANSLATIONS[lang];

  const value = useMemo(() => ({ lang, setLang, translations }), [lang, translations]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be used within LanguageProvider');
  return ctx;
};
