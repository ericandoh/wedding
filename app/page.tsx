'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import LogoutButton from './_components/logout-button';
import { useLanguage } from './_components/language-provider';

export default function Page() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showText, setShowText] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showAboutCouple, setShowAboutCouple] = useState(false);
  const [showEngagement, setShowEngagement] = useState(false);
  const [showStory1, setShowStory1] = useState(false);
  const [showStory2, setShowStory2] = useState(false);
  const [showStory3, setShowStory3] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const galleryImages = [
    '/gallery2.JPG', 
    '/gallery5.JPG',
    '/gallery7.JPG',
    '/gallery8.JPG',
    '/gallery9.JPG',
  ];

  const openModal = (imageSrc: string) => {
    const index = galleryImages.indexOf(imageSrc);
    setCurrentIndex(index);
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  // Show text after background loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 400); // Show text after 400ms

    return () => clearTimeout(timer);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const section = target.dataset.section;
          
          switch (section) {
            case 'countdown':
              setShowCountdown(true);
              break;
            case 'about-couple':
              setShowAboutCouple(true);
              break;
            case 'engagement':
              setShowEngagement(true);
              break;
            case 'story1':
              setShowStory1(true);
              break;
            case 'story2':
              setShowStory2(true);
              break;
            case 'story3':
              setShowStory3(true);
              break;
            case 'gallery':
              setShowGallery(true);
              break;
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    const countdownSection = document.querySelector('[data-section="countdown"]');
    const aboutCoupleSection = document.querySelector('[data-section="about-couple"]');
    const engagementSection = document.querySelector('[data-section="engagement"]');
    const story1Section = document.querySelector('[data-section="story1"]');
    const story2Section = document.querySelector('[data-section="story2"]');
    const story3Section = document.querySelector('[data-section="story3"]');
    const gallerySection = document.querySelector('[data-section="gallery"]');

    if (countdownSection) observer.observe(countdownSection);
    if (aboutCoupleSection) observer.observe(aboutCoupleSection);
    if (engagementSection) observer.observe(engagementSection);
    if (story1Section) observer.observe(story1Section);
    if (story2Section) observer.observe(story2Section);
    if (story3Section) observer.observe(story3Section);
    if (gallerySection) observer.observe(gallerySection);

    return () => {
      if (countdownSection) observer.unobserve(countdownSection);
      if (aboutCoupleSection) observer.unobserve(aboutCoupleSection);
      if (engagementSection) observer.unobserve(engagementSection);
      if (story1Section) observer.unobserve(story1Section);
      if (story2Section) observer.unobserve(story2Section);
      if (story3Section) observer.unobserve(story3Section);
      if (gallerySection) observer.unobserve(gallerySection);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-05-23T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      {/* Full-screen image with overlay */}
      <div className="relative h-screen w-screen">
        {/* Mobile image - hidden on larger screens */}
        <img
          src="/home_mobile.JPG"
          alt="Hang & Eric Wedding"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        {/* Desktop image - hidden on mobile */}
        <img
          src="/home.JPG"
          alt="Hang & Eric Wedding"
          className="absolute inset-0 h-full w-full object-cover hidden md:block"
        />
        
        {/* Dark gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        
        {/* Full-height dark background with opacity that fades left and right */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
          }}></div>
        </div>
        
        {/* Title and button overlaid on image - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showText && (
            <div className="text-center px-12 smooth-fade-in">
              <a href="#about-couple">
                <h1 className="text-title mb-2 text-white drop-shadow-lg cursor-pointer transition-all duration-300 hover:scale-105">
                  {t.hangAndEricMain}
                </h1>
              </a>
              <div className="mb-8">
                <p className="text-subtitle text-white drop-shadow-lg">
                  <Link href="/save-the-date" className="cursor-pointer transition-all duration-300 hover:scale-105 inline-block">
                    {t.may20th2026}
                  </Link>
                  {' | '}
                  <Link href="/travel#tea-venue" className="cursor-pointer transition-all duration-300 hover:scale-105 inline-block">
                    {t.saDec}
                  </Link>
                </p>
                <p className="text-subtitle text-white drop-shadow-lg">
                  <Link href="/save-the-date" className="cursor-pointer transition-all duration-300 hover:scale-105 inline-block">
                    {t.may23rd2026}
                  </Link>
                  {' | '}
                  <Link href="/travel#western-venue" className="cursor-pointer transition-all duration-300 hover:scale-105 inline-block">
                    {t.fusionResortsVillasDaNangShort}
                  </Link>
                </p>
              </div>
              
              {/* RSVP button */}
              <div className="flex flex-col items-center">
                <Link
                  href="/rsvp"
                  className="inline-block border-2 border-white px-8 py-3 text-white transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg heart-throb"
                >
                  <span className="font-cormorant-garamond text-xl">{t.rsvp}</span>
                </Link>
                <p className="font-cormorant-garamond text-base text-white drop-shadow-lg mt-2">
                  {t.byMarch8th2026}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Countdown Section */}
      <div className="bg-white py-16" data-section="countdown">
        <div className={`mx-auto max-w-4xl px-6 text-center transition-opacity duration-1000 ${showCountdown ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-title mb-12 text-4xl text-gray-800">
            {t.countdownTillParadise}
          </h2>
          
          {/* Countdown Boxes */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {/* Days */}
            <div className="aspect-square flex flex-col items-center justify-center rounded border border-gray-200/40 p-4">
              <div className="text-title text-5xl text-gray-800 mb-1">
                {timeLeft.days}
              </div>
              <div className="text-body text-base text-gray-600">
                {t.days}
              </div>
            </div>
            
            {/* Hours */}
            <div className="aspect-square flex flex-col items-center justify-center rounded border border-gray-200/40 p-4">
              <div className="text-title text-5xl text-gray-800 mb-1">
                {timeLeft.hours}
              </div>
              <div className="text-body text-base text-gray-600">
                {t.hours}
              </div>
            </div>
            
            {/* Minutes */}
            <div className="aspect-square flex flex-col items-center justify-center rounded border border-gray-200/40 p-4">
              <div className="text-title text-5xl text-gray-800 mb-1">
                {timeLeft.minutes}
              </div>
              <div className="text-body text-base text-gray-600">
                {t.minutes}
              </div>
            </div>
            
            {/* Seconds */}
            <div className="aspect-square flex flex-col items-center justify-center rounded border border-gray-200/40 p-4">
              <div className="text-title text-5xl text-gray-800 mb-1">
                {timeLeft.seconds}
              </div>
              <div className="text-body text-base text-gray-600">
                {t.seconds}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Heart Divider */}
      <div className="bg-white py-8 flex items-center justify-center">
        <div className="h-px w-32 bg-gray-200/30"></div>
        <div className="mx-4 text-2xl text-gray-400/50">❦</div>
        <div className="h-px w-32 bg-gray-200/30"></div>
      </div>

      {/* About the Couple Section */}
      <div id="about-couple" className="bg-white py-8 text-center" data-section="about-couple">
        <div className={`transition-opacity duration-1000 ${showAboutCouple ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
            {t.aboutTheCoupleTitle}
          </h1>
        </div>
      </div>

      {/* Full-width cover image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <Image
          src="/our_story_cover.JPG"
          alt={t.hangAndEricsLoveStory}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Engagement Section */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12" data-section="engagement">
            <div className={`flex-1 transition-opacity duration-1000 ${showEngagement ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src="/engaged.JPG"
                alt="Hang and Eric engagement photo"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className={`flex-1 text-center lg:text-left transition-opacity duration-1000 ${showEngagement ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                {t.ourEngagement}
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                {t.engagementStory}
              </p>
            </div>
          </div>

          {/* Story 1: We heard each other first! - Text Left, Image Right */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12" data-section="story1">
            <div className={`flex-1 text-center lg:text-left transition-opacity duration-1000 ${showStory1 ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                {t.story1Title}
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                {t.story1Text}
              </p>
            </div>
            <div className={`flex-1 transition-opacity duration-1000 ${showStory1 ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src="/story1.jpg"
                alt="Hang and Eric first connection"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Story 2: Many Dates, Many Adventures! - Image Left, Text Right */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12" data-section="story2">
            <div className={`flex-1 transition-opacity duration-1000 ${showStory2 ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src="/story2.JPG"
                alt="Hang and Eric adventures together"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className={`flex-1 text-center lg:text-left transition-opacity duration-1000 ${showStory2 ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                {t.story2Title}
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                {t.story2Text}
              </p>
            </div>
          </div>

          {/* Story 3: Excited to have you on our next adventure! - Text Left, Image Right */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12" data-section="story3">
            <div className={`flex-1 text-center lg:text-left transition-opacity duration-1000 ${showStory3 ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                {t.story3Title}
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                {t.story3Text}
              </p>
            </div>
            <div className={`flex-1 transition-opacity duration-1000 ${showStory3 ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src="/story3.jpg"
                alt="Excited for the next adventure"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-16" data-section="gallery">
            <div className={`transition-opacity duration-1000 ${showGallery ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-8 text-center text-4xl text-gray-800">
                {t.photoGallery}
              </h2>
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-2 xl:columns-2">
              {galleryImages.map((imageSrc, index) => {
                const heights = ['h-80', 'h-96', 'h-72', 'h-88', 'h-76', 'h-84', 'h-92'];
                const heightClass = heights[index % heights.length];
                
                return (
                  <div 
                    key={imageSrc} 
                    className={`group relative mb-6 overflow-hidden rounded-lg shadow-lg transition-all duration-300 break-inside-avoid cursor-pointer`}
                    onClick={() => openModal(imageSrc)}
                  >
                    <Image
                      src={imageSrc}
                      alt={`Gallery photo ${index + 1}`}
                      width={400}
                      height={500}
                      className={`w-full object-cover ${heightClass}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10"></div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="flex justify-center bg-white py-12 pb-8">
        <LogoutButton />
      </div>

      {/* Modal/Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeModal}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {galleryImages.length}
            </div>

            {/* Main Image */}
            <Image
              src={selectedImage}
              alt={`Gallery photo ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
