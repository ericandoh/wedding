'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './language-provider';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const GOOGLE_PHOTOS_URL = 'https://photos.app.goo.gl/74az5jumEJEpq45D6';
const APPLE_ALBUM_URL =
  'https://www.icloud.com/photos/#/sharedalbums/sa,841C363F-6C5A-4057-9565-824B5AF6316C/';

export default function PhotosSection() {
  const { t } = useLanguage();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [appleEmail, setAppleEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [originalAppleEmail, setOriginalAppleEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('rsvp-email');
    if (email) {
      setUserEmail(email.trim());
    }
  }, []);

  const checkRSVP = async (): Promise<boolean> => {
    if (!userEmail) return false;
    try {
      const response = await fetch('/api/messages/check-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail.trim().toLowerCase() }),
      });
      const data = await response.json();
      return data.hasRSVP || false;
    } catch (err) {
      console.error('Error checking RSVP:', err);
      return false;
    }
  };

  const handleAppleClick = async () => {
    setError(null);

    if (!userEmail) {
      alert(t.pleaseRSVPFirst);
      return;
    }

    setIsChecking(true);
    try {
      const hasRSVP = await checkRSVP();
      if (!hasRSVP) {
        alert(t.pleaseRSVPFirst);
        return;
      }

      const statusResponse = await fetch('/api/apple-photos/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail.trim().toLowerCase() }),
      });
      const statusData = await statusResponse.json();

      if (!statusResponse.ok) {
        console.error('Error checking Apple Photos status:', statusData.error);
        setError(t.applePhotosError || 'Something went wrong. Please try again.');
        setShowDialog(true);
        setAppleEmail(userEmail);
        setIsPendingRequest(false);
        return;
      }

      if (statusData.hasRequest && statusData.alreadyAdded) {
        window.location.href = APPLE_ALBUM_URL;
        return;
      }

      const initialAppleEmail = statusData.appleEmail || userEmail || '';
      setAppleEmail(initialAppleEmail);
      setOriginalAppleEmail(initialAppleEmail);
      const existingPending =
        !!statusData.hasRequest && !statusData.alreadyAdded;
      setHasExistingRequest(existingPending);
      setIsPendingRequest(existingPending);
      setShowDialog(true);
    } catch (err) {
      console.error('Error handling Apple Photos click:', err);
      setError(t.applePhotosError || 'Something went wrong. Please try again.');
      setShowDialog(true);
      setAppleEmail(userEmail || '');
      setOriginalAppleEmail(userEmail || '');
      setHasExistingRequest(false);
      setIsPendingRequest(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !appleEmail.trim() || isPendingRequest) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/apple-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rsvpEmail: userEmail.trim().toLowerCase(),
          appleEmail: appleEmail.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save request');
      }

      setHasExistingRequest(true);
      setOriginalAppleEmail(appleEmail.trim());
      setIsPendingRequest(true);
      setShowDialog(false);
    } catch (err) {
      console.error('Error submitting Apple Photos request:', err);
      setError(t.applePhotosError || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="mb-16">
        <h2 className="text-title text-3xl font-bold text-gray-800 mb-4 text-center">
          {t.photos}
        </h2>
        <p className="text-body text-xl text-gray-600 mb-8 text-center">
          {t.pleaseAddYourPhotosHere}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-2xl mx-auto">
          <a
            href={GOOGLE_PHOTOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-gray-200 rounded-lg px-6 py-4 transition-all duration-300 hover:border-gray-400 hover:shadow-md"
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span className="text-body text-lg font-medium text-gray-800">
              {t.googlePhotosAlbum}
            </span>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-auto" />
          </a>
          <button
            type="button"
            onClick={handleAppleClick}
            className="flex items-center gap-4 border border-gray-200 rounded-lg px-6 py-4 bg-white transition-all duration-300 hover:border-gray-400 hover:shadow-md text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200">
              <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
            <span className="text-body text-lg font-medium text-gray-600">
              {t.applePhotosAlbum}
            </span>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-auto" />
          </button>
        </div>
      </section>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-card-header text-2xl text-gray-800 mb-2">
              {t.applePhotosDialogTitle}
            </h2>
            <p className="text-body text-gray-600 mb-4">
              {t.applePhotosDialogDescription}
            </p>
            {error && (
              <p className="text-body text-sm text-red-600 mb-3">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-body text-sm font-medium text-gray-700 mb-1">
                  {t.applePhotosRsvpEmailLabel}
                </label>
                <input
                  type="email"
                  value={userEmail || ''}
                  disabled
                  className="text-input w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-body text-sm font-medium text-gray-700 mb-1">
                  {t.applePhotosAppleEmailLabel}
                </label>
                <input
                  type="email"
                  value={appleEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAppleEmail(value);
                    if (
                      hasExistingRequest &&
                      value.trim().toLowerCase() ===
                        originalAppleEmail.trim().toLowerCase()
                    ) {
                      setIsPendingRequest(true);
                    } else {
                      setIsPendingRequest(false);
                    }
                  }}
                  className="text-input w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  placeholder={t.applePhotosAppleEmailPlaceholder}
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="text-button border-2 border-gray-300 px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !appleEmail.trim() || isPendingRequest}
                  className="text-button border-2 border-gray-800 px-5 py-2 text-gray-800 transition-all duration-200 hover:bg-gray-800 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPendingRequest ? t.applePhotosPending : isSubmitting ? t.sending : t.applePhotosSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

