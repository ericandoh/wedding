'use client';

import { useAuth } from './auth-provider';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-3 py-1 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-md transition-colors"
    >
      Logout
    </button>
  );
}
