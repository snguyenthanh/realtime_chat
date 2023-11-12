'use client'

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/auth';
import { ConversationContext } from '@/context/conversation';
import useWebSocket from 'react-use-websocket';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Spinner from "@/components/Spinner";
import api from '@/api';
import { wsUrl } from '@/env';
import TextBox from './TextBox';
import MessageList from "./MessageList";
import { Message } from "@/types";
import Subject from './Subject';

const ChatMessagePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { getAccessToken, getSessionId, currentUser } = useContext(AuthContext);
  const { setConversationId } = useContext(ConversationContext);
  const { id: conversationId } = params;
  const [messages, setMessages] = useState<Message[]>([]);

  // Data fetching
  const { data: existingMessages, isLoading } = useSWR(
    `conversationMessages=${conversationId}`,
    async () => await api.getMessagesInConversation(conversationId),
  );
  const { data: participants, isLoading: isLoadingUsers } = useSWR(
    `conversationParticipants=${conversationId}`,
    async () => await api.getUsersInConversation(conversationId),
  );

  // Hooks
  useEffect(() => {
    if (existingMessages) setMessages([...existingMessages]);
  }, [existingMessages])

  useEffect(() => {
    setConversationId(parseInt(conversationId));
  }, [setConversationId, conversationId]);

  // Handlers
  const submitNewMessage = (content: string) => {
    if (!currentUser) return;

    const newMsg: Message = {
      content: content.trim(),
      user_id: currentUser.id,
      conversation_id: parseInt(conversationId),
    }
    sendJsonMessage({
      ...newMsg,
      key: crypto.randomUUID(),
    });
    setMessages((prev: Message[]) => ([...prev, newMsg]));
  }
  const onBackButtonClick = () => {
    setConversationId(null);
    router.push("/messages");
  };


  // Websocket connection
  const accessToken = getAccessToken();
  const sessionId = getSessionId();
  const { sendJsonMessage, readyState } = useWebSocket(
    `${wsUrl}/api/v1/chat?token=${accessToken}&session_id=${sessionId}`,
    {
      onMessage: (event: any) => {
        const newMsg = JSON.parse(event.data);
        setMessages((prev: Message[]) => ([...prev, newMsg]));
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,

      // attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    }
  );

  // Buffering
  if (isLoading || isLoadingUsers) return (
    <div className="h-full flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <Subject
        onBackButtonClick={onBackButtonClick}
        participants={participants}
      />
      <div className="pt-12 h-full flex flex-col justify-between">
          <MessageList messages={messages} participants={participants} />
          <TextBox sendMessage={submitNewMessage} />
      </div>
    </div>
  )
}

export default ChatMessagePage;