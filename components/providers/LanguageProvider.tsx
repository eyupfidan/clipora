"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  translations,
  type LanguageCode,
  type TranslationKey
} from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE
}: {
  children: React.ReactNode;
  initialLanguage?: LanguageCode;
}) {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("keep-notes-language");
    if (isLanguageCode(storedLanguage) && storedLanguage !== language) {
      // Sync client-only storage after hydration without blocking the initial render.
      queueMicrotask(() => {
        setLanguageState(storedLanguage);
      });
    }
  }, [language]);

  function setLanguage(nextLanguage: LanguageCode) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("keep-notes-language", nextLanguage);
    document.cookie = `keep-notes-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key] ?? translations.en[key]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
