'use client'

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/auth';

export default function Header() {
  const { currentUser: user, signOut } = useContext(AuthContext);

  return (
    <>
      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="ml-auto flex items-center">
                {!user ? (
                  <div className="flex flex-1 items-center justify-end space-x-6">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign in
                    </Link>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <Link href="/register" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      Create account
                    </Link>
                  </div>
                ) : (
                  <button type="button" onClick={signOut} className="ml-4 lg:ml-6 group block flex-shrink-0">
                    <span className="sr-only">Your profile</span>
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.full_name}</p>
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Log out</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  )
}
