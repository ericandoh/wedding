'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../_components/language-provider';
import ChatbotBubble from '../_components/chatbot-bubble';

// Helper to render bullets and basic formatting in FAQ answers
const renderFormattedAnswer = (text: string) => {
  const lines = text.split('\n');
  const hasListItems = lines.some(line => line.trim().startsWith('* '));

  if (!hasListItems) {
    return text;
  }

  const processedLines = lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ')) {
      return (
        <li key={`li-${index}`} className="ml-4 list-disc">
          {trimmed.slice(2)}
        </li>
      );
    }
    if (trimmed === '') {
      return <br key={`br-${index}`} />;
    }
    return (
      <p key={`p-${index}`} className="mb-1">
        {line}
      </p>
    );
  });

  const result: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];

  processedLines.forEach((el, idx) => {
    if (el.type === 'li') {
      currentList.push(el);
    } else {
      if (currentList.length > 0) {
        result.push(
          <ul key={`ul-${idx}`} className="list-disc list-inside mb-2">
            {currentList}
          </ul>
        );
        currentList = [];
      }
      result.push(el);
    }
  });

  if (currentList.length > 0) {
    result.push(
      <ul key="ul-final" className="list-disc list-inside mb-2">
        {currentList}
      </ul>
    );
  }

  return result;
};

export default function QA() {
  const { t } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.qaTitle}
        </h1>
        <p className="text-body text-xl text-gray-600">
          {t.frequentlyAskedQuestions}
        </p>
        <div className="mt-6">
          <button 
            onClick={() => setIsChatbotOpen(true)}
            className="text-button-lg inline-block border-2 border-gray-800 px-8 py-3 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
          >
            {t.askChatbotButton}
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-8">
            {/* Wedding Details */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                {t.weddingDetails}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.whenAndWhereWedding}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.weddingDetailsAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.whatShouldIWear}
                  </h3>
                  <div className="text-body text-gray-700 space-y-1">
                    {renderFormattedAnswer(t.dressCodeAnswer)}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.weatherInDaNang}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.weatherAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* Travel & Accommodation */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                {t.travelAndAccommodation}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.doINeedVisa}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.visaAnswer.includes('See our step-by-step guide here') || t.visaAnswer.includes('Xem hướng dẫn từng bước của chúng tôi tại đây') ? (
                      <>
                        {t.visaAnswer.includes('See our step-by-step guide here') 
                          ? t.visaAnswer.split('See our step-by-step guide here')[0]
                          : t.visaAnswer.split('Xem hướng dẫn từng bước của chúng tôi tại đây')[0]}
                        <Link href="/evisa" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold">
                          {' '}
                          {t.visaAnswer.includes('See our step-by-step guide here') 
                            ? 'See our step-by-step guide here'
                            : 'Xem hướng dẫn từng bước của chúng tôi tại đây'}
                          {' '}
                        </Link>
                        {t.visaAnswer.includes('See our step-by-step guide here')
                          ? t.visaAnswer.split('See our step-by-step guide here')[1]
                          : t.visaAnswer.split('Xem hướng dẫn từng bước của chúng tôi tại đây')[1]}
                      </>
                    ) : (
                      t.visaAnswer
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.whereShouldIStay}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.accommodationAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.howToGetFromAirport}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.airportTransportAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* RSVP & Gifts */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                {t.rsvpAndGifts}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.rsvpDeadline}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.rsvpDeadlineAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.giftRegistry}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.giftRegistryAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.canIBringPlusOne}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.plusOneAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* Ceremony & Reception */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                {t.ceremonyAndReception}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.ceremonyIndoorsOrOutdoors}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.ceremonyLocationAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.whatTimeShouldIArrive}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.arrivalTimeAnswer}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    {t.willThereBeFoodAndDrinks}
                  </h3>
                  <p className="text-body text-gray-700">
                    {t.foodAndDrinksAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                {t.stillHaveQuestions}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-body text-lg text-gray-700 mb-4">
                  {t.contactUsMessage}
                </p>
                <p className="text-body text-base text-gray-600">
                  {t.contactEmail} <strong>ohhangno@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot Bubble */}
      <ChatbotBubble 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
}
