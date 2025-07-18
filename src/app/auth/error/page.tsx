'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'OAuthSignin' && 'There was a problem signing in with Discord. Please try again.'}
            {error === 'OAuthCallback' && 'There was a problem with the Discord callback. Please try again.'}
            {error === 'OAuthCreateAccount' && 'There was a problem creating your account. Please try again.'}
            {error === 'SteamAuth' && 'There was a problem signing in with Steam. Please try again.'}
            {!error && 'An unknown error occurred. Please try again.'}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <Link
              href="/login"
              className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 