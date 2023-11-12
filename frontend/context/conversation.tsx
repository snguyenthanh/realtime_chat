'use client'

import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from '@/types';

interface Props {
  children?: ReactNode
}

export const ConversationContext = createContext({
  conversationId: null as number | null,
  setConversationId: (_conversationId: number | null) => {},
});

export const ConversationProvider = ({ children }: Props) => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const value = {
    conversationId,
    setConversationId,
  }

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}
