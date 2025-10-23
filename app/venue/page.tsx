'use client';

import { useLanguage } from '../_components/language-provider';

export default function Venue() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
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
          src="/fusion_resorts_1.jpg"
          alt={t.fusionResortsDaNangVenue}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          {/* Venue Title */}
          <div className="mb-12 text-center">
            <h2 className="text-title mb-4 text-4xl font-bold text-gray-800">
              {t.fusionResortsVillasDaNang}
            </h2>
          </div>

          {/* Venue Information Card */}
          <div className="mb-12">
            <div className="mx-auto max-w-2xl">
              {/* Pearl White Card */}
              <div className="p-8 shadow-lg bg-gradient-to-b from-white/60 to-white/90 rounded-xl backdrop-blur-sm">
                {/* Address Section */}
                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 h-px w-24 bg-gray-300/40"></div>
                    <h3 className="text-title text-3xl font-bold text-gray-700">
                      {t.address}
                    </h3>
                    <div className="mx-auto mt-4 h-px w-24 bg-gray-300/40"></div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-body text-xl text-gray-700">
                      {t.venueAddress}
                    </p>
                  </div>
                </div>

                {/* Decorative Divider */}
                <div className="my-8 flex items-center justify-center">
                  <div className="h-px w-32 bg-gray-200/30"></div>
                  <div className="mx-4 text-2xl text-gray-400/50">❦</div>
                  <div className="h-px w-32 bg-gray-200/30"></div>
                </div>

                {/* Website Section */}
                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 h-px w-24 bg-gray-300/40"></div>
                    <h3 className="text-title text-3xl font-bold text-gray-700">
                      {t.website}
                    </h3>
                    <div className="mx-auto mt-4 h-px w-24 bg-gray-300/40"></div>
                  </div>
                  
                  <div className="mb-6">
                    <a 
                      href={`https://${t.venueWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-xl text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {t.venueWebsite}
                    </a>
                  </div>
                </div>

                {/* Decorative Divider */}
                <div className="my-8 flex items-center justify-center">
                  <div className="h-px w-32 bg-gray-200/30"></div>
                  <div className="mx-4 text-2xl text-gray-400/50">❦</div>
                  <div className="h-px w-32 bg-gray-200/30"></div>
                </div>

                {/* Booking Link Section */}
                <div className="mb-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 h-px w-24 bg-gray-300/40"></div>
                    <h3 className="text-title text-3xl font-bold text-gray-700">
                      {t.bookingLink}
                    </h3>
                    <div className="mx-auto mt-4 h-px w-24 bg-gray-300/40"></div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-body text-xl text-gray-700">
                      {t.comingSoon}
                    </p>
                  </div>
                </div>

                {/* Bottom Decoration */}
                <div className="mt-8 text-center">
                  <div className="mx-auto h-px w-16 bg-gray-300/40"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
