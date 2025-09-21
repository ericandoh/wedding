export default function QA() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Q&A
        </h1>
        <p className="text-body text-xl text-gray-600">
          Frequently asked questions about our wedding
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-8">
            {/* Wedding Details */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                Wedding Details
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    When and where is the wedding?
                  </h3>
                  <p className="text-body text-gray-700">
                    Our wedding will be held on May 23rd, 2026 at Fusion Resorts Da Nang, Vietnam. 
                    The ceremony will begin at TODO PM, followed by cocktail hour and reception.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    What should I wear?
                  </h3>
                  <p className="text-body text-gray-700">
                    We'd love to see you dressed up! The dress code is TODO attire. 
                    For women: TODO dresses. For men: TODO suits.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    What's the weather like in Da Nang in May?
                  </h3>
                  <p className="text-body text-gray-700">
                    May is typically warm and sunny in Da Nang with temperatures around 25-30°C (77-86°F). 
                    It's the beginning of the dry season, so rain is less likely. 
                    We recommend bringing light, breathable clothing and sunscreen.
                  </p>
                </div>
              </div>
            </div>

            {/* Travel & Accommodation */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                Travel & Accommodation
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Do I need a visa to visit Vietnam?
                  </h3>
                  <p className="text-body text-gray-700">
                    Most visitors need a visa to enter Vietnam. You can apply for an e-visa online 
                    and apply well in advance of your travel dates. <a href="https://evisa.gov.vn/" target="_blank" rel="noopener noreferrer">https://evisa.gov.vn/</a>. Please check the latest requirements for your country 
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Where should I stay?
                  </h3>
                  <p className="text-body text-gray-700">
                    We recommend staying at Fusion Resorts Da Nang or nearby hotels in the Da Nang area. 
                    The resort offers special rates for wedding guests - please contact us for details. 
                    There are also many beautiful beachfront hotels in the area.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    How do I get from the airport to the venue?
                  </h3>
                  <p className="text-body text-gray-700">
                    Da Nang International Airport is about 20-30 minutes from Fusion Resorts. 
                    You can take a taxi, Grab (ride-sharing app), or arrange airport transfer through the resort. 
                    We can help coordinate group transportation if needed - see RSVP for details.
                  </p>
                </div>
              </div>
            </div>

            {/* RSVP & Gifts */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                RSVP & Gifts
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    When should I RSVP by?
                  </h3>
                  <p className="text-body text-gray-700">
                    Please RSVP by TODO. This gives us enough time to finalize our guest count 
                    and make arrangements with the venue. You can RSVP through our website or by contacting us directly.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Do you have a wedding registry?
                  </h3>
                  <p className="text-body text-gray-700">
                    TODO
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Can I bring a plus one?
                  </h3>
                  <p className="text-body text-gray-700">
                    TODO but yes.
                  </p>
                </div>
              </div>
            </div>

            {/* Ceremony & Reception */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                Ceremony & Reception
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Will the ceremony be indoors or outdoors?
                  </h3>
                  <p className="text-body text-gray-700">
                    Our ceremony will be held outdoors on the beach at Fusion Resorts, weather permitting. 
                    In case of rain, we have a beautiful indoor backup location at the resort.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    What time should I arrive?
                  </h3>
                  <p className="text-body text-gray-700">
                    Please arrive by TODO PM to ensure you're seated before the ceremony begins at TODO PM. 
                    There will be a welcome reception area where you can enjoy refreshments before the ceremony.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-body text-xl font-semibold text-gray-800 mb-2">
                    Will there be food and drinks?
                  </h3>
                  <p className="text-body text-gray-700">
                    Absolutely! We'll have a cocktail hour with appetizers and drinks after the ceremony, 
                    followed by a full dinner reception. We'll accommodate dietary restrictions - 
                    please let us know when you RSVP.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h2 className="text-title text-3xl font-bold text-gray-800 text-center">
                Still Have Questions?
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-body text-lg text-gray-700 mb-4">
                  If you have any other questions or concerns, please don't hesitate to reach out to us!
                </p>
                <p className="text-body text-base text-gray-600">
                  You can contact us at: <strong>ohhangno@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
