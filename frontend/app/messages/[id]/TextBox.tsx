import { useState } from "react";

interface Props {
  sendMessage: (message: any) => void;
}

const TextBox = ({ sendMessage }: Props) => {
  const [message, setMessage] = useState<string>('');

  return (
    <div className="sticky bottom-0 w-full mt-4 pb-16 flex items-start space-x-4 bg-white">
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="overflow-hidden ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Write something
            </label>
            <textarea
              rows={3}
              name="text"
              id="messageText"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Write something"
              value={message}
              onChange={evt => setMessage(evt.target.value)}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  sendMessage(message);
                  setMessage('');
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextBox;