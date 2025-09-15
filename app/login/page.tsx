'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function LoginPage() {
  const [keyphrase, setKeyphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-05-23T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyphrase }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid keyphrase. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div 
        className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 relative"
      >
      {/* Mobile background image - hidden on larger screens */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat bg-center md:hidden"
        style={{
          backgroundImage: 'url(/login_mobile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
      {/* Desktop background image - hidden on mobile */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat bg-center hidden md:block"
        style={{
          backgroundImage: 'url(/login.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
      <div className="max-w-md w-full relative z-10">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl text-white" style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)', 
              fontFamily: 'Dancing Script, cursive',
              fontWeight: '600',
              letterSpacing: '0.02em'
            }}>
              Hang and Eric
            </h1>
            <div className="space-y-2">
              <p className="text-2xl text-white" style={{ 
                textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)', 
                fontFamily: 'Caveat, cursive',
                fontWeight: '500',
                letterSpacing: '0.01em'
              }}>
                May 23, 2026
              </p>
              <p className="text-lg text-white" style={{ 
                textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)', 
                fontFamily: 'Caveat, cursive',
                fontWeight: '400',
                letterSpacing: '0.01em'
              }}>
                Da Nang, Vietnam
              </p>
            </div>
            
            {/* Countdown Timer */}
            <p className="text-base text-white" style={{ 
              textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)', 
              fontFamily: 'Kalam, cursive',
              fontWeight: '300',
              letterSpacing: '0.01em'
            }}>
              {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="keyphrase" className="sr-only">
                Secret Keyphrase
              </label>
              <input
                id="keyphrase"
                name="keyphrase"
                type={showPassword ? "text" : "password"}
                required
                className="relative block w-full px-3 py-2 pr-12 border border-gray-300 placeholder-gray-400 text-gray-800 bg-white/90 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-lg"
                style={{ 
                  fontFamily: 'Kalam, cursive',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
                placeholder="hint: cypress, aspen, fiona..."
                value={keyphrase}
                onChange={(e) => setKeyphrase(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-white/80 px-3 py-2 rounded-md shadow-lg" style={{ 
                fontFamily: 'Kalam, cursive',
                fontWeight: '400',
                letterSpacing: '0.01em'
              }}>
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-medium py-3 px-8 transition-all duration-300 font-satisfy text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {isLoading ? 'Verifying...' : 'Access Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
