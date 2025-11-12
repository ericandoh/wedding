'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../_components/language-provider';
import { 
  GiftIcon,
  HeartIcon,
  SparklesIcon,
  CakeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Gift {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  icon: number; // 0-4 to select icon type
}

export default function Registry() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'honeymoon' | 'catToys' | 'charity' | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);

  const registryOptions = [
    {
      id: 'honeymoon',
      title: t.honeymoonFund,
      image: '/registry/honeymoon.jpg',
      hasVenmo: true,
    },
    {
      id: 'charity',
      title: t.charityOfOurChoice,
      image: '/registry/donation.jpg',
      hasVenmo: false,
    },
    {
      id: 'catToys',
      title: t.toysForOurCats,
      image: '/registry/toyfund.jpg',
      hasVenmo: true,
    },
  ];

  const handleCardClick = (optionId: string) => {
    if (optionId === 'honeymoon') {
      setSelectedOption('honeymoon');
    } else if (optionId === 'catToys') {
      setSelectedOption('catToys');
    } else if (optionId === 'charity') {
      setSelectedOption('charity');
    }
  };

  const closeDialog = () => {
    setSelectedOption(null);
  };

  const getVenmoMessage = () => {
    if (selectedOption === 'honeymoon') {
      return t.venmoMessageHoneymoon;
    } else if (selectedOption === 'catToys') {
      return t.venmoMessageCatToys;
    }
    return '';
  };

  useEffect(() => {
    // Generate random gifts
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const giftCount = 25;
    const newGifts: Gift[] = [];
    
    for (let i = 0; i < giftCount; i++) {
      // 80% chance of GiftIcon (0), 20% chance of others (1-4)
      const randomValue = Math.random();
      let iconType;
      if (randomValue < 0.8) {
        iconType = 0; // GiftIcon
      } else {
        iconType = 1 + Math.floor(Math.random() * 4); // Random 1-4 for other icons
      }
      
      newGifts.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position (0-100%)
        delay: Math.random() * 3, // Random delay (0-3s)
        duration: 2 + Math.random() * 2, // Random duration (2-4s)
        size: 24 + Math.random() * 24, // Random size (24-48px)
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: iconType,
      });
    }
    
    setGifts(newGifts);
  }, []);

  const getGiftIcon = (iconType: number, size: number, color: string) => {
    const iconProps = { 
      width: size, 
      height: size, 
      style: { color },
      strokeWidth: 1.5
    };
    
    switch (iconType) {
      case 0:
        return <GiftIcon {...iconProps} />;
      case 1:
        return <HeartIcon {...iconProps} />;
      case 2:
        return <SparklesIcon {...iconProps} />;
      case 3:
        return <CakeIcon {...iconProps} />;
      case 4:
        return <StarIcon {...iconProps} />;
      default:
        return <GiftIcon {...iconProps} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in relative">
      {/* Falling Gifts Animation - Fixed container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="gift-fall absolute"
            style={{
              left: `${gift.left}%`,
              top: '-100px',
              animationDelay: `${gift.delay}s`,
              animationDuration: `${gift.duration}s`,
            }}
          >
            {getGiftIcon(gift.icon, gift.size, gift.color)}
          </div>
        ))}
      </div>
      
      <div className="py-8 text-center relative z-10">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.registry}
        </h1>
        <p className="text-body text-xl text-gray-600 mb-4">
          {t.registrySubtitle}
        </p>
        <p className="text-body-lg text-lg text-gray-700">
          {t.registryHowever}
        </p>
      </div>

      <div className="flex-grow py-12 relative z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {registryOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => handleCardClick(option.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="aspect-square relative">
                  <Image
                    src={option.image}
                    alt={option.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-card-header text-2xl text-gray-800">
                    {option.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venmo Instructions Dialog */}
      {selectedOption && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={closeDialog}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-card-header text-2xl text-gray-800">
                {t.venmoInstructions}
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-left">
              {selectedOption === 'charity' ? (
                <div>
                  <p className="text-body text-gray-700 text-center">
                    {t.charityComingSoon}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-body text-gray-700 mb-2">{t.venmoStep1}</p>
                    <a 
                      href="https://account.venmo.com/u/Eric-Oh-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      https://account.venmo.com/u/Eric-Oh-2
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-body text-gray-700 mb-2">{t.venmoStep2}</p>
                    <div className="bg-gray-100 rounded px-4 py-2 font-mono text-gray-800">
                      {getVenmoMessage()}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDialog}
                className="text-button border-2 border-gray-800 px-6 py-2 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes giftFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          80% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1;
          }
          85% {
            transform: translateY(calc(100vh - 30px)) rotate(360deg);
            opacity: 1;
          }
          90% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1;
          }
          93% {
            transform: translateY(calc(100vh - 15px)) rotate(360deg);
            opacity: 1;
          }
          96% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .gift-fall {
          animation-name: giftFall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
