'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from './language-provider';
import LanguageSwitcher from './language-switcher';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { href: '/', label: t.home },
    { href: '/rsvp', label: t.rsvp },
    { href: '/schedule', label: t.schedule },
    { href: '/travel', label: t.venue },
    { href: '/things-to-do', label: t.thingsToDo },
    { href: '/registry', label: t.registry },
    { href: '/qa', label: t.qa },
    { href: '/message-board', label: t.messageBoard },
    { href: '/pet-cats', label: t.petCats },
  ];

  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <>
      {/* Floating Menu Button - Only visible on mobile */}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }}
        className="fixed bottom-6 left-6 z-50 md:hidden flex items-center justify-center w-14 h-14 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 transition-transform duration-300 rotate-0" />
        ) : (
          <Bars3Icon className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>

      {/* Sidebar Overlay */}
      {(isOpen || isAnimating) && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
          />
          
          {/* Sidebar */}
          <div
            className={`fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
              isAnimating ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-title text-xl font-bold text-gray-800">
                  Menu
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Language Switcher */}
              <div className="p-4 border-b border-gray-200">
                <LanguageSwitcher showText={true} />
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className={`block px-4 py-3 rounded-lg text-body text-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-gray-100 text-gray-800 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

