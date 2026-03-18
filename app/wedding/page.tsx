'use client';

import { useLanguage } from '../_components/language-provider';
import { PhotoIcon } from '@heroicons/react/24/outline';
import PhotosSection from '../_components/photos-section';

export default function Wedding() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-title text-5xl font-bold text-gray-800 mb-12 text-center">
            {t.weddingTitle}
          </h1>

          <PhotosSection />

          {/* Decorative Divider */}
          <div className="my-12 flex items-center justify-center">
            <div className="h-px w-32 bg-gray-200/30" />
            <div className="mx-4 text-2xl text-gray-400/50">❦</div>
            <div className="h-px w-32 bg-gray-200/30" />
          </div>

          {/* Seating Chart Section */}
          <section className="mb-16">
            <h2 className="text-title text-3xl font-bold text-gray-800 mb-6 text-center">
              {t.seatingChart}
            </h2>
            <div className="mx-auto max-w-4xl">
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-body text-gray-400">Seating chart</p>
                  <p className="text-body text-sm text-gray-300 mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
