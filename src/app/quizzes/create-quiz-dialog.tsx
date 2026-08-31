'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { contentLanguageOptions } from '@/lib/validation/quiz';
import { createQuiz } from './actions';

export function CreateQuizDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createQuiz, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        + New quiz
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-quiz-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 id="create-quiz-title" className="text-xl font-semibold text-gray-900">
              New quiz
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Give it a title and content language. You can add questions afterwards.
            </p>

            <form ref={formRef} action={formAction} className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz title *
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="English Idioms, Set 3"
                />
                <p className="mt-1 text-sm text-gray-500">Required to save (AC4).</p>
                {state?.fieldErrors?.title && (
                  <p className="mt-1 text-sm text-red-600">{state.fieldErrors.title[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="contentLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Content language
                </label>
                <select
                  id="contentLanguage"
                  name="contentLanguage"
                  required
                  defaultValue="english"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {contentLanguageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state?.fieldErrors?.contentLanguage && (
                  <p className="mt-1 text-sm text-red-600">{state.fieldErrors.contentLanguage[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Common English idioms for intermediate learners"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              {state?.error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  role="alert"
                >
                  {state.error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
                >
                  {pending ? 'Creating…' : 'Create quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
