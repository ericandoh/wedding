'use client';

import { useLanguage } from '../_components/language-provider';
import PhotosSection from '../_components/photos-section';

export default function TeaCeremonyPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-title text-5xl font-bold text-gray-800 mb-12 text-center">
            {t.teaCeremony}
          </h1>

          <PhotosSection />
        </div>
      </div>
    </div>
  );
}
