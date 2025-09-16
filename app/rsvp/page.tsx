'use client';

import { useState } from 'react';

export default function RSVP() {
  const [step, setStep] = useState<'email' | 'form' | 'submitted'>('email');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    plusOneName: '',
    canAttend: '',
    email: '',
    phone: '',
    eventType: '',
    accommodationDetails: false,
    dietaryRestrictions: '',
    accessibilityRestrictions: '',
    rowIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

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
          : 'Failed to lookup RSVP. Please try again.',
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
      !formData.canAttend ||
      !formData.email.trim()
    ) {
      setError(
        'Please fill in all required fields (Name, Can you attend?, and Email)',
      );
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
          : 'Failed to submit RSVP. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError('');
  };

  if (step === 'submitted') {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="bg-white py-8 text-center">
          <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
            RSVP
          </h1>
          <p className="font-satisfy text-xl text-gray-600">
            Thank you for your response!
          </p>
        </div>

        <div className="flex-grow bg-white py-6">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="font-satisfy mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              Thank you, {formData.name}! We've received your RSVP and can't
              wait to celebrate with you!
            </p>
            <p className="font-satisfy mb-6 text-base text-gray-600">
              You can come back here anytime to edit your response!
            </p>
            <button
              onClick={() => {
                setStep('email');
                setEmail('');
                setFormData({
                  name: '',
                  plusOneName: '',
                  canAttend: '',
                  email: '',
                  phone: '',
                  eventType: '',
                  accommodationDetails: false,
                  dietaryRestrictions: '',
                  accessibilityRestrictions: '',
                  rowIndex: 0,
                });
                setIsExistingUser(false);
                setError('');
              }}
              className="font-satisfy border-2 border-gray-800 px-6 py-2 font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
            >
              Submit Another RSVP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="bg-white py-8 text-center">
          <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
            RSVP
          </h1>
          <p className="font-satisfy text-xl text-gray-600">
            Please enter your email to get started
          </p>
        </div>

        <div className="flex-grow bg-white py-6">
          <div className="mx-auto max-w-md px-6 text-center">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="font-satisfy w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email address"
                />
              </div>

              {error && (
                <div className="font-satisfy rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="font-satisfy w-full border-2 border-gray-800 px-8 py-3 text-lg font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                    Looking up...
                  </span>
                ) : (
                  'RSVP'
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
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          RSVP
        </h1>
        <p className="font-satisfy text-xl text-gray-600">
          {isExistingUser
            ? 'Update your RSVP details'
            : 'Please fill out your RSVP details'}
        </p>
        <p className="font-satisfy mt-2 text-sm text-gray-500">
          You can come back here anytime to edit your response!
        </p>
      </div>

      <div className="flex-grow bg-white py-6">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-6">
            <button
              onClick={handleBackToEmail}
              className="font-satisfy text-sm text-gray-600 underline hover:text-gray-800"
            >
              ← Back to email entry
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Your Name */}
            <div>
              <label
                htmlFor="name"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="font-satisfy w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>

            {/* +1 Name */}
            <div>
              <label
                htmlFor="plusOneName"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                +1 Name
              </label>
              <input
                type="text"
                id="plusOneName"
                name="plusOneName"
                value={formData.plusOneName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="font-satisfy w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your +1's name (if applicable)"
              />
            </div>

            {/* Can you attend? */}
            <div>
              <label className="font-satisfy mb-3 block text-left text-sm font-medium text-gray-700">
                Can you attend? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="canAttend"
                    value="Yes"
                    checked={formData.canAttend === 'Yes'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="font-satisfy">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="canAttend"
                    value="No"
                    checked={formData.canAttend === 'No'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-3"
                  />
                  <span className="font-satisfy">No</span>
                </label>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label
                htmlFor="email"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="font-satisfy w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Phone # (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="font-satisfy w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Event Type Dropdown */}
            <div>
              <label
                htmlFor="eventType"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Which event can you join?
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="font-satisfy w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an event</option>
                <option value="Western Wedding, May 23, Da Nang">
                  Western Wedding, May 23, Da Nang
                </option>
                <option value="Tea Ceremony, May 21, Sa Dec">
                  Tea Ceremony, May 21, Sa Dec
                </option>
                <option value="Both events">Both events</option>
              </select>
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
                <span className="font-satisfy text-sm text-gray-700">
                  I'd like details about accommodation at the venue directly
                  <span className="block text-xs text-gray-500">
                    (This is being finalized)
                  </span>
                </span>
              </label>
            </div>

            {/* Transportation Note */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="font-satisfy text-sm text-blue-800">
                Transportation details coming soon!
              </p>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label
                htmlFor="dietaryRestrictions"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Dietary Restrictions
              </label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                className="font-satisfy w-full resize-none rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Please let us know about any dietary restrictions or allergies"
              />
            </div>

            {/* Accessibility Restrictions */}
            <div>
              <label
                htmlFor="accessibilityRestrictions"
                className="font-satisfy mb-2 block text-left text-sm font-medium text-gray-700"
              >
                Accessibility Restrictions
              </label>
              <textarea
                id="accessibilityRestrictions"
                name="accessibilityRestrictions"
                value={formData.accessibilityRestrictions}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                className="font-satisfy w-full resize-none rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Please let us know about any accessibility needs"
              />
            </div>

            {error && (
              <div className="font-satisfy rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name.trim() ||
                !formData.canAttend ||
                !formData.email.trim()
              }
              className="font-satisfy w-full border-2 border-gray-800 px-8 py-3 text-lg font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                  {isExistingUser ? 'Updating...' : 'Submitting...'}
                </span>
              ) : isExistingUser ? (
                'Update RSVP'
              ) : (
                'Submit RSVP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
