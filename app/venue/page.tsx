'use client';

import { useLanguage } from '../_components/language-provider';

export default function Venue() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Fusion Resort & Villas Da Nang
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
        <div className="mx-auto max-w-6xl px-6">
          {/* Map and Information Section - side by side on larger screens */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Google Maps Embed */}
            <div className="w-full lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.7871292971563!2d108.27981847591573!3d15.972489184693103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314211005cd2e2cf%3A0xf6b3cf9995e6db85!2sFusion%20Resort%20%26%20Villas%20Da%20Nang%20%E2%80%93%20Wellness%20Inclusive!5e0!3m2!1sen!2sus!4v1761203425097!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fusion Resort & Villas Da Nang Location"
                ></iframe>
              </div>
            </div>

            {/* Venue Information Table */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-title text-3xl font-bold text-gray-800 mb-6 text-center">
                {t.venueInformation}
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                    {t.address}
                  </h3>
                  <p className="text-body text-lg text-gray-600">
                    {t.venueAddress}
                  </p>
                </div>

                {/* Website */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                    {t.website}
                  </h3>
                  <a 
                    href={`https://${t.venueWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {t.venueWebsite}
                  </a>
                </div>

                {/* Booking Link */}
                <div className="pb-4">
                  <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                    {t.bookingLink}
                  </h3>
                  <p className="text-body text-lg text-gray-600">
                    {t.comingSoon}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
