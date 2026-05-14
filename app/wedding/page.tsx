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

          <PhotosSection sectionClassName="mb-8" />

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
                seatingBallroomTerrace={t.seatingBallroomTerrace}
                seatingMainEntrance={t.seatingMainEntrance}
                clearSearchLabel={t.close}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
