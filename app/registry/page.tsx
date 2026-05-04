'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../_components/language-provider';
import {
  GiftIcon,
  HeartIcon,
  SparklesIcon,
  CakeIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  DONATION_CHARITY_SHEET_VALUES,
  type DonationCharitySheetValue,
} from '#/lib/donation-charities';
import { translations } from '#/lib/translations';

interface Gift {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  icon: number; // 0-4 to select icon type
}

function charityLabel(
  t: typeof translations.en,
  value: DonationCharitySheetValue,
): string {
  switch (value) {
    case 'Center for Pacific Asian Family':
      return t.donationCharityOptionCPA;
    case 'San Jose Animal Care Center':
      return t.donationCharityOptionSJACC;
    case 'East Bay Animal Rescue':
      return t.donationCharityOptionEBARR;
    case 'Orphan Kitten Club':
      return t.donationCharityOptionOKC;
    default:
      return value;
  }
}

export default function Registry() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<
    'honeymoon' | 'catToys' | 'charity' | null
  >(null);
  const [gifts, setGifts] = useState<Gift[]>([]);

  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationCharity, setDonationCharity] = useState<
    DonationCharitySheetValue | ''
  >('');
  const [donationSubmitting, setDonationSubmitting] = useState(false);
  const [donationFeedback, setDonationFeedback] = useState<
    'success' | 'validation' | 'api' | null
  >(null);

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
    setDonationFeedback(null);
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
    if (selectedOption !== 'charity') {
      return;
    }
    setDonationFeedback(null);
    setDonationAmount('');
    setDonationCharity('');

    const email =
      typeof window !== 'undefined'
        ? localStorage.getItem('rsvp-email')
        : null;
    if (!email?.trim()) {
      setDonorName('');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/rsvp/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.found && json.data?.name) {
          setDonorName(String(json.data.name).trim());
        } else {
          setDonorName('');
        }
      } catch {
        if (!cancelled) setDonorName('');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedOption]);

  const submitDonation = async () => {
    setDonationFeedback(null);
    if (!donorName.trim() || !donationAmount.trim() || !donationCharity) {
      setDonationFeedback('validation');
      return;
    }
    setDonationSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: donorName.trim(),
          amount: donationAmount.trim(),
          charity: donationCharity,
        }),
      });
      if (!res.ok) {
        setDonationFeedback('api');
        return;
      }
      setDonationFeedback('success');
      setDonationAmount('');
      setDonationCharity('');
    } catch {
      setDonationFeedback('api');
    } finally {
      setDonationSubmitting(false);
    }
  };

  useEffect(() => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
    ];
    const giftCount = 25;
    const newGifts: Gift[] = [];

    for (let i = 0; i < giftCount; i++) {
      const randomValue = Math.random();
      let iconType;
      if (randomValue < 0.8) {
        iconType = 0;
      } else {
        iconType = 1 + Math.floor(Math.random() * 4);
      }

      newGifts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 24 + Math.random() * 24,
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
      strokeWidth: 1.5,
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

  const dialogWide = selectedOption === 'charity';

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in relative">
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

      {selectedOption && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={closeDialog}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full p-6 max-h-[90vh] overflow-y-auto ${
              dialogWide ? 'max-w-xl' : 'max-w-md'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-card-header text-2xl text-gray-800 pr-2">
                {selectedOption === 'charity'
                  ? t.registryCharityModalTitle
                  : t.venmoInstructions}
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 shrink-0"
                type="button"
                aria-label={t.close}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-left">
              {selectedOption === 'charity' ? (
                <>
                  <div className="space-y-3 text-body text-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t.registryCharityCPAFHeading}
                      </h3>
                      <p className="mb-2">{t.registryCharityCPAFDescription}</p>
                      <a
                        href="https://cpaf.ngo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        https://cpaf.ngo
                      </a>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t.registryCharityAnimalSheltersHeading}
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <a
                            href="http://bit.ly/sjacs-kitten"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {t.registryCharitySJKittenLinkLabel}
                          </a>
                        </li>
                        <li>
                          <a
                            href="http://bit.ly/ACS-Wishlist"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {t.registryCharitySJWishlistLinkLabel}
                          </a>
                        </li>
                        <li>
                          <span className="font-medium text-gray-800">
                            {t.donationCharityOptionEBARR}:
                          </span>{' '}
                          <a
                            href="https://ebarr.crd.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            https://ebarr.crd.co
                          </a>
                        </li>
                        <li>
                          <span className="font-medium text-gray-800">
                            {t.donationCharityOptionOKC}:
                          </span>{' '}
                          <a
                            href="https://orphankittenclub.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            https://orphankittenclub.org
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-body text-gray-700 border-t border-gray-200 pt-4">
                    {t.registryCharityDonationOptionalBlurb}
                  </p>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div>
                      <label
                        htmlFor="donation-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t.donationNameLabel}
                      </label>
                      <input
                        id="donation-name"
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="donation-amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t.donationAmountLabel}
                      </label>
                      <input
                        id="donation-amount"
                        type="text"
                        inputMode="decimal"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="50"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="donation-charity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t.donationCharityLabel}
                      </label>
                      <select
                        id="donation-charity"
                        value={donationCharity}
                        onChange={(e) =>
                          setDonationCharity(
                            e.target.value as DonationCharitySheetValue | '',
                          )
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 bg-white"
                      >
                        <option value="">
                          {t.donationCharitySelectPlaceholder}
                        </option>
                        {DONATION_CHARITY_SHEET_VALUES.map((v) => (
                          <option key={v} value={v}>
                            {charityLabel(t, v)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={submitDonation}
                      disabled={donationSubmitting}
                      className="w-full text-button border-2 border-gray-800 px-6 py-2 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {donationSubmitting
                        ? t.donationSubmitting
                        : t.donationIDonatedButton}
                    </button>
                    {donationFeedback === 'success' && (
                      <p className="text-sm text-green-700">
                        {t.donationThankYouRecorded}
                      </p>
                    )}
                    {donationFeedback === 'validation' && (
                      <p className="text-sm text-red-700">
                        {t.donationMissingFields}
                      </p>
                    )}
                    {donationFeedback === 'api' && (
                      <p className="text-sm text-red-700">
                        {t.donationErrorGeneric}
                      </p>
                    )}
                  </div>
                </>
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
                type="button"
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
