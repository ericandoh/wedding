'use client';

import { useLanguage } from '../_components/language-provider';

export default function ThingsToDo() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.thingsToDoTitle}
        </h1>
        <p className="text-body text-xl text-gray-600">
          {t.activitiesAndRecommendations}
        </p>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <img
          src="/what_to_do.JPG"
          alt={t.whatToDoInDaNang}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Places of Interest Section */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="flex-1">
              <img
                src="/fusion_resort_things_to_do.jpg"
                alt={t.placesOfInterest}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                {t.placesOfInterest}
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                {t.daNangDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
