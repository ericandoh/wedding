'use client';

import { useLanguage } from '../_components/language-provider';

export default function Venue() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.venueTitle}
        </h1>
        <p className="text-body text-xl text-gray-600">
          {t.venueInformation}
        </p>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <img
          src="/fusion_resorts.jpg"
          alt={t.fusionResortsDaNangVenue}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-body mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            {t.venueDetailsComing}
          </p>
        </div>
      </div>
    </div>
  );
}
