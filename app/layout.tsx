import '#/styles/globals.css';

import { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Dancing_Script,
  Inter,
  Allura,
  Great_Vibes,
  Satisfy,
} from 'next/font/google';
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

const allura = Allura({
  variable: '--font-allura',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const satisfy = Satisfy({
  variable: '--font-satisfy',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Eric + Hang's Wedding",
    template: "%s | Eric + Hang's Wedding",
  },
  metadataBase: new URL('https://your-wedding-site.vercel.app'),
  description:
    'Join us in celebrating our special day! RSVP, view our schedule, and learn more about our wedding.',
  openGraph: {
    title: "Eric + Hang's Wedding",
    description:
      'Join us in celebrating our special day! RSVP, view our schedule, and learn more about our wedding.',
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
        className={`bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans ${cormorantGaramond.variable} ${dancingScript.variable} ${inter.variable} ${allura.variable} ${greatVibes.variable} ${satisfy.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
