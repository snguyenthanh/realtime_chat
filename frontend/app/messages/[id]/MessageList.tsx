import { User, Message } from "@/types";
import { useContext } from 'react'
import { AuthContext } from '@/context/auth';
import classNames from "classnames";

interface Props {
  messages: Message[],
  participants: User[],
}

const MessageList = ({ messages, participants }: Props) => {
  const { currentUser } = useContext(AuthContext);

  if (!messages || !participants) return;

  const userMapping: {[key: number]: User} = {};
  participants.forEach((user: User) => {
    userMapping[user.id] = user;
  });

  return (
    <div className="mx-auto max-w-7xl w-full">
      <ul role="list" className="space-y-2 py-4 sm:space-y-4 px-6 lg:px-8 flex flex-col">
        {messages.map((message, index) => (
          <li
            key={`${message.conversation_id}-${index}`}
            className={classNames(
              "px-4 py-6 shadow sm:rounded-lg sm:px-6",
              currentUser && message.user_id === currentUser.id ? 'bg-amber-50' : 'bg-white',
            )}
          >
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <h3 className="text-base font-medium">
                <span className={classNames(
                  currentUser && message.user_id === currentUser.id ? "text-blue-700" : "text-gray-900",
                )}>
                  {currentUser && message.user_id === currentUser.id
                    ? 'Me'
                    : userMapping[message.user_id].full_name
                  }
                </span>
              </h3>
            </div>
            <div
              className="mt-4 space-y-6 text-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;