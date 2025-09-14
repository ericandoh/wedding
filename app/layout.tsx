import '#/styles/globals.css';

import Byline from '#/ui/byline';
import { Metadata } from 'next';
import { Cormorant_Garamond, Dancing_Script, Inter } from 'next/font/google';
import { AuthProvider } from './_components/auth-provider';
import ConditionalLayout from './_components/conditional-layout';

const cormorantGaramond = Cormorant_Garamond({ 
  variable: '--font-cormorant', 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const dancingScript = Dancing_Script({ 
  variable: '--font-dancing', 
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({ 
  variable: '--font-inter', 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: "Eric + Hang's Wedding", template: "%s | Eric + Hang's Wedding" },
  metadataBase: new URL('https://your-wedding-site.vercel.app'),
  description: 'Join us in celebrating our special day! RSVP, view our schedule, and learn more about our wedding.',
  openGraph: {
    title: "Eric + Hang's Wedding",
    description: 'Join us in celebrating our special day! RSVP, view our schedule, and learn more about our wedding.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body
        className={`bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 font-sans ${cormorantGaramond.variable} ${dancingScript.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
