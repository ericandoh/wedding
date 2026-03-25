'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './language-provider';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function RsvpClosedBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  // Start with false (hidden) by default to prevent flash
  const [isVisible, setIsVisible] = useState(false);
  const [announcementBannerVisible, setAnnouncementBannerVisible] = useState(false);
  const [visaBannerVisible, setVisaBannerVisible] = useState(false);

  useEffect(() => {
    const announcementDismissed = localStorage.getItem('banner-dismissed') === 'true';
    const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
    const dismissed = localStorage.getItem('rsvp-banner-dismissed') === 'true';

    setAnnouncementBannerVisible(!announcementDismissed);
    setVisaBannerVisible(!visaDismissed);

    if (!dismissed) {
      setIsVisible(true);
      window.dispatchEvent(new Event('rsvp-banner-shown'));
    }

    const handleAnnouncementBannerChange = () => {
      const announcementDismissed = localStorage.getItem('banner-dismissed') === 'true';
      const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
      setAnnouncementBannerVisible(!announcementDismissed);
      setVisaBannerVisible(!visaDismissed);
    };

    window.addEventListener('banner-dismissed', handleAnnouncementBannerChange);
    window.addEventListener('banner-shown', handleAnnouncementBannerChange);
    window.addEventListener('visa-banner-dismissed', handleAnnouncementBannerChange);
    window.addEventListener('visa-banner-shown', handleAnnouncementBannerChange);
    window.addEventListener('storage', handleAnnouncementBannerChange);

    return () => {
      window.removeEventListener('banner-dismissed', handleAnnouncementBannerChange);
      window.removeEventListener('banner-shown', handleAnnouncementBannerChange);
      window.removeEventListener('visa-banner-dismissed', handleAnnouncementBannerChange);
      window.removeEventListener('visa-banner-shown', handleAnnouncementBannerChange);
      window.removeEventListener('storage', handleAnnouncementBannerChange);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('rsvp-banner-dismissed', 'true');
    window.dispatchEvent(new Event('rsvp-banner-dismissed'));
  };

  const isHomePage = pathname === '/';
  const textColor = isHomePage ? 'text-white' : 'text-gray-800';
  const bgColor = isHomePage ? 'bg-gray-800/50' : 'bg-gray-200/50';

  // Each banner uses top-10 (2.5rem = 40px). Stack below the banners above it.
  const topPx = useMemo(() => (announcementBannerVisible ? 40 : 0) + (visaBannerVisible ? 40 : 0), [
    announcementBannerVisible,
    visaBannerVisible,
  ]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute left-0 right-0 z-50 ${bgColor} cursor-pointer`}
      style={{ top: `${topPx}px` }}
      onClick={() => router.push('/rsvp')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push('/rsvp');
      }}
    >
      <div className="flex items-center justify-center px-4 py-2 relative">
        <p className={`text-body-sm text-center ${textColor} underline hover:opacity-80 transition-opacity font-semibold`}>
          {t.rsvpClosedBanner}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className={`absolute right-4 p-1 hover:bg-gray-500/20 rounded transition-colors ${textColor}`}
          aria-label="Dismiss banner"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

