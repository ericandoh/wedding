'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '#/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem('wedding-language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
        setLanguage(savedLanguage);
      }
    }
  }, [isClient]);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      console.log('Language changed to:', language);
      localStorage.setItem('wedding-language', language);
    }
  }, [language, isClient]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
