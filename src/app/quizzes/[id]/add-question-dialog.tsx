'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { MAX_MCQ_OPTIONS } from '@/lib/validation/question';
import { addQuestion } from './actions';

type QuestionKind = 'mcq' | 'sentence_rearrangement' | 'flashcard';

const KIND_LABELS: Record<QuestionKind, string> = {
  mcq: 'Multiple Choice',
  sentence_rearrangement: 'Sentence Rearrangement',
  flashcard: 'Flashcard',
};

export function AddQuestionDialog({ quizId, contentLanguage }: { quizId: string; contentLanguage: string }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<QuestionKind>('mcq');
  const [sentence, setSentence] = useState('');
  const [segments, setSegments] = useState('');
  const [state, formAction, pending] = useActionState(addQuestion, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setSentence('');
      setSegments('');
      setOpen(false);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
      >
        + Add question
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-question-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 id="add-question-title" className="text-xl font-semibold text-gray-900">
              Add question
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-2 bg-gray-100 rounded-lg p-1">
              {(Object.keys(KIND_LABELS) as QuestionKind[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md ${
                    kind === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {KIND_LABELS[value]}
                </button>
              ))}
            </div>

            <form ref={formRef} action={formAction} className="mt-4 space-y-4">
              <input type="hidden" name="quizId" value={quizId} />
              <input type="hidden" name="type" value={kind} />

              {kind === 'mcq' && (
                <>
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                      Prompt *
                    </label>
                    <input
                      id="prompt"
                      name="prompt"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder='"Break the ice" most nearly means...'
                    />
                    {state?.fieldErrors?.prompt && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.prompt[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="block text-sm font-medium text-gray-700">
                      Options (2–{MAX_MCQ_OPTIONS}, check the correct one(s)) *
                    </p>
                    {Array.from({ length: MAX_MCQ_OPTIONS }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" name="correct" value={index} className="shrink-0" aria-label={`Option ${index + 1} is correct`} />
                        <input
                          name="options"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          placeholder={`Option ${index + 1}${index < 2 ? '' : ' (optional)'}`}
                        />
                      </div>
                    ))}
                    {state?.fieldErrors?.options && (
                      <p className="text-sm text-red-600">{state.fieldErrors.options[0]}</p>
                    )}
                  </div>
                </>
              )}

              {kind === 'sentence_rearrangement' && (
                <>
                  <div>
                    <label htmlFor="sentence" className="block text-sm font-medium text-gray-700 mb-1">
                      Target sentence *
                    </label>
                    <input
                      id="sentence"
                      name="sentence"
                      required
                      value={sentence}
                      onChange={(event) => setSentence(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="It's raining cats and dogs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="segments" className="block text-sm font-medium text-gray-700">
                        Segments, separated by | (in correct order) *
                      </label>
                      {contentLanguage === 'english' && (
                        <button
                          type="button"
                          onClick={() => setSegments(sentence.trim().split(/\s+/).filter(Boolean).join(' | '))}
                          className="text-xs font-medium text-brand-600 hover:text-brand-700"
                        >
                          Split by spaces
                        </button>
                      )}
                    </div>
                    <textarea
                      id="segments"
                      name="segments"
                      required
                      rows={2}
                      value={segments}
                      onChange={(event) => setSegments(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="It's | raining | cats | and | dogs"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Joined together, segments must exactly reconstruct the sentence above (AC3).
                    </p>
                    {state?.fieldErrors?.segments && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.segments[0]}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="distractors" className="block text-sm font-medium text-gray-700 mb-1">
                      Distractor segments, separated by | (optional, DEC-21)
                    </label>
                    <input
                      id="distractors"
                      name="distractors"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="dogs and cats | is raining"
                    />
                  </div>
                </>
              )}

              {kind === 'flashcard' && (
                <>
                  <div>
                    <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
                      Front *
                    </label>
                    <textarea
                      id="front"
                      name="front"
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Once in a blue moon"
                    />
                    {state?.fieldErrors?.front && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.front[0]}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
                      Back *
                    </label>
                    <textarea
                      id="back"
                      name="back"
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Something that happens very rarely"
                    />
                    {state?.fieldErrors?.back && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.back[0]}</p>
                    )}
                  </div>
                </>
              )}

              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
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
                  {pending ? 'Adding…' : 'Add question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
