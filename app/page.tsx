import Link from 'next/link';
import LogoutButton from './_components/logout-button';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Title above the image */}
      <div className="text-center py-8 bg-white">
        <h1 className="text-5xl font-great-vibes font-bold text-gray-800 mb-2">Hang & Eric</h1>
        <p className="text-gray-600 text-xl font-satisfy">
          May 23rd, 2026 | Fusion Resorts Da Nang
        </p>
      </div>
      
      {/* Full-width image */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative">
        <img 
          src="/home.JPG" 
          alt="Hang & Eric Wedding" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* RSVP button */}
      <div className="flex-grow bg-white py-12">
        <div className="text-center max-w-4xl mx-auto px-6">
          <Link 
            href="/rsvp"
            className="inline-block border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-medium py-3 px-8 transition-all duration-300 font-satisfy text-lg"
          >
            RSVP
          </Link>
        </div>
      </div>
      
      {/* Logout button at bottom */}
      <div className="flex justify-center pb-8 bg-white">
        <LogoutButton />
      </div>
    </div>
  );
}
