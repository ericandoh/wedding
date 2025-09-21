'use client';

import { useLanguage } from './language-provider';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    console.log('Current language:', language);
    const newLanguage = language === 'en' ? 'vi' : 'en';
    console.log('Setting language to:', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      aria-label={`Switch to ${language === 'en' ? 'Vietnamese' : 'English'}`}
    >
      <span className="text-lg">
        {language === 'en' ? '🇻🇳' : '🇺🇸'}
      </span>
      <span className="hidden sm:inline">
        {language === 'en' ? 'Tiếng Việt' : 'English'}
      </span>
    </button>
  );
}
