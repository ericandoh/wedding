export default function Schedule() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Schedule
        </h1>
        <p className="text-body text-xl text-gray-600">
          Join us for our wedding celebrations
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          {/* Invitation Card Container */}
          <div className="mx-auto max-w-2xl">
            {/* Decorative Border */}
            <div className="border-2 border-gray-300 p-8 shadow-lg">
              {/* Tea Ceremony */}
              <div className="mb-16 text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 h-px w-24 bg-gray-400"></div>
                  <h2 className="text-title text-5xl font-bold text-gray-800">
                    Tea Ceremony
                  </h2>
                  <div className="mx-auto mt-4 h-px w-24 bg-gray-400"></div>
                </div>
                
                <div className="mb-8 space-y-3">
                  <p className="text-body text-2xl text-gray-700">
                    Hang's Familial Home
                  </p>
                  <p className="text-body text-xl text-gray-600">
                    Sa Dec, Vietnam
                  </p>
                  <p className="text-body text-xl font-semibold text-gray-800">
                    May 20th, 2026
                  </p>
                </div>
                
                <div className="mx-auto max-w-sm">
                  <div className="space-y-4 text-center">
                    <div className="text-body text-gray-700">
                      TODO PM - Groom procession
                    </div>
                    <div className="text-body text-gray-700">
                      TODO PM - Exchange of gifts
                    </div>
                    <div className="text-body text-gray-700">
                      TODO PM - Lunch
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="my-12 flex items-center justify-center">
                <div className="h-px w-32 bg-gray-300"></div>
                <div className="mx-4 text-2xl text-gray-400">❦</div>
                <div className="h-px w-32 bg-gray-300"></div>
              </div>

              {/* Western Wedding */}
              <div className="mb-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 h-px w-24 bg-gray-400"></div>
                  <h2 className="text-title text-5xl font-bold text-gray-800">
                    Western Wedding
                  </h2>
                  <div className="mx-auto mt-4 h-px w-24 bg-gray-400"></div>
                </div>
                
                <div className="mb-8 space-y-3">
                  <p className="text-body text-2xl text-gray-700">
                    Fusion Resorts & Spa
                  </p>
                  <p className="text-body text-xl text-gray-600">
                    Da Nang, Vietnam
                  </p>
                  <p className="text-body text-xl font-semibold text-gray-800">
                    May 23rd, 2026
                  </p>
                </div>
                
                <div className="mx-auto max-w-sm">
                  <div className="space-y-4 text-center">
                    <div className="text-body text-gray-700">
                      TODO PM - Ceremony
                    </div>
                    <div className="text-body text-gray-700">
                      TODO PM - Dinner
                    </div>
                    <div className="text-body text-gray-700">
                      TODO PM - Afterparty
                    </div>
                    <div className="text-body text-gray-700">
                      <span className="italic">TODO PM - (optional) Post Wedding Brunch</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="mt-8 text-center">
                <div className="mx-auto h-px w-16 bg-gray-400"></div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 text-center">
              <p className="text-body text-lg text-gray-600">
                More details about timing and logistics will be shared closer to the events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
