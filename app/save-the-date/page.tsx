'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';

export default function SaveTheDate() {
  const { t } = useLanguage();
  const [showCard, setShowCard] = useState(false);
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    // Start card unroll after a brief delay
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 200);
    
    // Show text right after card unroll completes (0.5s + 0.2s + small buffer)
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);
    
    return () => {
      clearTimeout(cardTimer);
      clearTimeout(textTimer);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      {/* Title text - invisible then fades in */}
      <div className="bg-white py-8 text-center">
        <div className={`transition-opacity duration-1000 ${showText ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
            {t.saveTheDateNav}
          </h1>
          <p className="text-subtitle text-xl text-gray-600">
            {t.saveTheDateSubtitle}
          </p>
        </div>
      </div>

      {/* Card Unroll Animation */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl px-6">
          {/* Save the Date Card */}
          <div className={`card-reveal ${showCard ? 'revealed' : ''} mb-8`}>
            <img
              src="/save_the_date.png"
              alt="Save the Date"
              className="mx-auto max-w-full h-auto"
            />
          </div>
          
          {/* Additional text content - fades in after title */}
          {showText && (
            <div className="text-center text-fade-in">
              {/* Message */}
              <p className="text-body-lg mb-6 text-gray-700">
                {t.noRsvpNeededMessage}
              </p>

              {/* RSVP Anyways Button */}
              <Link
                href="/rsvp"
                className="text-button inline-block border border-gray-400 px-4 py-2 text-sm text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-800"
              >
                {t.rsvpAnyways}
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .card-reveal {
          overflow: hidden;
          position: relative;
        }
        
        .card-reveal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          transform: translateY(0);
          transition: transform 0.5s ease-out;
          z-index: 1;
        }
        
        .card-reveal.revealed::before {
          transform: translateY(100%);
        }
        
        .card-reveal img {
          position: relative;
          z-index: 0;
        }
        
        .text-fade-in {
          animation: textFadeIn 1s ease-in;
        }
        
        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
