'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useState } from 'react';
import { useLanguage } from '../_components/language-provider';
import PhotosSection from '../_components/photos-section';

const FLYER_SRC = '/Tea_Ceremony_Flyer_A4.png';

export default function TeaCeremonyPage() {
  const { t } = useLanguage();
  const [flyerOpen, setFlyerOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!flyerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFlyerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flyerOpen]);

  useEffect(() => {
    if (flyerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [flyerOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-title text-5xl font-bold text-gray-800 mb-12 text-center">
            {t.teaCeremony}
          </h1>

          <PhotosSection />

          <section
            className="mt-10 scroll-mt-8"
            aria-labelledby="tea-ceremony-flyer-heading"
          >
            <h2
              id="tea-ceremony-flyer-heading"
              className="text-title mb-4 text-center text-3xl font-bold text-gray-800"
            >
              {t.teaCeremonyFlyerSectionTitle}
            </h2>
            <div className="overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={() => setFlyerOpen(true)}
                className="group relative block w-full cursor-zoom-in p-0 text-left outline-none ring-gray-400 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-expanded={flyerOpen}
                aria-haspopup="dialog"
                aria-label={t.teaCeremonyFlyerOpenFullscreen}
              >
                <img
                  src={FLYER_SRC}
                  alt={t.teaCeremonyFlyerDocumentTitle}
                  className="mx-auto block h-auto w-full max-w-3xl"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm">
                  {t.teaCeremonyFlyerOpenFullscreen}
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {flyerOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setFlyerOpen(false)}
        >
          <h2 id={titleId} className="sr-only">
            {t.teaCeremonyFlyerDocumentTitle}
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFlyerOpen(false);
            }}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white outline-none ring-white/40 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:right-5 sm:top-5"
            aria-label={t.close}
          >
            <XMarkIcon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
          </button>
          <img
            src={FLYER_SRC}
            alt=""
            className="max-h-[min(100dvh-5rem,100vh-5rem)] max-w-full cursor-default object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
