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

const BLANK_OPTIONS = ['', '', '', ''];
const BLANK_CORRECT = [false, false, false, false];

export function AddQuestionDialog({ quizId, contentLanguage }: { quizId: string; contentLanguage: string }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<QuestionKind>('mcq');
  const [state, formAction, pending] = useActionState(addQuestion, undefined);

  // Every field is controlled so its value survives the reset the browser
  // applies to the <form> once an action finishes, including failed ones.
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(BLANK_OPTIONS);
  const [correct, setCorrect] = useState<boolean[]>(BLANK_CORRECT);
  const [sentence, setSentence] = useState('');
  const [segments, setSegments] = useState('');
  const [distractors, setDistractors] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  // Remounting the form after every submission re-syncs its inputs to the
  // controlled values above, undoing the browser's native reset-on-submit
  // (which otherwise leaves fields blank even after a failed submission).
  const [formVersion, setFormVersion] = useState(0);
  const submittedKindRef = useRef<QuestionKind | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFormVersion((version) => version + 1);
    if (state?.success) {
      setPrompt('');
      setOptions(BLANK_OPTIONS);
      setCorrect(BLANK_CORRECT);
      setSentence('');
      setSegments('');
      setDistractors('');
      setFront('');
      setBack('');
      setOpen(false);
    }
  }, [state]);

  // Only show errors for the type that was actually submitted, so they don't
  // linger on screen after switching to a different question-type tab.
  const showErrorsForKind = submittedKindRef.current === kind;

  // US-005 AC3 preview: mirrors the server's reconstruction check so users can
  // see and fix a mismatch before submitting, instead of only after a failed
  // round-trip. Chinese/Japanese join segments with no space (DEC-20).
  const segmentList = segments
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean);
  const joinsWithSpace = contentLanguage === 'english';
  const reconstructedPreview = segmentList.join(joinsWithSpace ? ' ' : '');
  const sentenceMatchesSegments = segmentList.length >= 2 && reconstructedPreview === sentence.trim();
  const isSentenceFormReady =
    kind !== 'sentence_rearrangement' || segments.trim().length === 0 || sentenceMatchesSegments;

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

            <form
              key={formVersion}
              action={formAction}
              onSubmit={() => {
                submittedKindRef.current = kind;
              }}
              className="mt-4 space-y-4"
            >
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
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder='"Break the ice" most nearly means...'
                    />
                    {showErrorsForKind && state?.fieldErrors?.prompt && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.prompt[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="block text-sm font-medium text-gray-700">
                      Options (2–{MAX_MCQ_OPTIONS}, check the correct one(s)) *
                    </p>
                    {options.map((optionText, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="correct"
                          value={index}
                          checked={correct[index]}
                          onChange={(event) =>
                            setCorrect((prev) => prev.map((value, i) => (i === index ? event.target.checked : value)))
                          }
                          className="shrink-0"
                          aria-label={`Option ${index + 1} is correct`}
                        />
                        <input
                          name="options"
                          value={optionText}
                          onChange={(event) =>
                            setOptions((prev) => prev.map((value, i) => (i === index ? event.target.value : value)))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          placeholder={`Option ${index + 1}${index < 2 ? '' : ' (optional)'}`}
                        />
                      </div>
                    ))}
                    {showErrorsForKind && state?.fieldErrors?.options && (
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
                    <p
                      className={`mt-1 text-sm ${
                        segments.trim() && !sentenceMatchesSegments ? 'text-amber-600' : 'text-gray-500'
                      }`}
                    >
                      {joinsWithSpace
                        ? 'Segments are joined with a space between them.'
                        : 'Segments are joined with no space between them (Chinese/Japanese, DEC-20).'}{' '}
                      {segments.trim() &&
                        (sentenceMatchesSegments
                          ? 'Matches the target sentence ✓'
                          : `Currently reconstructs to: "${reconstructedPreview}" — must match exactly (AC3).`)}
                    </p>
                    {showErrorsForKind && state?.fieldErrors?.segments && (
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
                      value={distractors}
                      onChange={(event) => setDistractors(event.target.value)}
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
                      value={front}
                      onChange={(event) => setFront(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Once in a blue moon"
                    />
                    {showErrorsForKind && state?.fieldErrors?.front && (
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
                      value={back}
                      onChange={(event) => setBack(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Something that happens very rarely"
                    />
                    {showErrorsForKind && state?.fieldErrors?.back && (
                      <p className="mt-1 text-sm text-red-600">{state.fieldErrors.back[0]}</p>
                    )}
                  </div>
                </>
              )}

              {showErrorsForKind && state?.error && (
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
                  disabled={pending || !isSentenceFormReady}
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
