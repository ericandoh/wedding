'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './top-nav';
import AnnouncementBanner from './announcement-banner';
import VisaBanner from './visa-banner';
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

  useEffect(() => {
    // Check localStorage after mount
    const dismissed = localStorage.getItem('banner-dismissed') === 'true';
    setIsBannerDismissed(dismissed);
    
    const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
    setIsVisaBannerDismissed(visaDismissed);

    // Listen for storage changes (in case dismissed in another tab)
    const handleStorageChange = () => {
      const dismissed = localStorage.getItem('banner-dismissed') === 'true';
      setIsBannerDismissed(dismissed);
      
      const visaDismissed = localStorage.getItem('visa-banner-dismissed') === 'true';
      setIsVisaBannerDismissed(visaDismissed);
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
    window.addEventListener('banner-dismissed', handleBannerDismiss);
    window.addEventListener('banner-shown', handleBannerShown);
    window.addEventListener('visa-banner-dismissed', handleVisaBannerDismiss);
    window.addEventListener('visa-banner-shown', handleVisaBannerShown);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('banner-dismissed', handleBannerDismiss);
      window.removeEventListener('banner-shown', handleBannerShown);
      window.removeEventListener('visa-banner-dismissed', handleVisaBannerDismiss);
      window.removeEventListener('visa-banner-shown', handleVisaBannerShown);
    };
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Adjust padding based on banner state
  // Calculate how many banners are visible
  const visibleBanners = (!isBannerDismissed ? 1 : 0) + (!isVisaBannerDismissed ? 1 : 0);
  // pt-28 when one banner visible (banner ~40px + nav ~80px), pt-36 when two banners visible, pt-20 when dismissed (nav only)
  const mainPadding = isHomePage ? '' : (visibleBanners === 0 ? 'pt-20' : visibleBanners === 1 ? 'pt-28' : 'pt-36');

  return (
    <div className="relative">
      <AnnouncementBanner />
      <VisaBanner />
      <TopNav isBannerDismissed={isBannerDismissed && isVisaBannerDismissed} visibleBanners={visibleBanners} />
      <MobileMenu />
      <main className={`min-h-screen ${mainPadding}`} suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
