import * as AlertDialog from '@radix-ui/react-alert-dialog';

export default function CustomAlertDialog({open, setOpen, header, description, submitButtonText, onSubmit}) {
  return (
    <>

      {/* Alert Dialog */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow">
            <AlertDialog.Title className="text-lg font-bold">
              {header}
            </AlertDialog.Title>
            {description ? <AlertDialog.Description className="mt-2 text-sm text-gray-600">
              {description}
            </AlertDialog.Description> : null}

            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  onClick={onSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  {submitButtonText}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
