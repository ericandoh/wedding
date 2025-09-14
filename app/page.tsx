import Link from 'next/link';

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-serif font-bold text-purple-800 mb-4">Welcome to Our Wedding</h1>
        <p className="text-purple-600 text-xl font-script">
          We're so excited to celebrate with you! Use the menu above to explore all the details.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Link 
          href="/rsvp"
          className="group p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg hover:from-pink-200 hover:to-purple-200 transition-all duration-300 shadow-sm border border-pink-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            RSVP
          </h2>
          <p className="text-purple-600 font-script">
            Let us know if you'll be joining us
          </p>
        </Link>
        
        <Link 
          href="/schedule"
          className="group p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-300 shadow-sm border border-purple-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Schedule
          </h2>
          <p className="text-purple-600 font-script">
            Wedding day timeline and events
          </p>
        </Link>
        
        <Link 
          href="/our-story"
          className="group p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-all duration-300 shadow-sm border border-blue-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Our Story
          </h2>
          <p className="text-purple-600 font-script">
            How we met and fell in love
          </p>
        </Link>
        
        <Link 
          href="/venue"
          className="group p-6 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg hover:from-cyan-200 hover:to-teal-200 transition-all duration-300 shadow-sm border border-cyan-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Venue
          </h2>
          <p className="text-purple-600 font-script">
            Location details and directions
          </p>
        </Link>
        
        <Link 
          href="/things-to-do"
          className="group p-6 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg hover:from-teal-200 hover:to-green-200 transition-all duration-300 shadow-sm border border-teal-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Things to do
          </h2>
          <p className="text-purple-600 font-script">
            Local activities and recommendations
          </p>
        </Link>
        
        <Link 
          href="/registry"
          className="group p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm border border-green-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Registry
          </h2>
          <p className="text-purple-600 font-script">
            Gift registry information
          </p>
        </Link>
        
        <Link 
          href="/qa"
          className="group p-6 bg-gradient-to-br from-emerald-100 to-pink-100 rounded-lg hover:from-emerald-200 hover:to-pink-200 transition-all duration-300 shadow-sm border border-emerald-200/50"
        >
          <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2 group-hover:text-pink-600">
            Q&A
          </h2>
          <p className="text-purple-600 font-script">
            Frequently asked questions
          </p>
        </Link>
      </div>
    </div>
  );
}
