'use client'
import { useState, useContext, useEffect, ReactNode } from 'react'
import { AuthContext } from '@/context/auth';
import { ConversationContext} from '@/context/conversation';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'
import {PencilIcon} from '@heroicons/react/20/solid'
import classNames from 'classnames';

const ConversationList = dynamic(() => import('./ConversationList'))
const UserListSlideOver = dynamic(() => import('./UserListSlideOver'))

interface Props {
  children?: ReactNode
}

export default function LayoutChatPage({ children }: Props) {
  const router = useRouter();
  const [openSlideOver, setOpenSlideOver] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);
  const { conversationId } = useContext(ConversationContext);

  useEffect(() => {
    if (!currentUser) {
      if (!currentUser) {
        router.push('/login');
      }
    }
  }, [router, currentUser]);

  return (
    <>
      <UserListSlideOver open={openSlideOver} setOpen={setOpenSlideOver} />
      <div className="flex h-full flex-col">
        {/* Bottom section */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* Main area */}
          <main className="min-w-0 flex border-t border-gray-200 w-full">
            <section
              aria-labelledby="message-heading"
              className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
            >
              {children}
            </section>

            {/* Message list*/}
            <aside className={classNames(
              "order-first flex-shrink-0",
              conversationId === null ? "block" : "hidden md:block",
            )}>
              <div className="relative flex h-full w-96 flex-col border-r border-gray-200 bg-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-full inline-flex items-center justify-between h-16 bg-white px-6">
                    <div className="flex items-baseline space-x-3">
                      <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex items-center gap-x-1.5 rounded-md shadow-sm sm:space-x-3 sm:shadow-none bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10"
                      onClick={() => setOpenSlideOver(true)}
                    >
                      <PencilIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      New message
                    </button>
                  </div>
                  <div className="border-b border-t border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
                    Sorted by date
                  </div>
                </div>
                <ConversationList />
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  )
}