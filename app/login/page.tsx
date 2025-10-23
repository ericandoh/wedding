'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../_components/language-provider';
import LanguageSwitcher from '../_components/language-switcher';

export default function LoginPage() {
  const [keyphrase, setKeyphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const router = useRouter();
  const { t } = useLanguage();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyphrase }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(t.invalidKeyphrase);
      }
    } catch (err) {
      setError(t.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="relative flex min-h-screen items-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 justify-center page-fade-in">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        {/* Mobile background image - hidden on larger screens */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: 'url(/login_mobile.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        {/* Desktop background image - hidden on mobile */}
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{
            backgroundImage: 'url(/login.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        {/* White overlay on top of background images */}
        <div className="absolute inset-0 bg-white candle-flicker" />
        <div className="relative z-10 w-full max-w-md">
            <div className="space-y-8">
              {/* Title Section */}
              <div className="space-y-4 text-center">
                <h1
                  className="text-title text-gray-800"
                  style={{
                    fontSize: '4rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.hangAndEric}
                </h1>
                <div className="space-y-2">
                  <p
                    className="text-section-header text-gray-800"
                    style={{
                      fontSize: '2rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {t.may232026}
                  </p>
                  <p
                    className="text-card-header text-gray-800"
                    style={{
                      letterSpacing: '0.01em',
                    }}
                  >
                    {t.daNangVietnam}
                  </p>
                </div>

                {/* Countdown Timer */}
                <p
                  className="text-body text-gray-700"
                  style={{
                    letterSpacing: '0.01em',
                  }}
                >
                  {timeLeft.days} {t.days}, {timeLeft.hours} {t.hours}, {timeLeft.minutes}{' '}
                  {t.minutes}, {timeLeft.seconds} {t.seconds}
                </p>
              </div>

              {/* Form Section */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <label htmlFor="keyphrase" className="sr-only">
                    {t.secretKeyphrase}
                  </label>
                  <input
                    id="keyphrase"
                    name="keyphrase"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="text-input text-placeholder relative block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-gray-800 shadow-sm focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    style={{
                      letterSpacing: '0.01em',
                    }}
                    placeholder={t.hint}
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
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {error && (
                  <div
                    className="text-error rounded-md bg-red-50 px-3 py-2 shadow-sm"
                    style={{
                      letterSpacing: '0.01em',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-button-lg bg-gray-800 px-8 py-3 text-white transition-all duration-300 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? t.verifying : t.accessWebsite}
                  </button>
                </div>
              </form>
            </div>
        </div>
      </div>
  );
}
