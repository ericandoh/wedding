'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function Travel() {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const [teaCeremonyRoute, setTeaCeremonyRoute] = useState<'SGN' | 'VCA'>('SGN');
  const [showGettingThere, setShowGettingThere] = useState(false);
  const [showWesternWedding, setShowWesternWedding] = useState(false);
  const [showTeaCeremony, setShowTeaCeremony] = useState(false);
  const [showTeaCeremonyToWestern, setShowTeaCeremonyToWestern] = useState(false);
  const [showWesternVenue, setShowWesternVenue] = useState(false);
  const [showTeaVenue, setShowTeaVenue] = useState(false);
  const [showTransportation, setShowTransportation] = useState(false);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const section = target.dataset.section;
          
          switch (section) {
            case 'getting-there':
              setShowGettingThere(true);
              break;
            case 'western-wedding':
              setShowWesternWedding(true);
              break;
            case 'tea-ceremony':
              setShowTeaCeremony(true);
              break;
            case 'tea-ceremony-to-western':
              setShowTeaCeremonyToWestern(true);
              break;
            case 'western-venue':
              setShowWesternVenue(true);
              break;
            case 'tea-venue':
              setShowTeaVenue(true);
              break;
            case 'transportation':
              setShowTransportation(true);
              break;
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    const gettingThereSection = document.querySelector('[data-section="getting-there"]');
    const westernWeddingSection = document.querySelector('[data-section="western-wedding"]');
    const teaCeremonySection = document.querySelector('[data-section="tea-ceremony"]');
    const teaCeremonyToWesternSection = document.querySelector('[data-section="tea-ceremony-to-western"]');
    const westernVenueSection = document.querySelector('[data-section="western-venue"]');
    const teaVenueSection = document.querySelector('[data-section="tea-venue"]');
    const transportationSection = document.querySelector('[data-section="transportation"]');

    if (gettingThereSection) observer.observe(gettingThereSection);
    if (westernWeddingSection) observer.observe(westernWeddingSection);
    if (teaCeremonySection) observer.observe(teaCeremonySection);
    if (teaCeremonyToWesternSection) observer.observe(teaCeremonyToWesternSection);
    if (westernVenueSection) observer.observe(westernVenueSection);
    if (teaVenueSection) observer.observe(teaVenueSection);
    if (transportationSection) observer.observe(transportationSection);

    return () => {
      if (gettingThereSection) observer.unobserve(gettingThereSection);
      if (westernWeddingSection) observer.unobserve(westernWeddingSection);
      if (teaCeremonySection) observer.unobserve(teaCeremonySection);
      if (teaCeremonyToWesternSection) observer.unobserve(teaCeremonyToWesternSection);
      if (westernVenueSection) observer.unobserve(westernVenueSection);
      if (teaVenueSection) observer.unobserve(teaVenueSection);
      if (transportationSection) observer.unobserve(transportationSection);
    };
  }, []);

  const copyPromoCode = () => {
    navigator.clipboard.writeText('EHWEDDING2026');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const copyWesternVenueAddress = () => {
    navigator.clipboard.writeText(t.venueAddress);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const copyTeaCeremonyAddress = () => {
    navigator.clipboard.writeText('220 Đường Lê Lợi, khóm 1, Sa Đéc, Đồng Tháp, Vietnam');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Extract promo code line and rest of note
  const promoCodeLine = t.bookingNote.split('\n')[0]; // First line contains promo code
  const restOfNote = t.bookingNote.split('\n').slice(2).join('\n'); // Skip first line and empty line

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Getting There Section */}
          <div className="mb-16" data-section="getting-there">
            <h1 className={`text-title text-5xl font-bold text-gray-800 mb-8 text-center transition-opacity duration-1000 ${showGettingThere ? 'opacity-100' : 'opacity-0'}`}>
              {t.gettingThere}
            </h1>
            
            {/* To Western Wedding */}
            <div className="mb-16" data-section="western-wedding">
              <h2 className="text-title text-3xl font-bold text-gray-800 mb-6 text-center">
                {t.toWesternWedding}
              </h2>
              
              {/* Map and Information Section - side by side on larger screens */}
              <div className={`flex flex-col lg:flex-row gap-8 items-start transition-opacity duration-1000 ${showWesternWedding ? 'opacity-100' : 'opacity-0'}`}>
                {/* Directions Map */}
                <div className="w-full lg:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d61359.8579154526!2d108.20153852364206!3d16.013977772160775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x314219bab9b63451%3A0xd7a9441e697a048c!2sDa%20Nang%20International%20Airport%2C%20H%E1%BA%A3i%20Ch%C3%A2u%20District%2C%20Da%20Nang%2C%20Vietnam!3m2!1d16.0569804!2d108.2025372!4m5!1s0x314211005cd2e2cf%3A0xf6b3cf9995e6db85!2zRnVzaW9uIFJlc29ydCAmIFZpbGxhcyBEYSBOYW5nIOKAkyBXZWxsbmVzcyBJbmNsdXNpdmUsIFRyxrDhu51uZyBTYSwgSG9hIEhhaSwgTmfFqSBIw6BuaCBTxqFuLCBEYSBOYW5nLCBWaWV0bmFt!3m2!1d15.9724892!2d108.28239339999999!5e0!3m2!1sen!2sus!4v1763941170032!5m2!1sen!2sus"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Fusion Resort & Villas Da Nang - Click for directions from Da Nang Airport"
                    ></iframe>
                  </div>
                </div>

                {/* Information Table */}
                <div className="w-full lg:w-1/2">
                  <div className="space-y-6">
                    {/* Location */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        <strong>{t.location}</strong>
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.centralVietnam}
                      </p>
                    </div>

                    {/* Airport */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.airport}
                      </h3>
                      <p className="text-body text-lg text-gray-600" dangerouslySetInnerHTML={{
                        __html: t.daNangAirportInfo.replace('(DAD)', '(<strong>DAD</strong>)')
                      }} />
                    </div>

                    {/* Recommended Fly in Date */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.recommendedFlyInDate}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.westernWeddingFlyInDate}
                      </p>
                    </div>

                    {/* Shuttles */}
                    <div className="pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.shuttles}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.westernWeddingShuttles}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* To Tea Ceremony */}
            <div data-section="tea-ceremony">
              <h2 className={`text-title text-3xl font-bold text-gray-800 mb-6 text-center transition-opacity duration-1000 ${showTeaCeremony ? 'opacity-100' : 'opacity-0'}`}>
                {t.toTeaCeremony}
              </h2>
              
              {/* Map and Information Section - side by side on larger screens */}
              <div className={`flex flex-col lg:flex-row gap-8 items-start transition-opacity duration-1000 ${showTeaCeremony ? 'opacity-100' : 'opacity-0'}`}>
                {/* Information Table */}
                <div className="w-full lg:w-1/2">
                  <div className="space-y-6">
                    {/* Location */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        <strong>{t.location}</strong>
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.southVietnam}
                      </p>
                    </div>

                    {/* Airport */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.airport}
                      </h3>
                      <div className="text-body text-lg text-gray-600 space-y-2">
                        <div>
                          <span dangerouslySetInnerHTML={{
                            __html: t.sgnAirportInfo.replace('(SGN)', '(<strong>SGN</strong>)')
                          }} />
                          <button
                            onClick={() => setTeaCeremonyRoute('SGN')}
                            className="ml-2 text-sm text-blue-600 hover:text-blue-800 hover:underline lowercase"
                          >
                            {t.seeRoute}
                          </button>
                        </div>
                        <div>
                          <span dangerouslySetInnerHTML={{
                            __html: t.vcaAirportInfo.replace('(VCA)', '(<strong>VCA</strong>)')
                          }} />
                          <button
                            onClick={() => setTeaCeremonyRoute('VCA')}
                            className="ml-2 text-sm text-blue-600 hover:text-blue-800 hover:underline lowercase"
                          >
                            {t.seeRoute}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Airport Recommendation */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.airportRecommendation}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.sgnRecommendation}
                      </p>
                    </div>

                    {/* Recommended Fly in Date */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.recommendedFlyInDate}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.teaCeremonyFlyInDate}
                      </p>
                    </div>

                    {/* Shuttles */}
                    <div className="pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.shuttles}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.teaCeremonyShuttlesFull}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Directions Map */}
                <div className="w-full lg:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={
                        teaCeremonyRoute === 'SGN'
                          ? "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d502079.9934172452!2d105.87909251037466!3d10.539995053347415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x317529111aa89f9d%3A0xd8f09cc0aa1b27f3!2zU0dOLCDEkMaw4budbmcgVHLGsOG7nW5nIFPGoW4sIFPGoW4gSG_DoCwgSG8gQ2hpIE1pbmggQ2l0eSwgVmlldG5hbQ!3m2!1d10.8169828!2d106.6565808!4m5!1s0x310a7f3928be4fd7%3A0xccb5d26b47e2cf41!2zSOG7pyBUaeG6v3UgSGFpIE5nb24sIDIyMCDEkMaw4budbmcgTMOqIEzhu6NpLCBraMOzbSAxLCBTYSDEkMOpYywgxJDhu5NuZyBUaMOhcCwgVmlldG5hbQ!3m2!1d10.3044919!2d105.7609526!5e0!3m2!1sen!2sus!4v1763941067547!5m2!1sen!2sus"
                          : "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d251345.84900846492!2d105.6321950162997!3d10.157970650509924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x31a08651b5b123f7%3A0x9efcaae7eb84b92b!2zQ2FuIFRobyBJbnRlcm5hdGlvbmFsIEFpcnBvcnQsIFRlcm1pbmFsIG9mIENhbiBUaG8gSW50ZXJuYXRpb25hbCBBaXJwb3J0LCBMw6ogSOG7k25nIFBob25nLCBUcsOgIEFuLCBCw6xuaCBUaOG7p3ksIEPhuqduIFRoxqEsIFZpZXRuYW0!3m2!1d10.0804831!2d105.71217759999999!4m5!1s0x310a7f3928be4fd7%3A0xccb5d26b47e2cf41!2zSOG7pyBUaeG6v3UgSGFpIE5nb24sIDIyMCDEkMaw4budbmcgTMOqIEzhu6NpLCBraMOzbSAxLCBTYSDEkMOpYywgxJDhu5NuZyBUaMOhcCwgVmlldG5hbQ!3m2!1d10.3044919!2d105.7609526!5e0!3m2!1sen!2sus!4v1763941407572!5m2!1sen!2sus"
                      }
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={teaCeremonyRoute === 'SGN' ? "Directions from Tan Son Nhat Airport to Sa Dec" : "Directions from Can Tho Airport to Sa Dec"}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Tea Ceremony to Western Wedding */}
            <div className="mt-16" data-section="tea-ceremony-to-western">
              <h2 className={`text-title text-3xl font-bold text-gray-800 mb-6 text-center transition-opacity duration-1000 ${showTeaCeremonyToWestern ? 'opacity-100' : 'opacity-0'}`}>
                {t.teaCeremonyToWesternWedding}
              </h2>
              
              <div className={`transition-opacity duration-1000 ${showTeaCeremonyToWestern ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full max-w-4xl mx-auto">
                  <div className="space-y-6">
                    {/* SGN → DAD */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.sgnToDad}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.sgnToDadDescription}
                      </p>
                    </div>

                    {/* VCA → DAD */}
                    <div className="pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.vcaToDad}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.vcaToDadDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Section */}
          <div data-section="western-venue">
            <div className={`bg-white py-8 text-center mb-8 transition-opacity duration-1000 ${showWesternVenue ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                Fusion Resort & Villas Da Nang
              </h2>
              <p className="text-body text-xl text-gray-600">
                {t.informationAboutWesternVenue}
              </p>
            </div>

            {/* Full-width image */}
            <div className={`relative h-96 w-full md:h-[500px] lg:h-[600px] mb-12 transition-opacity duration-1000 ${showWesternVenue ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src="/fusion_resorts_1.jpg"
                alt={t.fusionResortsDaNangVenue}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Map and Information Section - side by side on larger screens */}
            <div className={`flex flex-col lg:flex-row gap-8 items-start transition-opacity duration-1000 ${showWesternVenue ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Google Maps Embed */}
              <div className="w-full lg:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.7871292971563!2d108.27981847591573!3d15.972489184693103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314211005cd2e2cf%3A0xf6b3cf9995e6db85!2sFusion%20Resort%20%26%20Villas%20Da%20Nang%20%E2%80%93%20Wellness%20Inclusive!5e0!3m2!1sen!2sus!4v1761203425097!5m2!1sen!2sus"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Fusion Resort & Villas Da Nang Location"
                  ></iframe>
                </div>
              </div>

              {/* Venue Information Table */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  {/* Address */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      {t.address}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-body text-lg text-gray-600">
                        {t.venueAddress}
                      </p>
                      <button
                        onClick={copyWesternVenueAddress}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy address"
                      >
                        <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      {t.website}
                    </h3>
                    <a 
                      href={t.venueWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {t.venueWebsite}
                    </a>
                  </div>

                  {/* Booking Link */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      {t.bookingLink}
                    </h3>
                    <a 
                      href={t.comingSoon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {t.comingSoon}
                    </a>
                  </div>

                  {/* Booking Instructions */}
                  <div id="booking-instructions" className="pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      {t.bookingInstructions}
                    </h3>
                    <div className="text-body text-lg text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{promoCodeLine}</span>
                        <button
                          onClick={copyPromoCode}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy promo code"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <p className="whitespace-pre-line">
                        {restOfNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tea Ceremony Venue Section */}
            <div className="mt-16" data-section="tea-venue">
              <div className={`bg-white py-8 text-center mb-8 transition-opacity duration-1000 ${showTeaVenue ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                  {t.teaCeremonyHangsHome}
                </h2>
              </div>

              {/* Map and Information Section - side by side on larger screens */}
              <div className={`flex flex-col lg:flex-row gap-8 items-start transition-opacity duration-1000 ${showTeaVenue ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Venue Information Table */}
                <div className="w-full lg:w-1/2">
                  <div className="space-y-6">
                    {/* Address */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.address}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.teaCeremonyAddressNote}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-body text-lg text-gray-600">
                          220 Đường Lê Lợi, khóm 1, Sa Đéc, Đồng Tháp, Vietnam
                        </p>
                        <button
                          onClick={copyTeaCeremonyAddress}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy address"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* About the Venue */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.aboutTheVenue}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.teaCeremonyAboutVenue}
                      </p>
                    </div>

                    {/* Accommodation Options */}
                    <div className="pb-4">
                      <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                        {t.accommodationOptions}
                      </h3>
                      <p className="text-body text-lg text-gray-600">
                        {t.accommodationOptionsNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="w-full lg:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928934.567890123!2d105.8!3d10.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a7f3928be4fd7%3A0xccb5d26b47e2cf41!2zSOG7pyBUaeG6v3UgSGFpIE5nb24sIDIyMCDEkMaw4budbmcgTMOqIEzhu6NpLCBraMOzbSAxLCBTYSDEkMOpYywgxJDhu5NuZyBUaMOhcCwgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1763941067547!5m2!1sen!2sus"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hang's Familial Home, Sa Dec"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transportation Options Section */}
          <div className="mt-16 mb-16" data-section="transportation">
            <div className={`bg-white py-8 text-center mb-8 transition-opacity duration-1000 ${showTransportation ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-title mb-2 text-4xl font-bold text-gray-800">
                {t.transportationOptions}
              </h2>
            </div>

            <div className={`flex flex-col lg:flex-row gap-8 items-start transition-opacity duration-1000 ${showTransportation ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Grab Information */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      Grab (Ride-Sharing App)
                    </h3>
                    <p className="text-body text-lg text-gray-600">
                      {t.grabDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Private Car Information */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  <div className="pb-4">
                    <h3 className="text-body text-lg font-semibold text-gray-700 mb-2">
                      Private Car Arrangements
                    </h3>
                    <p className="text-body text-lg text-gray-600">
                      {t.privateCarDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {t.copied}
        </div>
      )}
    </div>
  );
}

