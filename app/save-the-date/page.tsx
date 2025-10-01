'use client';

import Link from 'next/link';
import { useLanguage } from '../_components/language-provider';

export default function SaveTheDate() {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.saveTheDateNav}
        </h1>
        <p className="text-subtitle text-xl text-gray-600">
          {t.saveTheDateSubtitle}
        </p>
      </div>

      <div className="flex-grow bg-white py-6">
        <div className="mx-auto max-w-2xl px-6 text-center">
          {/* Save the Date Image */}
          <div className="mb-8">
            <img
              src="/save_the_date.png"
              alt="Save the Date"
              className="mx-auto max-w-full h-auto"
            />
          </div>

          {/* Message */}
          <p className="text-body-lg mb-6 text-gray-700">
            {t.noRsvpNeededMessage}
          </p>

          {/* RSVP Anyways Button */}
          <Link
            href="/rsvp"
            className="text-button inline-block border border-gray-400 px-4 py-2 text-sm text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-gray-800"
          >
            {t.rsvpAnyways}
          </Link>
        </div>
      </div>
    </div>
  );
}
