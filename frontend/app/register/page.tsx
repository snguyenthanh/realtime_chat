'use client'
import { useContext, useEffect } from 'react'
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/navigation';
import RegistrationForm from "./RegistrationForm";

export default function RegistrationPage() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      router.push('/messages');
    }
  }, [router, currentUser]);  

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <RegistrationForm />
    </div>
  )
}
