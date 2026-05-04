'use client';

import { useLanguage } from '../_components/language-provider';
import PhotosSection from '../_components/photos-section';
import SeatingChart from '../_components/seating-chart';

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
          <section className="mb-16" aria-labelledby="seating-chart-heading">
            <h2
              id="seating-chart-heading"
              className="text-title text-3xl font-bold text-gray-800 mb-6 text-center"
            >
              {t.seatingChart}
            </h2>
            <div className="mx-auto max-w-5xl">
              <SeatingChart
                seatingLeftTable={t.seatingLeftTable}
                seatingRightTable={t.seatingRightTable}
                seatingChartLoading={t.seatingChartLoading}
                seatingChartError={t.seatingChartError}
                seatingChartEmpty={t.seatingChartEmpty}
                seatingChartNoNamesForTable={t.seatingChartNoNamesForTable}
                danceFloor={t.danceFloor}
                seatingFindSeatFor={t.seatingFindSeatFor}
                seatingFindSeatPlaceholder={t.seatingFindSeatPlaceholder}
                clearSearchLabel={t.close}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
