'use client';

import { useLanguage } from '../_components/language-provider';

export default function Schedule() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.scheduleTitle}
        </h1>
        <p className="text-body text-xl text-gray-600">
          {t.joinUsForCelebrations}
        </p>
        <p className="text-body text-lg text-gray-600 mt-4">
          {t.moreDetailsComing}
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          {/* Pearl White Schedule Card */}
          <div className="mx-auto max-w-2xl">
            <div className="p-8 shadow-lg bg-gradient-to-b from-white/60 to-white/90 rounded-xl backdrop-blur-sm">
              {/* Western Wedding */}
              <div className="mb-16 text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 h-px w-24 bg-gray-300/40"></div>
                  <h2 className="text-title text-4xl font-bold text-gray-700">
                    {t.westernWedding}
                  </h2>
                  <div className="mx-auto mt-4 h-px w-24 bg-gray-300/40"></div>
                </div>
                
                <div className="mb-8 space-y-3">
                  <p className="text-body text-2xl text-gray-700">
                    {t.fusionResortsAndSpa}
                  </p>
                  <p className="text-body text-xl text-gray-600">
                    {t.daNangVietnam}
                  </p>
                  <p className="text-body text-xl font-semibold text-gray-800">
                    {t.may23rd2026Schedule}
                  </p>
                </div>
                
                <div className="mx-auto max-w-md">
                  <div className="space-y-3 text-center">
                    <div className="text-body text-gray-700">
                      3:00 – 3:45 PM | {t.guestArrivalWelcome}
                    </div>
                    <div className="text-body text-gray-700">
                      3:45 – 4:00 PM | {t.guestsAreSeated}
                    </div>
                    <div className="text-body text-gray-700">
                      4:00 – 4:30 PM | {t.exchangeOfVows}
                    </div>
                    <div className="text-body text-gray-700">
                      4:30 – 5:00 PM | {t.photographySession}
                    </div>
                    <div className="text-body text-gray-700">
                      5:00 – 6:00 PM | {t.cocktailReception}
                    </div>
                    <div className="text-body text-gray-700">
                      6:00 – 9:00 PM | {t.dinnerReception}
                    </div>
                    <div className="text-body text-gray-700">
                      After 9:00 PM | {t.dancingEveningCelebration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="my-12 flex items-center justify-center">
                <div className="h-px w-32 bg-gray-200/30"></div>
                <div className="mx-4 text-2xl text-gray-400/50">❦</div>
                <div className="h-px w-32 bg-gray-200/30"></div>
              </div>

              {/* Tea Ceremony */}
              <div className="mb-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 h-px w-24 bg-gray-300/40"></div>
                  <h2 className="text-title text-4xl font-bold text-gray-700">
                    {t.teaCeremony}
                  </h2>
                  <div className="mx-auto mt-4 h-px w-24 bg-gray-300/40"></div>
                </div>
                
                <div className="mb-8 space-y-3">
                  <p className="text-body text-2xl text-gray-700">
                    {t.hangsFamilialHome}
                  </p>
                  <p className="text-body text-xl text-gray-600">
                    {t.saDecVietnam}
                  </p>
                  <p className="text-body text-xl font-semibold text-gray-800">
                    {t.may20th2026}
                  </p>
                </div>
                
                <div className="mx-auto max-w-sm">
                  <div className="space-y-4 text-center">
                    <div className="text-body text-gray-700">
                      ??:?? - {t.groomProcession}
                    </div>
                    <div className="text-body text-gray-700">
                      ??:?? - {t.exchangeOfGifts}
                    </div>
                    <div className="text-body text-gray-700">
                      ??:?? - {t.lunch}
                    </div>
                  </div>
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
  );
}
