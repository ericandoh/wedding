import Link from 'next/link';
import LogoutButton from './_components/logout-button';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Title and RSVP button above the image */}
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          Hang & Eric
        </h1>
        <p className="font-satisfy text-xl text-gray-600 mb-8">
          May 23rd, 2026 | Fusion Resorts Da Nang
        </p>
        
        {/* RSVP button */}
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/rsvp"
            className="font-satisfy inline-block border-2 border-gray-800 px-8 py-3 text-lg font-medium text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
          >
            RSVP
          </Link>
        </div>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <img
          src="/home.JPG"
          alt="Hang & Eric Wedding"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Logout button at bottom */}
      <div className="flex justify-center bg-white py-12 pb-8">
        <LogoutButton />
      </div>
    </div>
  );
}
