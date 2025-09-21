'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OurStory() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const galleryImages = [
    '/gallery1.JPG',
    '/gallery2.JPG', 
    '/gallery3.JPG',
    '/gallery4.JPG',
    '/gallery5.JPG',
    '/gallery6.JPG',
    '/gallery7.JPG'
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
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          About the Couple
        </h1>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <Image
          src="/our_story_cover.JPG"
          alt="Hang & Eric's Love Story"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Engagement Section */}
          <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="flex-1">
              <Image
                src="/engaged.JPG"
                alt="Hang and Eric engagement photo"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-title mb-4 text-4xl text-gray-800">
                Our Engagement
              </h2>
              <p className="text-body text-xl leading-relaxed text-gray-700">
                Hang and Eric got engaged on March 3rd, 2025, at Hakone Gardens! But they actually first met on Hinge early 2022 (started talking together on Valentine's Day!)
              </p>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-16">
            <h2 className="text-title mb-8 text-center text-4xl text-gray-800">
              Our Journey Together
            </h2>
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-2 xl:columns-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                // Create varying heights for waterfall effect with larger images
                const heights = ['h-80', 'h-96', 'h-72', 'h-88', 'h-76', 'h-84', 'h-92'];
                const heightClass = heights[(num - 1) % heights.length];
                
                // For waterfall layout, we'll use a more balanced approach
                // that works for both left and right positioned images
                const translateX = 'hover:translate-x-1/6';
                
                return (
                  <div 
                    key={num} 
                    className={`group relative mb-6 overflow-hidden rounded-lg shadow-lg transition-all duration-300 break-inside-avoid cursor-pointer`}
                    onClick={() => openModal(`/gallery${num}.JPG`)}
                  >
                    <Image
                      src={`/gallery${num}.JPG`}
                      alt={`Gallery photo ${num}`}
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

          {/* Story Section */}
          <div className="text-center">
            <p className="text-body mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-body mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </div>
        </div>
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
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
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
