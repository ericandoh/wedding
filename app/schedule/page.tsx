'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';
import { 
  HandRaisedIcon,
  Squares2X2Icon,
  SparklesIcon,
  CameraIcon,
  BeakerIcon,
  CakeIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

export default function Schedule() {
  const { t } = useLanguage();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [visibleTeaItems, setVisibleTeaItems] = useState<number[]>([]);

  // Animate western wedding timeline items
  useEffect(() => {
    const totalItems = 7;
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < totalItems; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * 200); // 0.2 seconds per item
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Animate tea ceremony timeline items (starts after western wedding)
  useEffect(() => {
    const totalTeaItems = 3;
    const timers: NodeJS.Timeout[] = [];
    const startDelay = 1400; // Start after western wedding animation (7 * 200)
    
    for (let i = 0; i < totalTeaItems; i++) {
      const timer = setTimeout(() => {
        setVisibleTeaItems(prev => [...prev, i]);
      }, startDelay + (i * 200));
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="flex-grow bg-white">
        <div className="mx-auto max-w-6xl px-6">
          {/* Pearl White Schedule Card */}
          <div className="mx-auto">
            <div className="py-4">
              {/* Western Wedding */}
              <div className="mb-4 text-center">
                <div className="mb-6">
                  <h2 className="text-title text-3xl font-bold text-gray-800">
                    {t.westernWedding}
                  </h2>
                  <p className="text-body text-xl text-gray-600 mt-2">
                    {t.fusionResortsAndSpa}, {t.daNangVietnam} · {t.may23rd2026Schedule}
                  </p>
                </div>
                
                {/* Timeline */}
                <div className="mx-auto max-w-3xl">
                  <div className="relative w-full">
                    {/* Central Line */}
                    <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-0.5"></div>
                    
                    {/* Timeline Events */}
                    <div className="space-y-8">
                    {/* Event 1: Guest Arrival */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <HandRaisedIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          3:00 – 3:45 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.guestArrivalWelcome}
                        </div>
                      </div>
                    </div>

                    {/* Event 2: Guests Seated */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <Squares2X2Icon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          3:45 – 4:00 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.guestsAreSeated}
                        </div>
                      </div>
                    </div>

                    {/* Event 3: Exchange of Vows */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <SparklesIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          4:00 – 4:30 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.exchangeOfVows}
                        </div>
                      </div>
                    </div>

                    {/* Event 4: Photography */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <CameraIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          4:30 – 5:00 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.photographySession}
                        </div>
                      </div>
                    </div>

                    {/* Event 5: Cocktail Reception */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <BeakerIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          5:00 – 6:00 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.cocktailReception}
                        </div>
                      </div>
                    </div>

                    {/* Event 6: Dinner Reception */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <CakeIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          6:00 – 9:00 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.dinnerReception}
                        </div>
                      </div>
                    </div>

                    {/* Event 7: Dancing */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <MusicalNoteIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          After 9:00 PM
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.dancingEveningCelebration}
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="my-4 flex items-center justify-center">
                <div className="h-px w-32 bg-gray-200/30"></div>
                <div className="mx-4 text-2xl text-gray-400/50">❦</div>
                <div className="h-px w-32 bg-gray-200/30"></div>
              </div>

              {/* Tea Ceremony */}
              <div className="mb-8 text-center">
                <div className="mb-6">
                  <h2 className="text-title text-3xl font-bold text-gray-800">
                    {t.teaCeremony}
                  </h2>
                  <p className="text-body text-xl text-gray-600 mt-2">
                    {t.hangsFamilialHome}, {t.saDecVietnam} · {t.may20th2026}
                  </p>
                </div>
                
                {/* Tea Ceremony Timeline */}
                <div className="mx-auto max-w-5xl">
                  <div className="relative w-full">
                    {/* Central Line */}
                    <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-0.5"></div>
                    
                    {/* Timeline Events */}
                    <div className="space-y-8">
                    {/* Event 1: Groom Procession */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <UserGroupIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          TBD
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.groomProcession}
                        </div>
                      </div>
                    </div>

                    {/* Event 2: Exchange of Gifts */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <GiftIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          TBD
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.exchangeOfGifts}
                        </div>
                      </div>
                    </div>

                    {/* Event 3: Lunch */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <CakeIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          TBD
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.lunch}
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
