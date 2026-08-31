'use client';

import { useActionState, useEffect, useState } from 'react';
import { publishQuiz, unpublishQuiz } from './actions';

export function PublishDialog({ quizId, status }: { quizId: string; status: string }) {
  const [open, setOpen] = useState(false);
  const [publishState, publishAction, publishPending] = useActionState(publishQuiz, undefined);
  const [, unpublishAction, unpublishPending] = useActionState(unpublishQuiz, undefined);

  useEffect(() => {
    if (publishState?.success) {
      setOpen(false);
    }
  }, [publishState]);

  if (status !== 'draft') {
    return (
      <form action={unpublishAction}>
        <input type="hidden" name="quizId" value={quizId} />
        <button
          type="submit"
          disabled={unpublishPending}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-60"
        >
          {unpublishPending ? 'Unpublishing…' : 'Unpublish'}
        </button>
      </form>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
      >
        Publish
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 id="publish-modal-title" className="text-xl font-semibold text-gray-900">
              Publish quiz
            </h2>
            <p className="mt-2 text-sm text-gray-500">Choose who can find and play this quiz.</p>

            <form action={publishAction} className="mt-4 space-y-4">
              <input type="hidden" name="quizId" value={quizId} />

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                  <input type="radio" name="visibility" value="public" defaultChecked className="mt-1" />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Public</span>
                    <span className="block text-sm text-gray-500">Discoverable in search and browse (US-011)</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                  <input type="radio" name="visibility" value="unlisted" className="mt-1" />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Unlisted</span>
                    <span className="block text-sm text-gray-500">Reachable only via direct link or QR (DEC-30)</span>
                  </span>
                </label>
              </div>
              {publishState?.fieldErrors?.visibility && (
                <p className="text-sm text-red-600">{publishState.fieldErrors.visibility[0]}</p>
              )}

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" name="rightsConfirmed" className="mt-1" />
                I confirm I have the rights to share this content and accept the visibility statement.
              </label>
              {publishState?.fieldErrors?.rightsConfirmed && (
                <p className="text-sm text-red-600">{publishState.fieldErrors.rightsConfirmed[0]}</p>
              )}

              {publishState?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
                  {publishState.error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishPending}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
                >
                  {publishPending ? 'Publishing…' : 'Confirm & publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
