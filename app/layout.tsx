import '#/styles/globals.css';

import { Metadata } from 'next';
import {
  Charm,
  Cormorant_Garamond,
  Dancing_Script,
  Eagle_Lake,
  Inter,
  Allura,
  Great_Vibes,
  Luxurious_Roman,
  Moon_Dance,
  Satisfy,
} from 'next/font/google';
import { AuthProvider } from './_components/auth-provider';
import { LanguageProvider } from './_components/language-provider';
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

const eagleLake = Eagle_Lake({
  variable: '--font-eagle-lake',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const charm = Charm({
  variable: '--font-charm',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const moonDance = Moon_Dance({
  variable: '--font-moon-dance',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const luxuriousRoman = Luxurious_Roman({
  variable: '--font-luxurious-roman',
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
  icons: {
    icon: '/gallery22.ico',
    apple: '/gallery22.jpg',
  },
  openGraph: {
    title: "Eric + Hang's Wedding",
    description:
      'Join us in celebrating our special day! RSVP, view our schedule, and learn more about our wedding.',
    images: ['/gallery22.jpg'],
  },
  twitter: { 
    card: 'summary_large_image',
    images: ['/gallery22.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body
        className={`bg-white font-sans ${cormorantGaramond.variable} ${dancingScript.variable} ${inter.variable} ${allura.variable} ${greatVibes.variable} ${satisfy.variable} ${eagleLake.variable} ${charm.variable} ${moonDance.variable} ${luxuriousRoman.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
