import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/api";
import Spinner from '@/components/Spinner';
import { Conversation } from "@/types";

const ConversationList = () => {
  const router = useRouter();
  const { data: conversations, isLoading } = useSWR('get_conversations', api.getConversations);

  if (isLoading) return (
    <div className="h-full flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
      <nav aria-label="Message list" className="min-h-0 flex-1 overflow-y-auto">
          <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
            {conversations && conversations.map((conversation: Conversation) => (
                <li
                  key={conversation.conversation_id}
                  className="relative bg-white px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
                  onClick={() => {
                    router.push(`/messages/${conversation.conversation_id}`)
                  }}
                >
                  <div className="mt-2 flex justify-between space-x-3">
                      <div className="min-w-0 flex-1">
                        <div className="block focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="truncate text-sm font-medium text-gray-900">{conversation.user.full_name}</p>
                        </div>
                      </div>
                      <time
                          dateTime={conversation.created_at}
                          className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                      >
                      {(new Date(conversation.created_at)).toLocaleDateString()}
                      </time>
                  </div>
                </li>
            ))}
          </ul>
      </nav>
    );
}

export default ConversationList;