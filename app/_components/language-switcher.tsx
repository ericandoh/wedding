'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from './language-provider';

interface LanguageSwitcherProps {
  showText?: boolean;
}

export default function LanguageSwitcher({ showText = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  
  // Use white text on home page, dark text on other pages
  const isHomePage = pathname === '/';
  const textColorBase = isHomePage ? 'text-white' : 'text-gray-600';
  const textColorHover = isHomePage ? 'text-white' : 'text-gray-800';
  const bgHover = isHomePage ? 'bg-black/20' : 'bg-gray-50';

  const toggleLanguage = () => {
    console.log('Current language:', language);
    const newLanguage = language === 'en' ? 'vi' : 'en';
    console.log('Setting language to:', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 rounded-md px-3 py-2 text-bar-header ${textColorBase} transition-all duration-300 hover:${textColorHover} hover:${bgHover} hover:underline hover:underline-offset-4 focus:outline-none ${isHomePage ? 'focus:ring-white' : 'focus:ring-gray-500'} focus:ring-2 focus:ring-offset-2`}
      aria-label={`Switch to ${language === 'en' ? 'Vietnamese' : 'English'}`}
    >
      <span className="text-lg">
        {language === 'en' ? '🇻🇳' : '🇺🇸'}
      </span>
      {showText && (
        <span>
          {language === 'en' ? 'Tiếng Việt' : 'English'}
        </span>
      )}
    </button>
  );
}
