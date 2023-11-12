import { useContext } from 'react';
import { AuthContext } from '@/context/auth';
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { User } from '@/types';

interface Props {
  onBackButtonClick: () => void;
  participants: User[];
}

const Subject = ({ onBackButtonClick, participants }: Props) => {
  const { currentUser } = useContext(AuthContext);

  const participantsExceptSelf = participants?.filter((user: User) => currentUser && user.id !== currentUser.id);
  const title = participantsExceptSelf?.map((user: User) => user.full_name).join(',');
  const subtitle = participantsExceptSelf?.map((user: User) => `@${user.username}`).join(',');

  return (
    <div className="bg-white pb-6 pt-5 shadow sticky top-0">
      <div className="px-4 flex items-center sm:px-6 lg:px-8">
        <div className="block md:hidden">
          <button
            type="button"
            onClick={onBackButtonClick}
            className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
          >
            <ChevronLeftIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1">
          <h1 id="message-heading" className="text-lg font-medium text-gray-900">
            {title}
          </h1>
          <p className="mt-1 truncate text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default Subject;