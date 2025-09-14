'use client';

import { useAuth } from './auth-provider';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-3 py-1 text-sm text-purple-600 hover:text-pink-600 border border-purple-300 hover:border-pink-300 rounded-md transition-colors font-medium"
    >
      Logout
    </button>
  );
}
