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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-6 py-4">
        {/* Navigation Links Container */}
        <div className="relative flex items-center justify-center min-w-0 w-full">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition-colors hover:text-gray-800"
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
            className={`scrollbar-hide flex items-center space-x-8 overflow-x-auto w-full ${
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
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.home}
          </Link>
          <Link
            href="/rsvp"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/rsvp') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.rsvp}
          </Link>
          <Link
            href="/schedule"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/schedule') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.schedule}
          </Link>
          <Link
            href="/our-story"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/our-story') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.aboutTheCouple}
          </Link>
          <Link
            href="/venue"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/venue') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.venue}
          </Link>
          <Link
            href="/things-to-do"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/things-to-do') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.thingsToDo}
          </Link>
          <Link
            href="/registry"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/registry') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.registry}
          </Link>
          <Link
            href="/qa"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/qa') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.qa}
          </Link>
          <Link
            href="/chatbot"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/chatbot') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.chatbot}
          </Link>
          <Link
            href="/pet-cats"
            className={`text-bar-header whitespace-nowrap transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4 ${
              isActive('/pet-cats') 
                ? 'text-gray-800 underline underline-offset-4' 
                : 'text-gray-600'
            }`}
          >
            {t.petCats}
          </Link>
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition-colors hover:text-gray-800"
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
