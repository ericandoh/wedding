'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';

export default function RSVP() {
  const { t } = useLanguage();
  const [step, setStep] = useState<'email' | 'form' | 'submitted'>('email');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    plusOneName: '',
    canAttendWesternWedding: false,
    canAttendTeaCeremony: false,
    email: '',
    phone: '',
    accommodationDetails: false,
    transportationDetails: false,
    dietaryRestrictions: '',
    accessibilityRestrictions: '',
    notificationMethod: '',
    notificationOther: '',
    instagramHandle: '',
    rowIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Load saved email from localStorage on component mount and auto-proceed
  useEffect(() => {
    const savedEmail = localStorage.getItem('rsvp-email');
    if (savedEmail) {
      setEmail(savedEmail);
      // Automatically proceed to form step with saved email
      handleAutoLookup(savedEmail);
    }
  }, []);

  const handleAutoLookup = async (emailToLookup: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToLookup.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup RSVP');
      }

      if (data.found) {
        // Load existing data
        setFormData({
          ...data.data,
          email: emailToLookup.trim(), // Use the saved email
        });
        setIsExistingUser(true);
      } else {
        // New user, start with blank form
        setFormData((prev) => ({ ...prev, email: emailToLookup.trim() }));
        setIsExistingUser(false);
      }

      setStep('form');
    } catch (err) {
      console.error('Auto lookup error:', err);
      // If auto-lookup fails, stay on email step and show error
      setError(
        err instanceof Error
          ? err.message
          : t.failedToLookupRsvp,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t.pleaseEnterEmail);
      return;
    }

    setIsLoading(true);
    setError('');

    // Save email to localStorage
    localStorage.setItem('rsvp-email', email.trim());

    try {
      const response = await fetch('/api/rsvp/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup RSVP');
      }

      if (data.found) {
        // Load existing data
        setFormData({
          ...data.data,
          email: email.trim(), // Use the email they entered
        });
        setIsExistingUser(true);
      } else {
        // New user, start with blank form
        setFormData((prev) => ({ ...prev, email: email.trim() }));
        setIsExistingUser(false);
      }

      setStep('form');
    } catch (err) {
      console.error('Email lookup error:', err);
      setError(
        err instanceof Error
          ? err.message
          : t.failedToLookupRsvp,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      setError(t.pleaseFillRequiredFields);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setStep('submitted');
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError(
        err instanceof Error
          ? err.message
          : t.failedToSubmitRsvp,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError('');
  };

  const clearSavedEmail = () => {
    localStorage.removeItem('rsvp-email');
    setEmail('');
  };

  if (step === 'submitted') {
    return (
      <div className="flex min-h-screen flex-col bg-white page-fade-in">
        <div className="bg-white py-8 text-center">
          <h1 className="text-title mb-2">
            {t.rsvpTitle}
          </h1>
          <p className="text-subtitle">
            {t.thankYouForResponse}
          </p>
        </div>

        <div className="flex-grow bg-white py-6">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-body-lg mb-8">
              {(formData.canAttendWesternWedding || formData.canAttendTeaCeremony 
                ? t.thankYouMessage 
                : t.thankYouMessageUnableToAttend
              ).replace('{name}', formData.name)}
            </p>
            <p className="text-body mb-6">
              {t.editResponseAnytime}
            </p>
            <button
              onClick={() => {
                setStep('form');
                setError('');
              }}
              className="text-button border-2 border-gray-800 px-6 py-2 font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
            >
              Back to RSVP details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="flex min-h-screen flex-col bg-white page-fade-in">
        <div className="bg-white py-8 text-center">
          <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
            {t.rsvpTitle}
          </h1>
          <p className="text-subtitle">
            {isLoading ? t.rsvpLoading : t.rsvpEmailPrompt}
          </p>
        </div>

        <div className="flex-grow bg-white py-6">
          <div className="mx-auto max-w-md px-6 text-center">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
                >
                  {t.emailAddress} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 pr-20 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.emailPlaceholder}
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={clearSavedEmail}
                      disabled={isLoading}
                      className="text-caption-sm absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.clear}
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-error rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="text-button-lg w-full border-2 border-gray-800 px-8 py-3 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.lookingUp}
                  </span>
                ) : (
                  t.rsvpButton
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.rsvpFormTitle}
        </h1>
        <p className="text-subtitle text-xl text-gray-600">
          {isExistingUser
            ? t.updateRsvpDetails
            : t.fillRsvpDetails}
        </p>
        <p className="text-card-header text-xl text-gray-600">
          {t.rsvpNote}
        </p>
        <p className="text-caption mt-2 text-sm text-gray-500">
          {t.editResponseNote}
        </p>
        <p className="text-caption-sm mt-1 text-xs text-gray-400">
          {t.usingEmail} {formData.email} •{' '}
          <button
            onClick={handleBackToEmail}
            className="underline hover:text-gray-600"
          >
            {t.useDifferentEmail}
          </button>
        </p>
      </div>

      <div className="flex-grow bg-white py-6">
        <div className="mx-auto max-w-2xl px-6 text-center">

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Your Name */}
            <div>
              <label
                htmlFor="name"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.yourName} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.yourNamePlaceholder}
              />
            </div>

            {/* +1 Name */}
            <div>
              <label
                htmlFor="plusOneName"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.plusOneName}
              </label>
              <input
                type="text"
                id="plusOneName"
                name="plusOneName"
                value={formData.plusOneName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.plusOneNamePlaceholder}
              />
            </div>

            {/* Which events can you attend? */}
            <div>
              <label className="text-label mb-3 block text-left text-sm font-medium text-gray-700">
                {t.whichEventsCanYouAttend} *
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="canAttendWesternWedding"
                    checked={formData.canAttendWesternWedding}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.westernWeddingCheckbox}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="canAttendTeaCeremony"
                    checked={formData.canAttendTeaCeremony}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.teaCeremonyCheckbox}</span>
                </label>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label
                htmlFor="email"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.email} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="text-input w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-600"
                placeholder={t.emailPlaceholder}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.phoneOptional}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.phonePlaceholder}
              />
            </div>


            {/* Accommodation Details */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accommodationDetails"
                  checked={formData.accommodationDetails}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mr-3"
                />
                <span className="text-body-sm text-sm text-gray-700">
                  {t.accommodationDetails}
                  <span className="block text-xs text-gray-500">
                    {t.accommodationDetailsNote}{' '}
                    <a 
                      href="/venue#booking-instructions" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.accommodationDetailsHere}
                    </a>
                    )
                  </span>
                </span>
              </label>
            </div>

            {/* Transportation Details */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.transportationDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transportationDetails: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-body-sm text-sm text-gray-700">
                  {t.transportationDetails}
                  <span className="block text-xs text-gray-500">
                    {t.transportationDetailsNote}
                  </span>
                </span>
              </label>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label
                htmlFor="dietaryRestrictions"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.dietaryRestrictions}
              </label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                className="text-input w-full resize-none rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.dietaryRestrictionsPlaceholder}
              />
            </div>

            {/* Accessibility Restrictions */}
            <div>
              <label
                htmlFor="accessibilityRestrictions"
                className="text-label mb-2 block text-left text-sm font-medium text-gray-700"
              >
                {t.accessibilityRestrictions}
              </label>
              <textarea
                id="accessibilityRestrictions"
                name="accessibilityRestrictions"
                value={formData.accessibilityRestrictions}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                className="text-input w-full resize-none rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t.accessibilityRestrictionsPlaceholder}
              />
            </div>

            {/* Notification Preferences */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-card-header text-gray-800 mb-4">
                {t.howWouldYouLikeToBeNotified}
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="IG"
                    checked={formData.notificationMethod === 'IG'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.instagram}</span>
                </label>
                
                {formData.notificationMethod === 'IG' && (
                  <div className="ml-6 mt-3">
                    <input
                      type="text"
                      name="instagramHandle"
                      value={formData.instagramHandle}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      placeholder={t.instagramHandlePlaceholder}
                      className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                )}
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={formData.notificationMethod === 'email'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.emailNotification}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="SMS"
                    checked={formData.notificationMethod === 'SMS'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.sms}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="Messenger"
                    checked={formData.notificationMethod === 'Messenger'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.messenger}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="Other"
                    checked={formData.notificationMethod === 'Other'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="text-body">{t.other}</span>
                </label>
                
                {formData.notificationMethod === 'Other' && (
                  <div className="ml-6 mt-3">
                    <input
                      type="text"
                      name="notificationOther"
                      value={formData.notificationOther}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      placeholder={t.pleaseSpecify}
                      className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="text-error rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name.trim() ||
                !formData.email.trim()
              }
              className="text-button-lg w-full border-2 border-gray-800 px-8 py-3 text-lg font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isExistingUser ? t.updating : t.submitting}
                </span>
              ) : isExistingUser ? (
                t.updateRsvp
              ) : (
                t.submitRsvp
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
