'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './top-nav';
import AnnouncementBanner from './announcement-banner';
import VisaBanner from './visa-banner';
import RsvpClosedBanner from './rsvp-closed-banner';
import MobileMenu from './mobile-menu';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isHomePage = pathname === '/';
  
  // Start with true (dismissed) by default to prevent flash
  const [isBannerDismissed, setIsBannerDismissed] = useState(true);
  const [isVisaBannerDismissed, setIsVisaBannerDismissed] = useState(true);
  const [isRsvpBannerDismissed, setIsRsvpBannerDismissed] = useState(true);

  useEffect(() => {
    // Check localStorage after mount
    const dismissed = localStorage.getItem('banner-dismissed') === 'true';
    setIsBannerDismissed(dismissed);
    
    const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
    setIsVisaBannerDismissed(visaDismissed);

    const rsvpDismissed = localStorage.getItem('rsvp-banner-dismissed') === 'true';
    setIsRsvpBannerDismissed(rsvpDismissed);

    // Listen for storage changes (in case dismissed in another tab)
    const handleStorageChange = () => {
      const dismissed = localStorage.getItem('banner-dismissed') === 'true';
      setIsBannerDismissed(dismissed);
      
      const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
      setIsVisaBannerDismissed(visaDismissed);

      const rsvpDismissed = localStorage.getItem('rsvp-banner-dismissed') === 'true';
      setIsRsvpBannerDismissed(rsvpDismissed);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleBannerDismiss = () => {
      setIsBannerDismissed(true);
    };
    const handleBannerShown = () => {
      setIsBannerDismissed(false);
    };
    const handleVisaBannerDismiss = () => {
      setIsVisaBannerDismissed(true);
    };
    const handleVisaBannerShown = () => {
      setIsVisaBannerDismissed(false);
    };
    const handleRsvpBannerDismiss = () => {
      setIsRsvpBannerDismissed(true);
    };
    const handleRsvpBannerShown = () => {
      setIsRsvpBannerDismissed(false);
    };
    window.addEventListener('banner-dismissed', handleBannerDismiss);
    window.addEventListener('banner-shown', handleBannerShown);
    window.addEventListener('visa-banner-dismissed', handleVisaBannerDismiss);
    window.addEventListener('visa-banner-shown', handleVisaBannerShown);
    window.addEventListener('rsvp-banner-dismissed', handleRsvpBannerDismiss);
    window.addEventListener('rsvp-banner-shown', handleRsvpBannerShown);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('banner-dismissed', handleBannerDismiss);
      window.removeEventListener('banner-shown', handleBannerShown);
      window.removeEventListener('visa-banner-dismissed', handleVisaBannerDismiss);
      window.removeEventListener('visa-banner-shown', handleVisaBannerShown);
      window.removeEventListener('rsvp-banner-dismissed', handleRsvpBannerDismiss);
      window.removeEventListener('rsvp-banner-shown', handleRsvpBannerShown);
    };
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Adjust padding based on banner state
  // Calculate how many banners are visible
  const visibleBanners =
    (!isBannerDismissed ? 1 : 0) +
    (!isVisaBannerDismissed ? 1 : 0) +
    (!isRsvpBannerDismissed ? 1 : 0);
  // pt-28 when one banner visible (banner ~40px + nav ~80px), pt-36 when two banners visible, pt-20 when dismissed (nav only)
  // pt-44 when three banners visible (adds another ~40px banner offset)
  const mainPadding =
    isHomePage
      ? ''
      : visibleBanners === 0
        ? 'pt-20'
        : visibleBanners === 1
          ? 'pt-28'
          : visibleBanners === 2
            ? 'pt-36'
            : 'pt-44';

  return (
    <div className="relative">
      <AnnouncementBanner />
      <VisaBanner />
      <RsvpClosedBanner />
      <TopNav isBannerDismissed={isBannerDismissed && isVisaBannerDismissed} visibleBanners={visibleBanners} />
      <MobileMenu />
      <main className={`min-h-screen ${mainPadding}`} suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
