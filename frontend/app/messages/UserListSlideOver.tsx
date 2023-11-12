import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames';
import useDebounce from "@/hooks/useDebounce";
import useSWR, { mutate } from 'swr';
import Spinner from '@/components/Spinner';
import api from '@/api';
import { User } from '@/types';

const tabs = [
  { name: 'All', href: '#', current: true },
]

interface Props {
  open: boolean;
  setOpen: (newBool: boolean) => void;
}

export default function UserListSlideOver({ open, setOpen }: Props) {
  const router = useRouter();
  const [userQuery, setUserQuery] = useState<string>('');
  const debouncedUserQuery = useDebounce(userQuery, 500);
  const { data: users, isLoading } = useSWR(`query=${debouncedUserQuery}`, async () => await api.getUsers(debouncedUserQuery))

  const onUserClick = async (user: User) => {
    const userIds = [user.id];
    const conversation = await api.createConversation(userIds);
    mutate('get_conversations');
    setOpen(false);
    router.push(`/messages/${conversation.id}`)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Users</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Search users */}
                    <div className="px-6 pb-4">
                      <form className="flex gap-x-4" action="#">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="search" className="sr-only">
                              Search
                            </label>
                            <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm sm:leading-6"
                                placeholder="Search"
                                value={userQuery}
                                onChange={evt => setUserQuery(evt.target.value)}
                            />
                            </div>
                        </div>
                      </form>
                    </div>

                    <div className="border-b border-gray-200">
                      <div className="px-6">
                        <nav className="-mb-px flex space-x-6">
                          {tabs.map((tab) => (
                            <a
                              key={tab.name}
                              href={tab.href}
                              className={classNames(
                                tab.current
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                              )}
                            >
                              {tab.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <ul role="list" className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                      {isLoading && (
                        <div className="h-full flex items-center justify-center">
                          <Spinner />
                        </div>
                      )}
                      {users && users.map((user: User) => (
                        <li key={user.username}>
                          <div className="group relative flex items-center px-5 py-6">
                            <button onClick={async () => await onUserClick(user)} className="-m-1 block flex-1 p-1">
                              <div className="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true" />
                              <div className="relative flex min-w-0 flex-1 items-center">
                                <div className="ml-4 truncate">
                                  <p className="truncate text-sm font-medium text-gray-900">{user.full_name}</p>
                                  <p className="truncate text-sm text-gray-500">{'@' + user.username}</p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}