'use client'
import { useContext, useEffect } from 'react'
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/navigation';

import LoginForm from "./LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      router.push('/messages');
    }
  }, [router, currentUser]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <LoginForm />
    </div>
  )
}
