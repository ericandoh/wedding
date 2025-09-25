'use client';

import { useState } from 'react';
import { useLanguage } from '../_components/language-provider';
import ChatbotBubble from '../_components/chatbot-bubble';

export default function QA() {
  const { t } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col">
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
                  <p className="text-body text-gray-700">
                    {t.dressCodeAnswer}
                  </p>
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
                    {t.visaAnswer}
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
