'use client';

import { useState, useEffect, useRef } from 'react';
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
  GiftIcon,
  BuildingStorefrontIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Schedule() {
  const { t, language } = useLanguage();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [visibleTeaItems, setVisibleTeaItems] = useState<number[]>([]);
  const [visiblePreWelcomeItems, setVisiblePreWelcomeItems] = useState<number[]>([]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  const showLocationOnMap = (locationKey: string) => {
    setActiveLocation(locationKey);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fusionLocations: Record<
    string,
    { xPct: number; yPct: number; label: string }
  > = {
    charRestaurant: { xPct: 76.1, yPct: 47.9, label: t.charRestaurant },
    charLawn: { xPct: 77.7, yPct: 44.9, label: t.charLawn },
    resortLawn: { xPct: 76.1, yPct: 40.5, label: t.resortLawn },
    ballroom: { xPct: 28.6, yPct: 49.0, label: t.ballroom },
    lobbyEntrance: { xPct: 26.3, yPct: 40.15, label: t.lobbyEntrance },
  };

  const to24h = (hours: number, minutes: string, period: string): string => {
    let h = hours;
    const upper = period.toUpperCase();
    if (upper === 'PM' && h !== 12) h += 12;
    if (upper === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
  };

  // 24-hour format for Vietnamese, 12-hour for English
  const formatTime = (time12hr: string): string => {
    if (language === 'vi') {
      if (time12hr.includes('After')) {
        const match = time12hr.match(/After (\d{1,2}):(\d{2}) (AM|PM)/i);
        if (match) {
          return `Sau ${to24h(parseInt(match[1], 10), match[2], match[3])}`;
        }
        return time12hr;
      }

      const crossDayMatch = time12hr.match(
        /(\d{1,2}):(\d{2}) (AM|PM) – (\d{1,2}):(\d{2}) (AM|PM)/i
      );
      if (crossDayMatch) {
        const start = to24h(
          parseInt(crossDayMatch[1], 10),
          crossDayMatch[2],
          crossDayMatch[3]
        );
        const end = to24h(
          parseInt(crossDayMatch[4], 10),
          crossDayMatch[5],
          crossDayMatch[6]
        );
        return `${start} – ${end}`;
      }

      const rangeMatch = time12hr.match(
        /(\d{1,2}):(\d{2}) – (\d{1,2}):(\d{2}) (AM|PM)/i
      );
      if (rangeMatch) {
        const start = to24h(
          parseInt(rangeMatch[1], 10),
          rangeMatch[2],
          rangeMatch[5]
        );
        const end = to24h(
          parseInt(rangeMatch[3], 10),
          rangeMatch[4],
          rangeMatch[5]
        );
        return `${start} – ${end}`;
      }

      return time12hr;
    }
    return time12hr;
  };

  const generateGoogleCalendarLink = () => {
    const title = 'Hang & Eric Western Wedding';
    const location = 'Fusion Resort & Villas Da Nang, Trường Sa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng, Vietnam';
    const description = 'Join us for Hang and Eric\'s wedding celebration!';
    
    // May 23rd, 2026, 4:00 PM - 11:00 PM (Da Nang timezone is GMT+7)
    const startDate = '20260523T160000'; // 4:00 PM in Da Nang time
    const endDate = '20260523T230000'; // 11:00 PM in Da Nang time
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=Asia/Ho_Chi_Minh`;
    
    return googleUrl;
  };

  const generateICSFile = () => {
    const title = 'Hang & Eric Western Wedding';
    const location = 'Fusion Resort & Villas Da Nang, Trường Sa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng, Vietnam';
    const description = 'Join us for Hang and Eric\'s wedding celebration!';
    
    // Format: YYYYMMDDTHHMMSS
    const startDate = '20260523T160000';
    const endDate = '20260523T230000';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hang & Eric Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Ho_Chi_Minh',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZOFFSETFROM:+0700',
      'TZOFFSETTO:+0700',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Ho_Chi_Minh:${startDate}`,
      `DTEND;TZID=Asia/Ho_Chi_Minh:${endDate}`,
      `DTSTAMP:${timestamp}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hang-eric-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTeaCeremonyGoogleCalendarLink = () => {
    const title = 'Hang & Eric Tea Ceremony';
    const location = '220 Đường Lê Lợi, khóm 1, Sa Đéc, Đồng Tháp, Vietnam';
    const description = 'Join us for Hang and Eric\'s tea ceremony celebration!';
    
    const startDate = '20260520T080000';
    const endDate = '20260520T141500';

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=Asia/Ho_Chi_Minh`;
    
    return googleUrl;
  };

  const generateTeaCeremonyICSFile = () => {
    const title = 'Hang & Eric Tea Ceremony';
    const location = '220 Đường Lê Lợi, khóm 1, Sa Đéc, Đồng Tháp, Vietnam';
    const description = 'Join us for Hang and Eric\'s tea ceremony celebration!';
    
    const startDate = '20260520T080000';
    const endDate = '20260520T141500';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hang & Eric Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Ho_Chi_Minh',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZOFFSETFROM:+0700',
      'TZOFFSETTO:+0700',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Ho_Chi_Minh:${startDate}`,
      `DTEND;TZID=Asia/Ho_Chi_Minh:${endDate}`,
      `DTSTAMP:${timestamp}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hang-eric-tea-ceremony.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePreWelcomeDinnerGoogleCalendarLink = () => {
    const title = 'Hang & Eric Pre-Welcome Dinner';
    const location = 'Nhà hàng Madame Lân, Da Nang, Vietnam';
    const description = 'Join us for Hang and Eric\'s pre-welcome dinner!';
    
    // May 22nd, 2026, 6:00 PM - 9:00 PM (Da Nang timezone is GMT+7)
    const startDate = '20260522T180000'; // 6:00 PM in Da Nang time
    const endDate = '20260522T210000'; // 9:00 PM in Da Nang time
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=Asia/Ho_Chi_Minh`;
    
    return googleUrl;
  };

  const generatePreWelcomeDinnerICSFile = () => {
    const title = 'Hang & Eric Pre-Welcome Dinner';
    const location = 'Nhà hàng Madame Lân, Da Nang, Vietnam';
    const description = 'Join us for Hang and Eric\'s pre-welcome dinner!';
    
    // Format: YYYYMMDDTHHMMSS
    const startDate = '20260522T180000';
    const endDate = '20260522T210000';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hang & Eric Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Ho_Chi_Minh',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZOFFSETFROM:+0700',
      'TZOFFSETTO:+0700',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Ho_Chi_Minh:${startDate}`,
      `DTEND;TZID=Asia/Ho_Chi_Minh:${endDate}`,
      `DTSTAMP:${timestamp}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hang-eric-pre-welcome-dinner.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Animate pre-welcome dinner timeline items
  useEffect(() => {
    const totalItems = 1;
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < totalItems; i++) {
      const timer = setTimeout(() => {
        setVisiblePreWelcomeItems(prev => [...prev, i]);
      }, i * 200); // 0.2 seconds per item
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Animate western wedding timeline items (starts after pre-welcome dinner)
  useEffect(() => {
    const totalItems = 7;
    const timers: NodeJS.Timeout[] = [];
    const startDelay = 200; // Start after pre-welcome dinner animation (1 * 200)
    
    for (let i = 0; i < totalItems; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, startDelay + (i * 200)); // 0.2 seconds per item
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Animate tea ceremony timeline items (starts after western wedding)
  useEffect(() => {
    const totalTeaItems = 8;
    const timers: NodeJS.Timeout[] = [];
    const startDelay = 1600; // Start after western wedding animation (200 + 7 * 200)
    
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
                </div>
                
                {/* Pre-Welcome Dinner Section */}
                <div className="mb-8">
                  <p className="text-body text-xl text-gray-600 mt-2 mb-4">
                    Restaurant: <a 
                      href="https://maps.app.goo.gl/BmkjFRYZLp6JAqyn7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >Nhà hàng Madame Lân</a>, {t.daNangVietnam} · {t.may22nd2026Schedule}
                  </p>
                  
                  {/* Calendar Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                    <a
                      href={generatePreWelcomeDinnerGoogleCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToGoogleCalendar}
                    </a>
                    <button
                      onClick={generatePreWelcomeDinnerICSFile}
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToCalendar}
                    </button>
                  </div>
                  
                  {/* Timeline */}
                  <div className="mx-auto max-w-3xl mt-6">
                    <div className="relative w-full">
                      {/* Central Line */}
                      <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-0.5"></div>
                      
                      {/* Timeline Events */}
                      <div className="space-y-8">
                      {/* Event: Pre-Welcome Dinner */}
                      <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visiblePreWelcomeItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                          <BuildingStorefrontIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                          <div className="text-body text-base text-gray-800 font-semibold">
                            {formatTime('6:00 – 9:00 PM')}
                          </div>
                        </div>
                        <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                          <div className="text-body text-xl text-gray-700 font-medium">
                            {t.preWelcomeDinnerEvent}
                          </div>
                          <div className="text-body text-xs text-gray-500 mt-0.5">
                            {t.madameLanRestaurant}
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Wedding Section */}
                <div className="mb-6">
                  <p className="text-body text-xl text-gray-600 mt-2 mb-4">
                    {t.fusionResortsAndSpa}, {t.daNangVietnam} · {t.may23rd2026Schedule}
                  </p>
                  
                  {/* Calendar Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                    <a
                      href={generateGoogleCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToGoogleCalendar}
                    </a>
                    <button
                      onClick={generateICSFile}
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToCalendar}
                    </button>
                  </div>
                  
                  {/* Timeline */}
                  <div className="mx-auto max-w-3xl mt-6">
                    <div className="relative w-full">
                      {/* Central Line */}
                      <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-0.5"></div>
                      
                      {/* Timeline Events */}
                      <div className="space-y-8">
                        {/* Event 1: Guest Arrival */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('resortLawn')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <HandRaisedIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('3:00 – 3:45 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.guestArrivalWelcome}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.resortLawn}
                            </div>
                          </div>
                        </div>

                        {/* Event 2: Guests Seated */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('resortLawn')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <Squares2X2Icon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('3:45 – 4:00 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.guestsAreSeated}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.resortLawn}
                            </div>
                          </div>
                        </div>

                        {/* Event 3: Exchange of Vows */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('resortLawn')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <SparklesIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('4:00 – 4:30 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.exchangeOfVows}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.resortLawn}
                            </div>
                          </div>
                        </div>

                        {/* Event 4: Photography */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('resortLawn')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <CameraIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('4:30 – 5:00 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.photographySession}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.resortLawn}
                            </div>
                          </div>
                        </div>

                        {/* Event 5: Cocktail Reception */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('charLawn')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <BeakerIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('5:00 – 6:00 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.cocktailReception}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.charLawn}
                            </div>
                          </div>
                        </div>

                        {/* Event 6: Dinner Reception */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('ballroom')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <CakeIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('6:00 – 9:00 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.dinnerReception}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.ballroom}
                            </div>
                          </div>
                        </div>

                        {/* Event 7: Dancing */}
                        <div
                          className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleItems.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          onClick={() => showLocationOnMap('charRestaurant')}
                        >
                          <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                            <MusicalNoteIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                          </div>
                          <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-base text-gray-800 font-semibold">
                              {formatTime('After 9:00 PM')}
                            </div>
                          </div>
                          <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                            <div className="text-body text-xl text-gray-700 font-medium">
                              {t.dancingEveningCelebration}
                            </div>
                            <div className="text-body text-xs text-gray-500 mt-0.5">
                              {t.charRestaurant}
                            </div>
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
                  <p className="text-body text-xl text-gray-600 mt-2 mb-4">
                    Restaurant: <a
                      href="https://maps.app.goo.gl/NSkf87Zj8SvVdjuK6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >Nhà Hàng Hai Lúa Sa Đéc</a>, {t.saDecVietnam}
                  </p>
                  
                  {/* Calendar Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                    <a
                      href={generateTeaCeremonyGoogleCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToGoogleCalendar}
                    </a>
                    <button
                      onClick={generateTeaCeremonyICSFile}
                      className="text-button-sm inline-block border border-gray-400 px-3 py-1.5 text-xs text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {t.addToCalendar}
                    </button>
                  </div>
                </div>
                
                {/* Tea Ceremony Timeline */}
                <div className="mx-auto max-w-3xl">
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
                          {formatTime('8:00 – 8:30 AM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.groomProcession}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          {t.teaCeremonyGroomLocation}
                        </div>
                      </div>
                    </div>

                    {/* Event 2: Arrival, Welcome & Exchange of Gifts */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <GiftIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('8:30 – 8:45 AM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.arrivalWelcomeExchangeOfGifts}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          {t.teaCeremonyGroomLocation}
                        </div>
                      </div>
                    </div>

                    {/* Event 3: Ancestral Ceremony */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <SparklesIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('8:45 – 9:30 AM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.ancestralCeremony}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          {t.teaCeremonyGroomLocation}
                        </div>
                      </div>
                    </div>

                    {/* Event 4: Tea Ceremony */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <BeakerIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('9:30 – 9:45 AM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.teaCeremonyRitual}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          {t.teaCeremonyGroomLocation}
                        </div>
                      </div>
                    </div>

                    {/* Event 5: Photography Session */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <CameraIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('9:45 – 10:30 AM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.photographySession}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          {t.teaCeremonyGroomLocation}
                        </div>
                      </div>
                    </div>

                    {/* Event 6: Guest Welcoming for Lunch */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <HandRaisedIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('11:30 AM – 12:30 PM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.guestWelcomingLunch}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          Nhà Hàng Hai Lúa Sa Đéc - Restaurant
                        </div>
                      </div>
                    </div>

                    {/* Event 7: Grand Entrance */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <Squares2X2Icon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('12:30 – 12:45 PM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.grandEntrance}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          Nhà Hàng Hai Lúa Sa Đéc - Restaurant
                        </div>
                      </div>
                    </div>

                    {/* Event 8: Lunch Service */}
                    <div className={`group relative flex items-center justify-center min-h-[40px] transition-all duration-500 cursor-pointer ${visibleTeaItems.includes(7) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="absolute left-1/3 transform -translate-x-1/2 z-10 bg-white transition-transform duration-300 group-hover:scale-125">
                        <CakeIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute right-2/3 pr-6 text-right transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-base text-gray-800 font-semibold">
                          {formatTime('12:45 – 2:15 PM')}
                        </div>
                      </div>
                      <div className="absolute left-1/3 pl-12 text-left transition-transform duration-300 group-hover:scale-110">
                        <div className="text-body text-xl text-gray-700 font-medium">
                          {t.lunch}
                        </div>
                        <div className="text-body text-xs text-gray-500 mt-0.5">
                          Nhà Hàng Hai Lúa Sa Đéc - Restaurant
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-8 mb-4 text-center" ref={mapSectionRef}>
              <h2 className="text-title text-2xl font-bold text-gray-800 mb-2">
                {t.fusionMapTitle}
              </h2>
              <p className="text-body text-sm text-gray-500 mb-4">
                {t.fusionMapDescription}
              </p>
              <div className="mx-auto max-w-3xl">
                {/* Legend */}
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLocation((current) =>
                        current === 'resortLawn' ? null : 'resortLawn'
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      activeLocation === 'resortLawn'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    <span>{t.resortLawn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLocation((current) =>
                        current === 'charLawn' ? null : 'charLawn'
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      activeLocation === 'charLawn'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BeakerIcon className="h-4 w-4" />
                    <span>{t.charLawn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLocation((current) =>
                        current === 'ballroom' ? null : 'ballroom'
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      activeLocation === 'ballroom'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CakeIcon className="h-4 w-4" />
                    <span>{t.ballroom}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLocation((current) =>
                        current === 'charRestaurant' ? null : 'charRestaurant'
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      activeLocation === 'charRestaurant'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <MusicalNoteIcon className="h-4 w-4" />
                    <span>{t.charRestaurant}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLocation((current) =>
                        current === 'lobbyEntrance' ? null : 'lobbyEntrance'
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      activeLocation === 'lobbyEntrance'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BuildingStorefrontIcon className="h-4 w-4" />
                    <span>{t.lobbyEntrance}</span>
                  </button>
                </div>

                {/* Map with marker overlay */}
                <div
                  className="relative w-full rounded-lg shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => setActiveLocation(null)}
                >
                  <img
                    src="/fusion_resort_map.png"
                    alt="Fusion Resort & Villas Da Nang map"
                    className="w-full select-none pointer-events-none"
                  />
                  {activeLocation && fusionLocations[activeLocation] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLocation(null);
                      }}
                      style={{
                        left: `${fusionLocations[activeLocation].xPct}%`,
                        top: `${fusionLocations[activeLocation].yPct}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className="relative inline-flex h-10 w-10 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-blue-500 bg-white/70"></span>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 animate-ping"></span>
                        <MapPinIcon className="relative h-6 w-6 text-blue-900" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
