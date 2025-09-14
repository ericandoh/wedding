'use client';

import Link from 'next/link';
import LogoutButton from './logout-button';

export default function TopNav() {
  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-serif font-bold text-white">
            Eric + Hang's Wedding
          </Link>
          <div className="hidden lg:flex space-x-6">
            <Link 
              href="/rsvp" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              RSVP
            </Link>
            <Link 
              href="/schedule" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Schedule
            </Link>
            <Link 
              href="/our-story" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Our Story
            </Link>
            <Link 
              href="/venue" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Venue
            </Link>
            <Link 
              href="/things-to-do" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Things to do
            </Link>
            <Link 
              href="/registry" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Registry
            </Link>
            <Link 
              href="/qa" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Q&A
            </Link>
          </div>
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
