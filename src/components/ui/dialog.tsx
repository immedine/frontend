'use client';

import * as Dialog from '@radix-ui/react-dialog';
export default function ControlledDialog({isOpen, setIsOpen, heading, children}) {

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 z-10" />
          <Dialog.Content className={`fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow w-full sm:w-[450px] z-10`}>
            <Dialog.Title className="text-lg font-bold flex justify-between item-center">{heading}
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className=" text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 py-4">
              {children}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
