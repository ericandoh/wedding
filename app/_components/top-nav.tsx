'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function TopNav() {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <nav className="border-b border-gray-200/50 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center">
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
          className={`scrollbar-hide flex items-center space-x-8 overflow-x-auto ${
            showLeftArrow ? 'pl-12' : 'pl-0'
          } ${showRightArrow ? 'pr-12' : 'pr-0'}`}
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Link
            href="/"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/rsvp"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            RSVP
          </Link>
          <Link
            href="/schedule"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Schedule
          </Link>
          <Link
            href="/our-story"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            About the Couple
          </Link>
          <Link
            href="/venue"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Venue
          </Link>
          <Link
            href="/things-to-do"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Things to do
          </Link>
          <Link
            href="/registry"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Registry
          </Link>
          <Link
            href="/qa"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Q&A
          </Link>
          <Link
            href="/chatbot"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Chatbot
          </Link>
          <Link
            href="/pet-cats"
            className="text-body whitespace-nowrap text-gray-600 transition-all duration-300 hover:text-gray-800 hover:underline hover:underline-offset-4"
          >
            Pet Cats
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
    </nav>
  );
}
