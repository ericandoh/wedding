'use client';

import { useAuth } from './auth-provider';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="font-satisfy border border-gray-400 px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-gray-400 hover:text-white"
    >
      Logout
    </button>
  );
}
