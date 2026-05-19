'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useState } from 'react';
import { useLanguage } from '../_components/language-provider';
import PhotosSection from '../_components/photos-section';

const FLYER_SRC = '/Tea_Ceremony_Flyer_A4.png';
const SEATING_CHART_SRC = '/tea%20ceremony%20seating%20chart.jpeg';

type LightboxImage = {
  src: string;
  title: string;
};

export default function TeaCeremonyPage() {
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    if (lightbox) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [lightbox]);

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
            aria-labelledby="tea-ceremony-seating-heading"
          >
            <h2
              id="tea-ceremony-seating-heading"
              className="text-title mb-4 text-center text-3xl font-bold text-gray-800"
            >
              {t.teaCeremonySeatingChartSectionTitle}
            </h2>
            <div className="overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    src: SEATING_CHART_SRC,
                    title: t.teaCeremonySeatingChartDocumentTitle,
                  })
                }
                className="group relative block w-full cursor-zoom-in p-0 text-left outline-none ring-gray-400 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-expanded={lightbox?.src === SEATING_CHART_SRC}
                aria-haspopup="dialog"
                aria-label={t.teaCeremonySeatingChartOpenFullscreen}
              >
                <img
                  src={SEATING_CHART_SRC}
                  alt={t.teaCeremonySeatingChartDocumentTitle}
                  className="mx-auto block h-auto w-full max-w-3xl"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm">
                  {t.teaCeremonySeatingChartOpenFullscreen}
                </span>
              </button>
            </div>
          </section>

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
                onClick={() =>
                  setLightbox({
                    src: FLYER_SRC,
                    title: t.teaCeremonyFlyerDocumentTitle,
                  })
                }
                className="group relative block w-full cursor-zoom-in p-0 text-left outline-none ring-gray-400 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-expanded={lightbox?.src === FLYER_SRC}
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

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setLightbox(null)}
        >
          <h2 id={titleId} className="sr-only">
            {lightbox.title}
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white outline-none ring-white/40 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:right-5 sm:top-5"
            aria-label={t.close}
          >
            <XMarkIcon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
          </button>
          <img
            src={lightbox.src}
            alt=""
            className="max-h-[min(100dvh-5rem,100vh-5rem)] max-w-full cursor-default object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
