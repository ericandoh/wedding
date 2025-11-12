'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './top-nav';
import AnnouncementBanner from './announcement-banner';

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

  useEffect(() => {
    // Check localStorage after mount
    const dismissed = localStorage.getItem('banner-dismissed') === 'true';
    setIsBannerDismissed(dismissed);

    // Listen for storage changes (in case dismissed in another tab)
    const handleStorageChange = () => {
      const dismissed = localStorage.getItem('banner-dismissed') === 'true';
      setIsBannerDismissed(dismissed);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleBannerDismiss = () => {
      setIsBannerDismissed(true);
    };
    const handleBannerShown = () => {
      setIsBannerDismissed(false);
    };
    window.addEventListener('banner-dismissed', handleBannerDismiss);
    window.addEventListener('banner-shown', handleBannerShown);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('banner-dismissed', handleBannerDismiss);
      window.removeEventListener('banner-shown', handleBannerShown);
    };
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Adjust padding based on banner state
  // pt-28 when banner visible (banner ~40px + nav ~80px), pt-20 when dismissed (nav only)
  const mainPadding = isHomePage ? '' : (isBannerDismissed ? 'pt-20' : 'pt-28');

  return (
    <div className="relative">
      <AnnouncementBanner />
      <TopNav isBannerDismissed={isBannerDismissed} />
      <main className={`min-h-screen ${mainPadding}`} suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
