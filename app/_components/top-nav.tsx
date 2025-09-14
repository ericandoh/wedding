'use client';

import Link from 'next/link';
import LogoutButton from './logout-button';

export default function TopNav() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-pink-200/50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-serif font-bold text-purple-800">
            Eric + Hang's Wedding
          </Link>
          <div className="hidden lg:flex space-x-6">
            <Link 
              href="/rsvp" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              RSVP
            </Link>
            <Link 
              href="/schedule" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              Schedule
            </Link>
            <Link 
              href="/our-story" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              Our Story
            </Link>
            <Link 
              href="/venue" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              Venue
            </Link>
            <Link 
              href="/things-to-do" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              Things to do
            </Link>
            <Link 
              href="/registry" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
            >
              Registry
            </Link>
            <Link 
              href="/qa" 
              className="text-purple-600 hover:text-pink-600 transition-colors font-medium"
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
