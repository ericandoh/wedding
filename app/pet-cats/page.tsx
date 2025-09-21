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
  isDragging: boolean;
  speedBoostEndTime: number;
}

interface LeaderboardEntry {
  name: string;
  cypress: number;
  aspen: number;
  fiona: number;
  total: number;
}

export default function PetCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [roomSize, setRoomSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [draggedCatId, setDraggedCatId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [roomRect, setRoomRect] = useState<DOMRect | null>(null);
  const [immediateDragPos, setImmediateDragPos] = useState<{ [catId: number]: { x: number, y: number } }>({});
  const roomRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastInteractionTime = useRef<number>(0);

  const catImages = [
    '/aspenified.png',
    '/cypressified.png', 
    '/fionified.png'
  ];

  // API functions
  const fetchLeaderboard = async (forceRefresh = false) => {
    try {
      setIsLoadingLeaderboard(true);
      
      if (forceRefresh) {
        // Clear current leaderboard data to force a fresh fetch
        setLeaderboard([]);
      }
      
      const response = await fetch('/api/cats/leaderboard');
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      } else {
        console.error('Failed to fetch leaderboard, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const saveCatToSpreadsheet = async (catType: 'cypress' | 'aspen' | 'fiona') => {
    if (!userName) return;
    
    try {
      const response = await fetch('/api/cats/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          catType: catType
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save cat to spreadsheet');
      }
    } catch (error) {
      console.error('Error saving cat to spreadsheet:', error);
    }
  };

  const syncToSpreadsheet = async () => {
    if (!userName) return;
    
    try {
      setIsLoading(true);
      
      // Get current user data from local leaderboard
      const currentUser = leaderboard.find(entry => entry.name === userName);
      if (!currentUser) return;
      
      // Send all current counts to the API
      const response = await fetch('/api/cats/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          catType: 'sync', // Special type for full sync
          existingUser: {
            cypress: currentUser.cypress,
            aspen: currentUser.aspen,
            fiona: currentUser.fiona
              }
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to sync to spreadsheet');
      }
    } catch (error) {
      console.error('Error syncing to spreadsheet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserName = (name: string) => {
    localStorage.setItem('pet-cats-username', name.toLowerCase());
  };

  const loadUserName = (): string => {
    return localStorage.getItem('pet-cats-username') || '';
  };

  const clearUserIdentity = () => {
    localStorage.removeItem('pet-cats-username');
    setUserName('');
    setHasInteracted(false);
    setIsUserDataLoaded(false);
    
    // Reset all cat pet counters
    setCats(prevCats =>
      prevCats.map(cat => ({
        ...cat,
        petCount: 0,
        isPetted: false,
        lastPetTime: 0,
        isDragging: false,
        speedBoostEndTime: 0
      }))
    );
  };

  // Initialize user data and fetch leaderboard
  useEffect(() => {
    const storedUserName = loadUserName();
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    // Fetch leaderboard with a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      fetchLeaderboard();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Load user's existing counters when leaderboard data is available (only on initial load)
  useEffect(() => {
    if (userName && leaderboard.length > 0 && !hasInteracted) {
      const existingUser = leaderboard.find(entry => entry.name === userName);
      if (existingUser) {
        // Update cat counters based on existing leaderboard data
        setCats(prevCats =>
          prevCats.map((cat, index) => {
            let petCount = 0;
            // Map cat index to the correct counter based on image
            if (catImages[index] === '/cypressified.png') {
              petCount = existingUser.cypress;
            } else if (catImages[index] === '/aspenified.png') {
              petCount = existingUser.aspen;
            } else if (catImages[index] === '/fionified.png') {
              petCount = existingUser.fiona;
            }
            
            return {
              ...cat,
              petCount: petCount
            };
          })
        );
      }
      // Mark user data as loaded regardless of whether user exists in leaderboard
      setIsUserDataLoaded(true);
    } else if (!userName && leaderboard.length > 0) {
      // If no user name but leaderboard is loaded, mark as loaded
      setIsUserDataLoaded(true);
    }
  }, [userName, leaderboard, hasInteracted]);

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
        lastPetTime: 0,
        isDragging: false,
        speedBoostEndTime: 0
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

  // Global mouse and touch event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (draggedCatId === null) return;
      
      const dragThreshold = 5; // pixels
      const distance = Math.sqrt(
        Math.pow(event.clientX - dragStartPos.x, 2) + 
        Math.pow(event.clientY - dragStartPos.y, 2)
      );
      
      // Only start dragging if we've moved beyond the threshold
      if (!isDragging && distance > dragThreshold) {
        setIsDragging(true);
        // Mark cat as being dragged
        setCats(prevCats =>
          prevCats.map(c =>
            c.id === draggedCatId ? { ...c, isDragging: true } : c
          )
        );
      }
      
      // Only update position if we're actually dragging
      if (isDragging && roomRect) {
        event.preventDefault();
        const catSize = isMobile ? 80 : 100;
        const margin = 10;
        
        // Calculate position relative to the room container using cached rect
        const newX = event.clientX - roomRect.left - dragOffset.x;
        const newY = event.clientY - roomRect.top - dragOffset.y;
        
        // Constrain to room bounds
        const constrainedX = Math.max(margin, Math.min(roomRect.width - catSize - margin, newX));
        const constrainedY = Math.max(margin, Math.min(roomRect.height - catSize - margin, newY));
        
        // Update immediate drag position for smooth rendering
        setImmediateDragPos(prev => ({
          ...prev,
          [draggedCatId]: { x: constrainedX, y: constrainedY }
        }));
        
        // Also update the cat state for final position
        setCats(prevCats =>
          prevCats.map(cat =>
            cat.id === draggedCatId
              ? { ...cat, x: constrainedX, y: constrainedY }
              : cat
          )
        );
      }
    };

    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (draggedCatId === null) return;
      
      const dragThreshold = 0; // pixels
      const touch = event.touches[0];
      const distance = Math.sqrt(
        Math.pow(touch.clientX - dragStartPos.x, 2) + 
        Math.pow(touch.clientY - dragStartPos.y, 2)
      );
      
      // Only start dragging if we've moved beyond the threshold
      if (!isDragging && distance > dragThreshold) {
        setIsDragging(true);
        // Mark cat as being dragged
        setCats(prevCats =>
          prevCats.map(c =>
            c.id === draggedCatId ? { ...c, isDragging: true } : c
          )
        );
      }
      
      // Only update position if we're actually dragging
      if (isDragging && roomRect && event.touches[0]) {
        event.preventDefault();
        const catSize = isMobile ? 80 : 100;
        const margin = 10;
        
        // Calculate position relative to the room container using cached rect
        const newX = touch.clientX - roomRect.left - dragOffset.x;
        const newY = touch.clientY - roomRect.top - dragOffset.y;
        
        // Constrain to room bounds
        const constrainedX = Math.max(margin, Math.min(roomRect.width - catSize - margin, newX));
        const constrainedY = Math.max(margin, Math.min(roomRect.height - catSize - margin, newY));
        
        // Update immediate drag position for smooth rendering
        setImmediateDragPos(prev => ({
          ...prev,
          [draggedCatId]: { x: constrainedX, y: constrainedY }
        }));
        
        // Also update the cat state for final position
        setCats(prevCats =>
          prevCats.map(cat =>
            cat.id === draggedCatId
              ? { ...cat, x: constrainedX, y: constrainedY }
              : cat
          )
        );
      }
    };

    const handleGlobalMouseUp = () => {
      if (draggedCatId !== null) {
        if (isDragging) {
          // Was dragging - apply speed boost
          const now = Date.now();
          setCats(prevCats =>
            prevCats.map(cat =>
              cat.id === draggedCatId
                ? {
                    ...cat,
                    isDragging: false,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    speedBoostEndTime: now + 3000 // 3 seconds of speed boost
                  }
                : cat
            )
          );
        } else {
          // Was just a tap - handle as pet interaction
          handleCatInteraction(draggedCatId);
          
          // Reset dragging state without speed boost
          setCats(prevCats =>
            prevCats.map(cat =>
              cat.id === draggedCatId
                ? { ...cat, isDragging: false }
                : cat
            )
          );
        }
        setDraggedCatId(null);
        setIsDragging(false);
        setRoomRect(null); // Clear cached room rect
        setImmediateDragPos(prev => {
          const newPos = { ...prev };
          delete newPos[draggedCatId];
          return newPos;
        });
      }
    };

    const handleGlobalTouchEnd = () => {
      if (draggedCatId !== null) {
        if (isDragging) {
          // Was dragging - apply speed boost
          const now = Date.now();
          setCats(prevCats =>
            prevCats.map(cat =>
              cat.id === draggedCatId
                ? {
                    ...cat,
                    isDragging: false,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    speedBoostEndTime: now + 3000 // 3 seconds of speed boost
                  }
                : cat
            )
          );
        } else {
          // Was just a tap - handle as pet interaction
          handleCatInteraction(draggedCatId);
          
          // Reset dragging state without speed boost
          setCats(prevCats =>
            prevCats.map(cat =>
              cat.id === draggedCatId
                ? { ...cat, isDragging: false }
                : cat
            )
          );
        }
        setDraggedCatId(null);
        setIsDragging(false);
        setRoomRect(null); // Clear cached room rect
        setImmediateDragPos(prev => {
          const newPos = { ...prev };
          delete newPos[draggedCatId];
          return newPos;
        });
      }
    };

    if (draggedCatId !== null) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [draggedCatId, dragOffset, roomSize, isMobile, isDragging, dragStartPos, roomRect]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setCats(prevCats => 
        prevCats.map(cat => {
          // Don't animate cats that are being dragged
          if (cat.isDragging) {
            return cat;
          }
          
          const catSize = isMobile ? 80 : 100;
          const margin = 10;
          const minVelocity = 0.3; // Minimum velocity to prevent cats from getting stuck
          const now = Date.now();
          
          // Check if cat has speed boost
          const hasSpeedBoost = now < cat.speedBoostEndTime;
          const speedMultiplier = hasSpeedBoost ? 2.5 : 1; // 2.5x speed during boost
          
          let newX = cat.x + (cat.vx * speedMultiplier);
          let newY = cat.y + (cat.vy * speedMultiplier);
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

  const handleCatInteraction = (catId: number) => {
    // Don't allow interactions until user data is loaded
    if (!isUserDataLoaded) {
      return;
    }
    
    const now = Date.now();
    
    // More aggressive debouncing - check if interaction happened within 500ms
    if (now - lastInteractionTime.current < 500) {
      return;
    }
    lastInteractionTime.current = now;
    
    // If user hasn't interacted before and no name is set, show name dialog
    if (!hasInteracted && !userName) {
      setShowNameDialog(true);
      setHasInteracted(true);
      return;
    }
    
    setCats(prevCats => {
      const updatedCats = prevCats.map(cat =>
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
      );

      // Update leaderboard optimistically based on updated cat counts
      if (userName) {
        const cypressCount = updatedCats.find(cat => catImages[cat.id] === '/cypressified.png')?.petCount || 0;
        const aspenCount = updatedCats.find(cat => catImages[cat.id] === '/aspenified.png')?.petCount || 0;
        const fionaCount = updatedCats.find(cat => catImages[cat.id] === '/fionified.png')?.petCount || 0;
        
        // Update leaderboard with current counts
        setLeaderboard(prevLeaderboard => {
          const existingUserIndex = prevLeaderboard.findIndex(entry => entry.name === userName);
          
          if (existingUserIndex >= 0) {
            // Update existing user
            const updatedLeaderboard = [...prevLeaderboard];
            const user = updatedLeaderboard[existingUserIndex];
            
            user.cypress = cypressCount;
            user.aspen = aspenCount;
            user.fiona = fionaCount;
            user.total = cypressCount + aspenCount + fionaCount;
            
            // Sort by total pets (descending)
            updatedLeaderboard.sort((a, b) => b.total - a.total);
            
            return updatedLeaderboard;
          } else {
            // Add new user
            const newUser = {
              name: userName,
              cypress: cypressCount,
              aspen: aspenCount,
              fiona: fionaCount,
              total: cypressCount + aspenCount + fionaCount
            };
            
            const updatedLeaderboard = [...prevLeaderboard, newUser];
            updatedLeaderboard.sort((a, b) => b.total - a.total);
            
            return updatedLeaderboard;
          }
        });
      }

      return updatedCats;
    });

    // Save to spreadsheet after updating
    if (userName) {
      // Map cat ID to cat type based on image
      const catType = catImages[catId] === '/cypressified.png' ? 'cypress' :
                     catImages[catId] === '/aspenified.png' ? 'aspen' : 'fiona';
      
      // Save individual cat increment to spreadsheet
      saveCatToSpreadsheet(catType);
    }
  };

  // Drag and drop handlers - unified for mouse and touch
  const handlePointerStart = (catId: number, event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    
    // Don't allow dragging until user data is loaded
    if (!isUserDataLoaded) {
      return;
    }
    
    const cat = cats.find(c => c.id === catId);
    if (!cat || !roomRef.current) return;
    
    // Capture room rect once for consistent positioning
    const currentRoomRect = roomRef.current.getBoundingClientRect();
    setRoomRect(currentRoomRect);
    
    // Extract coordinates - handle both mouse and touch events
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedCatId(catId);
    setDragStartPos({ x: clientX, y: clientY });
    setIsDragging(false); // Start as not dragging
  };


  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      const name = nameInput.trim().toLowerCase();
      setUserName(name);
      saveUserName(name);
      setShowNameDialog(false);
      setNameInput('');
      
      // Check if user already exists in leaderboard and load their counters
      const existingUser = leaderboard.find(entry => entry.name === name);
      if (existingUser) {
        // Update cat counters based on existing leaderboard data
        setCats(prevCats =>
          prevCats.map((cat, index) => {
            let petCount = 0;
            // Map cat index to the correct counter based on image
            if (catImages[index] === '/cypressified.png') {
              petCount = existingUser.cypress;
            } else if (catImages[index] === '/aspenified.png') {
              petCount = existingUser.aspen;
            } else if (catImages[index] === '/fionified.png') {
              petCount = existingUser.fiona;
            }
            
            return {
              ...cat,
              petCount: petCount
            };
          })
        );
      }
      // Mark user data as loaded when name is submitted
      setIsUserDataLoaded(true);
    }
  };

  const handleNameDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Pet Cats
        </h1>
        <p className="text-body text-xl text-gray-600">
          Click on the cats to pet them!
        </p>
        {isLoading && (
          <div className="mt-2 text-amber-600 font-medium">
            Updating leaderboard...
          </div>
        )}
        
        
        {/* User info */}
        {userName && (
          <div className="mt-6 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-amber-100 px-4 py-2 rounded-full border-2 border-amber-300">
                <span className="text-body text-lg text-amber-800">
                  Playing as: <span className="font-bold">{userName}</span>
                </span>
              </div>
              <button
                onClick={clearUserIdentity}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                Clear Identity
              </button>
            </div>
          </div>
        )}
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
                className={`absolute transition-[opacity,background-color,border-color,text-decoration-color,fill,stroke] duration-200 touch-manipulation ${
                  isUserDataLoaded ? 'cursor-pointer hover:opacity-90 active:opacity-80' : 'cursor-not-allowed opacity-60'
                } ${
                  cat.isPetted ? 'animate-pulse' : ''
                } ${
                  cat.isDragging ? 'z-50 opacity-80' : ''
                }`}
                style={{
                  transform: (() => {
                    const x = cat.isDragging && immediateDragPos[cat.id] ? immediateDragPos[cat.id].x : cat.x;
                    const y = cat.isDragging && immediateDragPos[cat.id] ? immediateDragPos[cat.id].y : cat.y;
                    const dragScale = cat.isDragging ? 1.1 : 1;
                    const flipScale = cat.vx < 0 ? -1 : 1;
                    return `translate(${x}px, ${y}px) scale(${dragScale}) scaleX(${flipScale})`;
                  })(),
                  touchAction: 'manipulation',
                  userSelect: 'none'
                }}
                onMouseDown={(e) => handlePointerStart(cat.id, e)}
                onTouchStart={(e) => handlePointerStart(cat.id, e)}
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
                {Date.now() < cat.speedBoostEndTime && (
                  <div className="absolute -top-2 -left-2 text-xl animate-pulse pointer-events-none">
                    ⚡
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
            
            {/* User data loading indicator */}
            {isInitialized && !isUserDataLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="text-center">
                  <div className="text-2xl animate-spin mb-2">🐱</div>
                  <div className="text-sm text-gray-600 font-medium">Loading your cat scores...</div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center px-4">
            <p className="text-body text-lg text-gray-700">
              {isMobile ? 'Tap the cats to pet them or drag them around!' : 'Click on the cats to pet them or drag them around!'} They love attention and will show hearts when petted.
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

      {/* Leaderboard Section */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Leaderboard Header with Refresh Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body text-2xl font-bold text-amber-800">🏆 Leaderboard</h3>
            {userName && (
              <button
                onClick={async () => {
                  await syncToSpreadsheet();
                  await fetchLeaderboard(true);
                }}
                disabled={isLoading || isLoadingLeaderboard}
                className="bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                {isLoading || isLoadingLeaderboard ? 'Syncing...' : 'Refresh'}
              </button>
            )}
          </div>
          
          {isLoadingLeaderboard ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
              <div className="text-center py-4">
                <div className="text-amber-600">Loading leaderboard...</div>
              </div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.name}
                    className={`px-4 py-3 rounded-lg ${
                      entry.name === userName 
                        ? 'bg-amber-200 border-2 border-amber-400' 
                        : 'bg-white border border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-amber-700">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </span>
                        <span className={`font-medium ${entry.name === userName ? 'text-amber-800' : 'text-gray-700'}`}>
                          {entry.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-700">{entry.total} total</div>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Image src="/cypressified.png" alt="Cypress" width={20} height={20} className="rounded-full" />
                        <span className="text-gray-600">{entry.cypress}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Image src="/aspenified.png" alt="Aspen" width={20} height={20} className="rounded-full" />
                        <span className="text-gray-600">{entry.aspen}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Image src="/fionified.png" alt="Fiona" width={20} height={20} className="rounded-full" />
                        <span className="text-gray-600">{entry.fiona}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
              <div className="text-center py-4">
                <div className="text-amber-600">No leaderboard data yet. Start petting cats to see the leaderboard!</div>
              </div>
            </div>
          )}

          {/* Personal Stats */}
          {userName && leaderboard.length > 0 && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
              <h4 className="text-body text-lg font-bold text-blue-800 mb-3 text-center">Your Stats</h4>
              {(() => {
                const userEntry = leaderboard.find(entry => entry.name === userName);
                if (!userEntry) return null;
                
                return (
                  <div className="flex justify-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Image src="/cypressified.png" alt="Cypress" width={24} height={24} className="rounded-full" />
                        <span className="font-bold text-blue-700">{userEntry.cypress}</span>
                      </div>
                      <div className="text-xs text-gray-600">Cypress</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Image src="/aspenified.png" alt="Aspen" width={24} height={24} className="rounded-full" />
                        <span className="font-bold text-blue-700">{userEntry.aspen}</span>
                      </div>
                      <div className="text-xs text-gray-600">Aspen</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Image src="/fionified.png" alt="Fiona" width={24} height={24} className="rounded-full" />
                        <span className="font-bold text-blue-700">{userEntry.fiona}</span>
                      </div>
                      <div className="text-xs text-gray-600">Fiona</div>
                    </div>
                    <div className="text-center border-l border-blue-300 pl-4">
                      <div className="font-bold text-blue-700 text-lg">{userEntry.total}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Name Registration Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-body text-2xl font-bold text-gray-800 mb-4 text-center">
              🐱 Welcome to Pet Cats!
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Enter your name to join the leaderboard:
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={handleNameDialogKeyPress}
                placeholder="Your name"
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 text-center text-lg"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleNameSubmit}
                  disabled={!nameInput.trim()}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Join Leaderboard
                </button>
                <button
                  onClick={() => {
                    setShowNameDialog(false);
                    setHasInteracted(false);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
