'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function TopNav() {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 p-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/90 rounded-full shadow-sm"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Navigation Links */}
        <div 
          ref={scrollContainerRef}
          className={`flex items-center space-x-8 overflow-x-auto scrollbar-hide ${
            showLeftArrow ? 'pl-12' : 'pl-0'
          } ${
            showRightArrow ? 'pr-12' : 'pr-0'
          }`}
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Home
          </Link>
          <Link 
            href="/rsvp" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            RSVP
          </Link>
          <Link 
            href="/schedule" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Schedule
          </Link>
          <Link 
            href="/our-story" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Our Story
          </Link>
          <Link 
            href="/venue" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Venue
          </Link>
          <Link 
            href="/things-to-do" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Things to do
          </Link>
          <Link 
            href="/registry" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Registry
          </Link>
          <Link 
            href="/qa" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Q&A
          </Link>
          <Link 
            href="/chatbot" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Chatbot
          </Link>
          <Link 
            href="/pet-cats" 
            className="text-gray-600 hover:text-gray-800 transition-colors font-satisfy font-medium whitespace-nowrap"
          >
            Pet Cats
          </Link>
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 p-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/90 rounded-full shadow-sm"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}
