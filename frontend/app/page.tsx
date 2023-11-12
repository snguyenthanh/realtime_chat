'use client'

import { useContext, useEffect } from 'react'
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      if (!currentUser) {
        router.push('/login');
      }
    }
  }, [router, currentUser]);

  return (
    <div />
  );
}