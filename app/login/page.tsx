'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [keyphrase, setKeyphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyphrase }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid keyphrase. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white bg-cover bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-md w-full">
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-black drop-shadow-lg">
              Welcome to Eric + Hang's Wedding!
            </h2>
            <p className="mt-2 text-lg font-script text-black drop-shadow-md">
              Type in the secret password to gain access!
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="keyphrase" className="sr-only">
                Secret Keyphrase
              </label>
              <input
                id="keyphrase"
                name="keyphrase"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white/90 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                placeholder="shh..."
                value={keyphrase}
                onChange={(e) => setKeyphrase(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-white/80 px-3 py-2 rounded-md shadow-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-script font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? 'Verifying...' : 'Access Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
