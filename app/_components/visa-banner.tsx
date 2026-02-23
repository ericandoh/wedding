'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './language-provider';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function VisaBanner() {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // Start with false (hidden) by default to prevent flash
  const [isVisible, setIsVisible] = useState(false);
  const [announcementBannerVisible, setAnnouncementBannerVisible] = useState(false);
  
  // Check localStorage after mount and show banner if not dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
    const announcementDismissed = localStorage.getItem('banner-dismissed') === 'true';
    setAnnouncementBannerVisible(!announcementDismissed);
    
    if (!dismissed) {
      setIsVisible(true);
      // Dispatch event to notify layout
      window.dispatchEvent(new Event('visa-banner-shown'));
    }
    
    // Listen for announcement banner changes
    const handleAnnouncementBannerChange = () => {
      const announcementDismissed = localStorage.getItem('banner-dismissed') === 'true';
      setAnnouncementBannerVisible(!announcementDismissed);
    };
    
    window.addEventListener('banner-dismissed', handleAnnouncementBannerChange);
    window.addEventListener('banner-shown', handleAnnouncementBannerChange);
    window.addEventListener('storage', handleAnnouncementBannerChange);
    
    return () => {
      window.removeEventListener('banner-dismissed', handleAnnouncementBannerChange);
      window.removeEventListener('banner-shown', handleAnnouncementBannerChange);
      window.removeEventListener('storage', handleAnnouncementBannerChange);
    };
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('visa-banner-dismissed', 'true');
    // Dispatch custom event to notify layout
    window.dispatchEvent(new Event('visa-banner-dismissed'));
  };
  
  if (!isVisible) return null;
  
  // Use white text on home page, dark text on other pages
  const isHomePage = pathname === '/';
  const textColor = isHomePage ? 'text-white' : 'text-gray-800';
  const bgColor = isHomePage ? 'bg-gray-800/50' : 'bg-gray-200/50';

  // Position below announcement banner if it's visible
  const topPosition = announcementBannerVisible ? 'top-10' : 'top-0';
  
  return (
    <div className={`absolute ${topPosition} left-0 right-0 z-50 ${bgColor}`}>
      <div className="flex items-center justify-center px-4 py-2 relative">
        <p className={`text-body-sm text-center ${textColor}`}>
          <Link 
            href="/evisa" 
            className="underline hover:opacity-80 transition-opacity font-semibold"
          >
            {t.visaBanner}
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className={`absolute right-4 p-1 hover:bg-gray-500/20 rounded transition-colors ${textColor}`}
          aria-label="Dismiss banner"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
