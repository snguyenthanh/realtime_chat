'use client'

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/auth';
import { ConversationProvider } from '@/context/conversation';

interface Props {
  children?: ReactNode
}

export function Providers({ 
    children,
  }: Props) {
  return (
    <AuthProvider>
      <ConversationProvider>
        {children}
      </ConversationProvider>
    </AuthProvider>
  )
}