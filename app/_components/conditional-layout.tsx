'use client';

import { usePathname } from 'next/navigation';
import TopNav from './top-nav';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <TopNav />
      <main className="min-h-screen pt-20">
        {children}
      </main>
    </div>
  );
}
