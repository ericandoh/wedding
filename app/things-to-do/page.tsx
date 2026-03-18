'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';

interface Attraction {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

interface PlannerMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRateLimit?: boolean;
}

type PlannerRegion = 'central' | 'south' | 'both';

export default function ThingsToDo() {
  const { t } = useLanguage();
  const [revealedCount, setRevealedCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [carPosition, setCarPosition] = useState(0); // Which card the car is currently on/moving to
  const [isCelebrating, setIsCelebrating] = useState(false); // Car doing celebration circles
  const [movingToCenter, setMovingToCenter] = useState(false); // Car moving from last card to center
  const [exitingScreen, setExitingScreen] = useState(false); // Car exiting screen

  // Planner chatbot state
  const [plannerMessages, setPlannerMessages] = useState<PlannerMessage[]>([]);
  const [plannerInput, setPlannerInput] = useState('');
  const [plannerIsLoading, setPlannerIsLoading] = useState(false);
  const [plannerMessageId, setPlannerMessageId] = useState(0);
  const [plannerRegion, setPlannerRegion] = useState<PlannerRegion>('central');
  const plannerMessagesEndRef = useRef<HTMLDivElement>(null);

  const attractions: Attraction[] = [
    {
      id: 1,
      title: t.sonTraPeninsula,
      description: t.sonTraDescription,
      image: '/tourist/son_tra.jpg',
      color: 'bg-gradient-to-br from-teal-400 to-teal-600',
    },
    {
      id: 2,
      title: t.marbleMountains,
      description: t.marbleMountainsDescription,
      image: '/tourist/marble_mountains.jpg',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      id: 3,
      title: t.hoiAnAncientTown,
      description: t.hoiAnDescription,
      image: '/tourist/hoi_an.jpg',
      color: 'bg-gradient-to-br from-amber-400 to-amber-600',
    },
    {
      id: 4,
      title: t.baNaHills,
      description: t.baNaHillsDescription,
      image: '/tourist/banahills.jpg',
      color: 'bg-gradient-to-br from-rose-400 to-rose-600',
    },
    {
      id: 5,
      title: t.myKheSandyBeach,
      description: t.myKheDescription,
      image: '/tourist/mykhe.jpg',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      id: 6,
      title: t.dragonBridge,
      description: t.dragonBridgeDescription,
      image: '/tourist/dragon.jpg',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
  ];

  const handleAttractionClick = (id: number) => {
    // id is 1-based, revealedCount is 0-based
    if (id === revealedCount + 1 && !isTransitioning) {
      // Check if this is the last card
      const isLastCard = id === attractions.length;
      
      if (isLastCard) {
        // Last card - multi-stage celebration animation
        setIsTransitioning(true);
        setMovingToCenter(true);
        
        // Step 1: Move to center (1s)
        setTimeout(() => {
          setMovingToCenter(false);
          setIsCelebrating(true);
        }, 1000);
        
        // Step 2: After celebration circle (1 rotation = 2s), start exit
        setTimeout(() => {
          setIsCelebrating(false);
          setExitingScreen(true);
        }, 1000 + 2000);
        
        // Step 3: Reveal the last card and complete transition (after exit completes)
        setTimeout(() => {
          setRevealedCount((prev) => Math.min(prev + 1, attractions.length));
          setIsTransitioning(false);
          setExitingScreen(false);
          setCarPosition(attractions.length);
        }, 1000 + 2000 + 1000);
      } else {
        // Regular card - move to next position
        setIsTransitioning(true);
        setCarPosition(revealedCount + 1);
        
        // Wait for car animation to complete before revealing next card
        setTimeout(() => {
          setRevealedCount((prev) => Math.min(prev + 1, attractions.length));
          setIsTransitioning(false);
        }, 800);
      }
    }
  };

  const scrollPlannerToBottom = () => {
    plannerMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollPlannerToBottom();
  }, [plannerMessages, plannerIsLoading]);

  const plannerRegionToLabel: Record<PlannerRegion, string> = {
    central: 'Central Vietnam (Da Nang / Hoi An / Hue)',
    south: 'South Vietnam (Sa Dec / Can Tho / HCMC)',
    both: 'Both regions',
  };

  const handleSendPlannerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerInput.trim() || plannerIsLoading) return;

    const userMessageText = plannerInput.trim();

    const userMessage: PlannerMessage = {
      id: plannerMessageId,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    };

    setPlannerMessages((prev) => [...prev, userMessage]);
    setPlannerInput('');
    setPlannerMessageId((prev) => prev + 1);
    setPlannerIsLoading(true);

    try {
      const response = await fetch('/api/things-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          region: plannerRegion === 'both' ? undefined : plannerRegion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const botMessage: PlannerMessage = {
            id: plannerMessageId + 1,
            text:
              data.message ||
              'Sorry, we can only answer 1000 planning questions a day because we are cheap and on a free model. Please try again tomorrow!',
            isUser: false,
            timestamp: new Date(),
            isRateLimit: true,
          };
          setPlannerMessages((prev) => [...prev, botMessage]);
          setPlannerMessageId((prev) => prev + 2);
          return;
        }
        throw new Error('Failed to get response');
      }

      const botMessage: PlannerMessage = {
        id: plannerMessageId + 1,
        text:
          data.response ||
          "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setPlannerMessages((prev) => [...prev, botMessage]);
      setPlannerMessageId((prev) => prev + 2);
    } catch (error) {
      console.error('Error sending planner message:', error);
      const errorMessage: PlannerMessage = {
        id: plannerMessageId + 1,
        text:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setPlannerMessages((prev) => [...prev, errorMessage]);
      setPlannerMessageId((prev) => prev + 2);
    } finally {
      setPlannerIsLoading(false);
    }
  };

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

          {/* Interactive Attractions Grid */}
          <div className="mb-16">
            <h2 className="text-title mb-4 text-center text-4xl text-gray-800">
              {t.exploreDaNang}
            </h2>
            <p className="text-body mb-12 text-center text-lg text-gray-600">
              {t.tapToReveal}
            </p>

            {/* Grid Container */}
            <div className="relative mx-auto max-w-5xl">
              {/* Floating car for mobile (1 column) */}
              {(carPosition <= attractions.length || exitingScreen) && (
                <div
                  className={`pointer-events-none absolute z-30 sm:hidden ${isCelebrating ? '' : 'transition-all duration-1000 ease-in-out'}`}
                  style={{
                    top: (isCelebrating || movingToCenter || exitingScreen) ? '50%' : `calc(${carPosition} * (24rem + 4rem) + 12rem)`,
                    left: exitingScreen ? '150%' : ((isCelebrating || movingToCenter) ? '50%' : (carPosition === attractions.length ? '150%' : '50%')),
                    transform: 'translate(-50%, -50%)',
                    animation: isCelebrating ? 'celebrationCircle 2s linear 1 forwards' : 'none',
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={isTransitioning || carPosition === attractions.length ? '' : 'animate-bounce'}>
                      <img
                        src="/wee.png"
                        alt="Car driving to next location"
                        className="h-auto w-32 drop-shadow-2xl"
                      />
                    </div>
                    {!isTransitioning && carPosition < attractions.length && (
                      <div className="rounded-full bg-blue-500 px-6 py-2 shadow-lg animate-pulse">
                        <p className="text-body whitespace-nowrap text-lg font-bold text-white">
                          {t.tapMeToExplore}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Floating car for tablet (2 columns) */}
              {(carPosition <= attractions.length || exitingScreen) && (
                <div
                  className={`pointer-events-none absolute z-30 hidden sm:block lg:hidden ${isCelebrating ? '' : 'transition-all duration-1000 ease-in-out'}`}
                  style={{
                    top: (isCelebrating || movingToCenter || exitingScreen) ? '50%' : `calc(${Math.floor(carPosition / 2)} * (24rem + 4rem) + 12rem)`,
                    left: exitingScreen ? '150%' : ((isCelebrating || movingToCenter) ? '50%' : (carPosition === attractions.length ? '150%' : `calc((100% - 4rem) / 4 + ${carPosition % 2} * ((100% - 4rem) / 2 + 4rem))`)),
                    transform: 'translate(-50%, -50%)',
                    animation: isCelebrating ? 'celebrationCircle 2s linear 1 forwards' : 'none',
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={isTransitioning || carPosition === attractions.length ? '' : 'animate-bounce'}>
                      <img
                        src="/wee.png"
                        alt="Car driving to next location"
                        className="h-auto w-32 drop-shadow-2xl"
                      />
                    </div>
                    {!isTransitioning && carPosition < attractions.length && (
                      <div className="rounded-full bg-blue-500 px-6 py-2 shadow-lg animate-pulse">
                        <p className="text-body whitespace-nowrap text-lg font-bold text-white">
                          {t.tapMeToExplore}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Floating car for desktop (3 columns) */}
              {(carPosition <= attractions.length || exitingScreen) && (
                <div
                  className={`pointer-events-none absolute z-30 hidden lg:block ${isCelebrating ? '' : 'transition-all duration-1000 ease-in-out'}`}
                  style={{
                    top: (isCelebrating || movingToCenter || exitingScreen) ? '50%' : `calc(${Math.floor(carPosition / 3)} * (24rem + 4rem) + 12rem)`,
                    left: exitingScreen ? '150%' : ((isCelebrating || movingToCenter) ? '50%' : (carPosition === attractions.length ? '150%' : `calc((100% - 8rem) / 6 + ${carPosition % 3} * ((100% - 8rem) / 3 + 4rem))`)),
                    transform: 'translate(-50%, -50%)',
                    animation: isCelebrating ? 'celebrationCircle 2s linear 1 forwards' : 'none',
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={isTransitioning || carPosition === attractions.length ? '' : 'animate-bounce'}>
                      <img
                        src="/wee.png"
                        alt="Car driving to next location"
                        className="h-auto w-32 drop-shadow-2xl"
                      />
                    </div>
                    {!isTransitioning && carPosition < attractions.length && (
                      <div className="rounded-full bg-blue-500 px-6 py-2 shadow-lg animate-pulse">
                        <p className="text-body whitespace-nowrap text-lg font-bold text-white">
                          {t.tapMeToExplore}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grid Layout */}
              <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
                {attractions.map((attraction, index) => {
                  const isRevealed = index < revealedCount;
                  const isNext = index === revealedCount && !isTransitioning;
                  const hasCarOnIt = index === carPosition;

                  // Show revealed cards and the next card (when not transitioning)
                  // Also show placeholder for card with car during transition
                  if (!isRevealed && !isNext && !hasCarOnIt) return null;

                  return (
                    <div
                      key={attraction.id}
                      className="relative"
                    >
                      {/* Attraction Card */}
                      <div
                        onClick={() => handleAttractionClick(attraction.id)}
                        className={`
                          group relative overflow-hidden rounded-xl transition-all duration-300
                          ${isRevealed ? 'scale-100 opacity-100 shadow-lg' : ''}
                          ${(isNext || hasCarOnIt) ? 'cursor-pointer border-4 border-dashed border-blue-400 bg-blue-50 hover:scale-105 hover:border-blue-500' : ''}
                        `}
                      >
                        {/* Show full card content only if revealed */}
                        {isRevealed && (
                          <>
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                              <img
                                src={attraction.image}
                                alt={attraction.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>

                            {/* Content */}
                            <div className="bg-white p-6">
                              <h3 className="text-title mb-3 text-2xl font-bold text-gray-800">
                                {attraction.title}
                              </h3>
                              <p className="text-body text-sm leading-relaxed text-gray-600">
                                {attraction.description}
                              </p>
                            </div>
                          </>
                        )}

                        {/* Show empty outline with just height if has car on it (next to unlock or transitioning) */}
                        {(isNext || hasCarOnIt) && !isRevealed && (
                          <div className="h-96 w-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="mt-12 text-center">
                <div className="mx-auto mb-4 flex max-w-xs justify-center gap-2">
                  {attractions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        index < revealedCount
                          ? 'bg-gradient-to-r from-blue-500 to-teal-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-body text-sm text-gray-600">
                  {revealedCount} {t.of} {attractions.length} {t.locationsRevealed}
                </p>
              </div>
            </div>
          </div>

          {/* Saved Places Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                {t.savedPlacesTitle}
              </h2>
              <p className="text-body text-xl text-gray-600">
                {t.savedPlacesSubtext}
              </p>
            </div>

            {/* Embedded Google Maps */}
            <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1dfL3GcyW1niUucFMUFYVSLJkMZX1Ujg&ehbc=2E312F"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hang and Eric's Da Nang Recs"
              ></iframe>
            </div>

            {/* Note about embed */}
            <div className="mb-4 text-center">
              <p className="text-body text-sm text-gray-600 italic">
                {t.embedMapNote}
              </p>
            </div>

            {/* Link to Full Map */}
            <div className="text-center">
              <a
                href="https://maps.app.goo.gl/rHZaUdRRs76UuqR26"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline inline-block"
              >
                {t.viewFullMap} →
              </a>
            </div>
          </div>

          {/* Sa Dec Recs Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                {t.saDecRecsTitle}
              </h2>
              <p className="text-body text-xl text-gray-600">
                {t.saDecRecsSubtext}
              </p>
            </div>

            {/* Links to Travel Guide and Full Map */}
            <div className="text-center space-y-4">
              <div>
                <a
                  href="https://vemekong.com/sa-dec-travel-guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline inline-block"
                >
                  {t.saDecTravelGuide} →
                </a>
              </div>
              <div>
                <a
                  href="https://maps.app.goo.gl/qecBEmCnfnKWHUTN8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline inline-block"
                >
                  {t.viewFullMap} →
                </a>
              </div>
            </div>
          </div>

          {/* Trip planner chatbot (Central / South Vietnam) */}
          <div className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                Trip planner chatbot
              </h2>
              <p className="text-body text-lg text-gray-600">
                Ask for help planning what to eat, see, and shop for based on
                Hang + Eric&apos;s saved places in Central and South Vietnam.
              </p>
            </div>

            {/* Region selector */}
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {(['central', 'south', 'both'] as PlannerRegion[]).map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setPlannerRegion(region)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    plannerRegion === region
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plannerRegionToLabel[region]}
                </button>
              ))}
            </div>

            {/* Chat UI */}
            <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="text-sm text-gray-600">
                  Current focus:{' '}
                  <span className="font-semibold">
                    {plannerRegionToLabel[plannerRegion]}
                  </span>
                </p>
              </div>

              <div className="h-80 overflow-y-auto px-4 py-3 space-y-3">
                {plannerMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <div className="text-center max-w-md">
                      <p className="text-body mb-3">
                        Not sure where to start?
                      </p>
                      <p className="text-body-sm mb-4">
                        Try asking things like:
                      </p>
                      <div className="space-y-2 text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setPlannerInput(
                              'Can you plan a one-day itinerary around Da Nang using your favorite food and shopping spots?'
                            )
                          }
                          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Plan a one-day Da Nang food + shopping day
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPlannerInput(
                              'We will spend two days in Sa Dec and Can Tho. Can you suggest a relaxed itinerary using your saved places?'
                            )
                          }
                          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Two days in Sa Dec / Can Tho
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPlannerInput(
                              'We like coffee, stationery, and plants. Can you recommend a few places from your list that we should not miss?'
                            )
                          }
                          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Coffee, stationery, and plant recs
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {plannerMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                            message.isUser
                              ? 'bg-blue-500 text-white'
                              : message.isRateLimit
                              ? 'bg-red-100 border border-red-300 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="whitespace-pre-line">
                            {message.text}
                          </div>
                          <p
                            className={`mt-1 text-[10px] ${
                              message.isUser
                                ? 'text-blue-100'
                                : message.isRateLimit
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {plannerIsLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-xs rounded-lg px-3 py-2 bg-gray-100 text-gray-800 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </div>
                            <p className="text-xs text-gray-600">Thinking…</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={plannerMessagesEndRef} />
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 px-4 py-3">
                <form
                  onSubmit={handleSendPlannerMessage}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={plannerInput}
                    onChange={(e) => setPlannerInput(e.target.value)}
                    placeholder="Ask for a plan using the saved places…"
                    disabled={plannerIsLoading}
                    className="flex-grow rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={!plannerInput.trim() || plannerIsLoading}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {plannerIsLoading ? 'Sending…' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
