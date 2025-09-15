'use client';

import { useAuth } from './auth-provider';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="border border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white font-medium py-1.5 px-4 transition-all duration-300 font-satisfy text-sm"
    >
      Logout
    </button>
  );
}
