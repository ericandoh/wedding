'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Cat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  image: string;
  isPetted: boolean;
  petCount: number;
  lastPetTime: number;
}

export default function PetCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [roomSize, setRoomSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const catImages = [
    '/aspenified.png',
    '/cypressified.png', 
    '/fionified.png'
  ];

  // Initialize cats with proper positioning
  const initializeCats = (width: number, height: number) => {
    const catSize = isMobile ? 80 : 100;
    const margin = 20; // Ensure cats don't spawn too close to edges
    const minVelocity = 0.5; // Minimum initial velocity
    
    return catImages.map((image, index) => {
      // Generate random angle and speed for initial velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.max(minVelocity, Math.random() * 2);
      
      return {
        id: index,
        x: Math.max(margin, Math.min(width - catSize - margin, Math.random() * (width - catSize))),
        y: Math.max(margin, Math.min(height - catSize - margin, Math.random() * (height - catSize))),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        image,
        isPetted: false,
        petCount: 0,
        lastPetTime: 0
      };
    });
  };

  // Initialize cats when room size is available
  useEffect(() => {
    if (roomSize.width > 0 && roomSize.height > 0) {
      setCats(initializeCats(roomSize.width, roomSize.height));
      setIsInitialized(true);
    }
  }, [roomSize.width, roomSize.height, isMobile]);

  // Mobile detection and room size updates
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateRoomSize = () => {
      if (roomRef.current) {
        const rect = roomRef.current.getBoundingClientRect();
        const width = Math.max(300, rect.width); // Minimum width for mobile
        const height = isMobile ? Math.min(400, rect.height) : 600; // Shorter on mobile
        setRoomSize({ width, height });
      }
    };

    const repositionCats = (newWidth: number, newHeight: number) => {
      setCats(prevCats => 
        prevCats.map(cat => {
          const catSize = isMobile ? 80 : 100;
          const margin = 20;
          const minVelocity = 0.5;
          
          // If cat is outside bounds, reposition it
          if (cat.x < margin || cat.x > newWidth - catSize - margin ||
              cat.y < margin || cat.y > newHeight - catSize - margin) {
            // Generate random angle and speed for velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.max(minVelocity, Math.random() * 2);
            
            return {
              ...cat,
              x: Math.max(margin, Math.min(newWidth - catSize - margin, Math.random() * (newWidth - catSize))),
              y: Math.max(margin, Math.min(newHeight - catSize - margin, Math.random() * (newHeight - catSize))),
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed
            };
          }
          return cat;
        })
      );
    };

    checkMobile();
    updateRoomSize();
    
    window.addEventListener('resize', () => {
      const wasMobile = isMobile;
      checkMobile();
      updateRoomSize();
      
      // If switching between mobile/desktop, reposition cats
      if (wasMobile !== window.innerWidth < 768) {
        setTimeout(() => {
          if (roomRef.current) {
            const rect = roomRef.current.getBoundingClientRect();
            const width = Math.max(300, rect.width);
            const height = window.innerWidth < 768 ? Math.min(400, rect.height) : 600;
            repositionCats(width, height);
          }
        }, 100);
      }
    });
    
    return () => window.removeEventListener('resize', updateRoomSize);
  }, [isMobile]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setCats(prevCats => 
        prevCats.map(cat => {
          const catSize = isMobile ? 80 : 100;
          const margin = 10;
          const minVelocity = 0.3; // Minimum velocity to prevent cats from getting stuck
          
          let newX = cat.x + cat.vx;
          let newY = cat.y + cat.vy;
          let newVx = cat.vx;
          let newVy = cat.vy;

          // Ensure cats stay within bounds with proper margins
          if (newX <= margin) {
            newVx = Math.max(minVelocity, Math.abs(newVx)); // Ensure positive velocity with minimum
            newX = margin;
          } else if (newX >= roomSize.width - catSize - margin) {
            newVx = -Math.max(minVelocity, Math.abs(newVx)); // Ensure negative velocity with minimum
            newX = roomSize.width - catSize - margin;
          }
          
          if (newY <= margin) {
            newVy = Math.max(minVelocity, Math.abs(newVy)); // Ensure positive velocity with minimum
            newY = margin;
          } else if (newY >= roomSize.height - catSize - margin) {
            newVy = -Math.max(minVelocity, Math.abs(newVy)); // Ensure negative velocity with minimum
            newY = roomSize.height - catSize - margin;
          }

          // Ensure minimum velocity - if velocity is too low, give it a boost
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed < minVelocity) {
            const angle = Math.random() * Math.PI * 2;
            newVx = Math.cos(angle) * minVelocity;
            newVy = Math.sin(angle) * minVelocity;
          }

          // Random direction changes - increased frequency
          if (Math.random() < 0.02) { // Increased from 0.01 to 0.02
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.max(minVelocity, Math.random() * 2);
            newVx = Math.cos(angle) * speed;
            newVy = Math.sin(angle) * speed;
          }

          // Reset petting state after 2 seconds
          const now = Date.now();
          const isPetted = now - cat.lastPetTime < 2000;

          return {
            ...cat,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            isPetted
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    // Only start animation if we have cats and room size
    if (cats.length > 0 && roomSize.width > 0 && roomSize.height > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [roomSize.width, roomSize.height, isMobile, cats.length]);

  const handleCatInteraction = (catId: number, event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behaviors that could interfere with touch
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    setCats(prevCats =>
      prevCats.map(cat =>
        cat.id === catId
          ? {
              ...cat,
              isPetted: true,
              petCount: cat.petCount + 1,
              lastPetTime: now,
              vx: (Math.random() - 0.5) * 4, // Give them a little boost
              vy: (Math.random() - 0.5) * 4
            }
          : cat
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          Pet Cats
        </h1>
        <p className="font-satisfy text-xl text-gray-600">
          Click on the cats to pet them!
        </p>
      </div>

      <div className="flex-grow bg-gradient-to-b from-blue-100 to-green-100 py-8">
        <div className="mx-auto max-w-6xl px-6">
          {/* Room Container */}
          <div 
            ref={roomRef}
            className="relative mx-auto overflow-hidden rounded-lg border-4 border-amber-800 bg-gradient-to-b from-amber-50 to-amber-100 shadow-2xl touch-none select-none"
            style={{ 
              width: '100%', 
              height: isMobile ? '400px' : '600px', 
              maxWidth: isMobile ? '100%' : '800px',
              minHeight: '300px'
            }}
          >
            {/* Cat Tree */}
            <div className={`absolute bottom-0 ${isMobile ? 'right-4' : 'right-8'}`}>
              <div className="relative">
                {/* Main pole */}
                <div className={`absolute bottom-0 ${isMobile ? 'h-32 w-3' : 'h-48 w-4'} bg-amber-700 rounded-full`}></div>
                {/* Platforms */}
                <div className={`absolute ${isMobile ? 'bottom-20 right-0 h-4 w-16' : 'bottom-32 right-0 h-6 w-20'} bg-amber-600 rounded-full`}></div>
                <div className={`absolute ${isMobile ? 'bottom-12 right-1 h-4 w-12' : 'bottom-20 right-2 h-6 w-16'} bg-amber-600 rounded-full`}></div>
                <div className={`absolute ${isMobile ? 'bottom-4 right-2 h-4 w-8' : 'bottom-8 right-4 h-6 w-12'} bg-amber-600 rounded-full`}></div>
                {/* Scratching post */}
                <div className={`absolute bottom-0 ${isMobile ? 'right-8 h-20 w-2' : 'right-12 h-32 w-3'} bg-amber-700 rounded-full`}></div>
                {/* Toys */}
                <div className={`absolute ${isMobile ? 'bottom-16 right-10 w-2 h-2' : 'bottom-28 right-16 w-3 h-3'} bg-red-500 rounded-full`}></div>
                <div className={`absolute ${isMobile ? 'bottom-8 right-8 w-2 h-2' : 'bottom-16 right-14 w-3 h-3'} bg-yellow-500 rounded-full`}></div>
              </div>
            </div>

            {/* Window */}
            <div className={`absolute top-4 left-4 ${isMobile ? 'h-20 w-32' : 'h-32 w-48'} bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg border-2 border-amber-600`}>
              <div className="absolute inset-2 border border-amber-600 rounded"></div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-600"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-600"></div>
            </div>

            {/* Floor patterns */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-800"></div>
            <div className="absolute bottom-2 left-4 right-4 h-1 bg-amber-700 rounded-full"></div>

            {/* Cats */}
            {isInitialized && cats.map(cat => (
              <div
                key={cat.id}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation ${
                  cat.isPetted ? 'animate-pulse' : ''
                }`}
                style={{
                  left: `${cat.x}px`,
                  top: `${cat.y}px`,
                  transform: cat.vx < 0 ? 'scaleX(-1)' : 'scaleX(1)',
                  touchAction: 'manipulation'
                }}
                onClick={(e) => handleCatInteraction(cat.id, e)}
                onTouchStart={(e) => handleCatInteraction(cat.id, e)}
                onTouchEnd={(e) => e.preventDefault()}
              >
                <Image
                  src={cat.image}
                  alt={`Cat ${cat.id + 1}`}
                  width={isMobile ? 80 : 100}
                  height={isMobile ? 80 : 100}
                  className="drop-shadow-lg pointer-events-none"
                  draggable={false}
                />
                {cat.isPetted && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce pointer-events-none">
                    ❤️
                  </div>
                )}
                {cat.petCount > 0 && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-amber-800 bg-white px-2 py-1 rounded-full shadow-md pointer-events-none">
                    {cat.petCount}
                  </div>
                )}
              </div>
            ))}

            {/* Petting particles */}
            {isInitialized && cats.some(cat => cat.isPetted) && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {!isInitialized && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl animate-spin">🐱</div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center px-4">
            <p className="font-satisfy text-lg text-gray-700">
              {isMobile ? 'Tap the cats to pet them!' : 'Click on the cats to pet them!'} They love attention and will show hearts when petted.
            </p>
            <div className={`mt-4 flex justify-center ${isMobile ? 'flex-col space-y-4' : 'space-x-8'} text-sm text-gray-600`}>
              <div className="flex items-center justify-center space-x-2">
                <Image src="/aspenified.png" alt="Aspen" width={30} height={30} className="rounded-full" />
                <span>Aspen</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Image src="/cypressified.png" alt="Cypress" width={30} height={30} className="rounded-full" />
                <span>Cypress</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Image src="/fionified.png" alt="Fiona" width={30} height={30} className="rounded-full" />
                <span>Fiona</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
