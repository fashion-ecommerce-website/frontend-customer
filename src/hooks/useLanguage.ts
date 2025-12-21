"use client";

import { useLanguageContext } from '../providers/LanguageProvider';

export const useLanguage = () => {
  const { lang, setLang, translations } = useLanguageContext();
  return { lang, setLang, translations };
};

export default useLanguage;
