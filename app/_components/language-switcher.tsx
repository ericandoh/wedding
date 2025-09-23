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
      className="flex items-center space-x-2 rounded-md px-3 py-2 text-bar-header text-gray-600 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50 hover:underline hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
