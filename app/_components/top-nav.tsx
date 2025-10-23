'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { useLanguage } from './language-provider';
import LanguageSwitcher from './language-switcher';

export default function TopNav() {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // Use white text on home page, dark text on other pages
  const isHomePage = pathname === '/';
  const textColorBase = isHomePage ? 'text-white' : 'text-gray-600';
  const textColorActive = isHomePage ? 'text-white' : 'text-gray-800';

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 ${isHomePage ? '' : 'bg-white'}`}>
      <div className="relative flex items-center justify-center px-6 py-4 w-full">
        {/* Navigation Links Container */}
        <div className="relative flex items-center justify-center min-w-0">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className={`absolute left-0 z-10 rounded-full ${isHomePage ? 'bg-black/30' : 'bg-white/90'} p-2 ${textColorBase} shadow-sm transition-colors hover:${textColorActive}`}
              aria-label="Scroll left"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Navigation Links */}
          <div
            ref={scrollContainerRef}
            className={`scrollbar-hide flex items-center space-x-8 overflow-x-auto ${
              showLeftArrow ? 'pl-12' : 'pl-0'
            } ${showRightArrow ? 'pr-12' : 'pr-0'}`}
            onScroll={checkScrollPosition}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {/* Language Switcher */}
          <div className="flex-shrink-0">
            <LanguageSwitcher />
          </div>
          <Link
            href="/"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.home}
          </Link>
          <Link
            href="/save-the-date"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/rsvp') || isActive('/save-the-date')
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {pathname === '/rsvp' ? t.rsvp : t.saveTheDateNav}
          </Link>
          <Link
            href="/schedule"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/schedule') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.schedule}
          </Link>
          <Link
            href="/venue"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/venue') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.venue}
          </Link>
          <Link
            href="/things-to-do"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/things-to-do') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.thingsToDo}
          </Link>
          <Link
            href="/registry"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/registry') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.registry}
          </Link>
          <Link
            href="/qa"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/qa') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.qa}
          </Link>
          <Link
            href="/pet-cats"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:${textColorActive} hover:underline hover:underline-offset-4 ${
              isActive('/pet-cats') 
                ? `${textColorActive} underline underline-offset-4` 
                : textColorBase
            }`}
          >
            {t.petCats}
          </Link>
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className={`absolute right-0 z-10 rounded-full ${isHomePage ? 'bg-black/30' : 'bg-white/90'} p-2 ${textColorBase} shadow-sm transition-colors hover:${textColorActive}`}
              aria-label="Scroll right"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
