import Link from 'next/link';

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-serif font-bold text-white mb-4">Welcome to Our Wedding</h1>
        <p className="text-gray-300 text-xl font-script">
          We're so excited to celebrate with you! Use the menu above to explore all the details.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Link 
          href="/rsvp"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            RSVP
          </h2>
          <p className="text-gray-400 font-script">
            Let us know if you'll be joining us
          </p>
        </Link>
        
        <Link 
          href="/schedule"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Schedule
          </h2>
          <p className="text-gray-400 font-script">
            Wedding day timeline and events
          </p>
        </Link>
        
        <Link 
          href="/our-story"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Our Story
          </h2>
          <p className="text-gray-400 font-script">
            How we met and fell in love
          </p>
        </Link>
        
        <Link 
          href="/venue"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Venue
          </h2>
          <p className="text-gray-400 font-script">
            Location details and directions
          </p>
        </Link>
        
        <Link 
          href="/things-to-do"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Things to do
          </h2>
          <p className="text-gray-400 font-script">
            Local activities and recommendations
          </p>
        </Link>
        
        <Link 
          href="/registry"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Registry
          </h2>
          <p className="text-gray-400 font-script">
            Gift registry information
          </p>
        </Link>
        
        <Link 
          href="/qa"
          className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-blue-400">
            Q&A
          </h2>
          <p className="text-gray-400 font-script">
            Frequently asked questions
          </p>
        </Link>
      </div>
    </div>
  );
}
