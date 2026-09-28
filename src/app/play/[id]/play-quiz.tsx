'use client';

import { useState, useTransition } from 'react';
import { submitAttempt } from './actions';

export type PlayableQuestion =
  | { id: string; type: 'mcq'; prompt: string; options: string[] }
  | { id: string; type: 'sentence_rearrangement'; pool: string[] }
  | { id: string; type: 'flashcard'; front: string; back: string };

type McqAnswer = { selectedOptions: number[] };
type SentenceAnswer = { orderIndexes: number[] };
type AnswerState = Record<string, McqAnswer | SentenceAnswer | undefined>;

function isAnswered(question: PlayableQuestion, answers: AnswerState): boolean {
  if (question.type === 'mcq') {
    return ((answers[question.id] as McqAnswer | undefined)?.selectedOptions?.length ?? 0) > 0;
  }
  if (question.type === 'sentence_rearrangement') {
    return ((answers[question.id] as SentenceAnswer | undefined)?.orderIndexes?.length ?? 0) > 0;
  }
  return true; // AS-013.1: flashcards are unscored, never "unanswered"
}

export function PlayQuiz({ quizId, questions }: { quizId: string; questions: PlayableQuestion[] }) {
  const [stage, setStage] = useState<'name' | 'play' | 'review' | 'result'>('name');
  const [participantName, setParticipantName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = questions[index];

  function toggleMcqOption(questionId: string, optionIndex: number) {
    setAnswers((prev) => {
      const current = (prev[questionId] as McqAnswer | undefined)?.selectedOptions ?? [];
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      return { ...prev, [questionId]: { selectedOptions: next } };
    });
  }

  function addSegment(questionId: string, poolIndex: number) {
    setAnswers((prev) => {
      const current = (prev[questionId] as SentenceAnswer | undefined)?.orderIndexes ?? [];
      return { ...prev, [questionId]: { orderIndexes: [...current, poolIndex] } };
    });
  }

  function removeSegment(questionId: string, position: number) {
    setAnswers((prev) => {
      const current = (prev[questionId] as SentenceAnswer | undefined)?.orderIndexes ?? [];
      return { ...prev, [questionId]: { orderIndexes: current.filter((_, i) => i !== position) } };
    });
  }

  // US-013 AC5: keyboard-operable reordering, no drag required
  function moveSegment(questionId: string, position: number, direction: 'up' | 'down') {
    setAnswers((prev) => {
      const current = (prev[questionId] as SentenceAnswer | undefined)?.orderIndexes ?? [];
      const swapWith = direction === 'up' ? position - 1 : position + 1;
      if (swapWith < 0 || swapWith >= current.length) return prev;
      const next = [...current];
      [next[position], next[swapWith]] = [next[swapWith], next[position]];
      return { ...prev, [questionId]: { orderIndexes: next } };
    });
  }

  function handleStart() {
    if (participantName.trim().length === 0) {
      setNameError('A display name is required.');
      return;
    }
    setNameError(null);
    setStage('play');
  }

  function handleSubmit() {
    setSubmitError(null);
    const payload = {
      participantName: participantName.trim(),
      answers: questions
        .filter((q): q is Extract<PlayableQuestion, { type: 'mcq' | 'sentence_rearrangement' }> =>
          q.type !== 'flashcard'
        )
        .map((q) => {
          if (q.type === 'mcq') {
            return { questionId: q.id, selectedOptions: (answers[q.id] as McqAnswer | undefined)?.selectedOptions ?? [] };
          }
          const orderIndexes = (answers[q.id] as SentenceAnswer | undefined)?.orderIndexes ?? [];
          return { questionId: q.id, orderedSegments: orderIndexes.map((i) => q.pool[i]) };
        }),
    };

    startTransition(async () => {
      const res = await submitAttempt(quizId, payload);
      if ('error' in res) {
        setSubmitError(res.error);
        return;
      }
      setResult({ score: res.score, total: res.total });
      setStage('result');
    });
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-900 font-medium">This quiz has no questions yet.</p>
      </div>
    );
  }

  if (stage === 'name') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900">What&apos;s your name?</h2>
        <p className="text-sm text-gray-500 mt-1">
          No account needed — your name identifies your attempt to the quiz author.
        </p>
        <input
          type="text"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          placeholder="Your display name"
          className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          maxLength={100}
        />
        {nameError && <p className="text-sm text-red-600 mt-2">{nameError}</p>}
        <button
          type="button"
          onClick={handleStart}
          className="mt-4 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
        >
          Start quiz
        </button>
      </div>
    );
  }

  if (stage === 'result' && result) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Nice work, {participantName}!</h2>
        {/* DEC-42: score only, correct answers are never shown */}
        <p className="mt-2 text-3xl font-bold text-brand-600">
          {result.score} / {result.total}
        </p>
        <p className="text-sm text-gray-500 mt-1">questions scored correctly</p>
        <button
          type="button"
          onClick={() => {
            setStage('play');
            setIndex(0);
            setAnswers({});
            setFlipped({});
            setResult(null);
          }}
          className="mt-6 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Play again
        </button>
      </div>
    );
  }

  if (stage === 'review') {
    const unanswered = questions.filter((q) => !isAnswered(q, answers));
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900">Review your answers</h2>
        {unanswered.length > 0 && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            {unanswered.length} question{unanswered.length > 1 ? 's are' : ' is'} unanswered and will be scored
            incorrect (AC7). You can go back, or submit anyway.
          </div>
        )}
        <ul className="mt-4 space-y-2">
          {questions.map((q, i) => (
            <li key={q.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Question {i + 1}</span>
              <span className={isAnswered(q, answers) ? 'text-green-600' : 'text-amber-600'}>
                {q.type === 'flashcard' ? 'Reviewed' : isAnswered(q, answers) ? 'Answered' : 'Unanswered'}
              </span>
            </li>
          ))}
        </ul>
        {submitError && <p className="text-sm text-red-600 mt-3">{submitError}</p>}
        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setStage('play');
              setIndex(questions.length - 1);
            }}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            Back to questions
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60"
          >
            {isPending ? 'Submitting…' : 'Submit attempt'}
          </button>
        </div>
      </div>
    );
  }

  const isLast = index === questions.length - 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-xs font-medium text-gray-500 mb-3">
        Question {index + 1} of {questions.length}
      </p>

      {question.type === 'mcq' && (
        <div>
          <p className="font-medium text-gray-900">{question.prompt}</p>
          <div className="mt-4 space-y-2">
            {question.options.map((option, i) => {
              const checked = (answers[question.id] as McqAnswer | undefined)?.selectedOptions?.includes(i) ?? false;
              return (
                <label
                  key={i}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMcqOption(question.id, i)}
                  />
                  <span className="text-sm text-gray-900">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {question.type === 'sentence_rearrangement' && (() => {
        const orderIndexes = (answers[question.id] as SentenceAnswer | undefined)?.orderIndexes ?? [];
        const used = new Set(orderIndexes);
        return (
          <div>
            <p className="font-medium text-gray-900">Put the words in the correct order</p>
            <div className="mt-4 flex flex-wrap gap-2 min-h-12 p-3 border border-dashed border-gray-300 rounded-lg">
              {orderIndexes.length === 0 && <span className="text-sm text-gray-400">Tap words below to build your answer</span>}
              {orderIndexes.map((poolIndex, position) => (
                <span
                  key={`${poolIndex}-${position}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-sm text-brand-800"
                >
                  {question.pool[poolIndex]}
                  <button
                    type="button"
                    aria-label="Move earlier"
                    onClick={() => moveSegment(question.id, position, 'up')}
                    disabled={position === 0}
                    className="disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    onClick={() => moveSegment(question.id, position, 'down')}
                    disabled={position === orderIndexes.length - 1}
                    className="disabled:opacity-30"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => removeSegment(question.id, position)}
                    className="text-brand-500 hover:text-brand-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.pool.map((segment, poolIndex) =>
                used.has(poolIndex) ? null : (
                  <button
                    key={poolIndex}
                    type="button"
                    onClick={() => addSegment(question.id, poolIndex)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {segment}
                  </button>
                )
              )}
            </div>
          </div>
        );
      })()}

      {question.type === 'flashcard' && (
        <div>
          <div
            className="p-8 border border-gray-200 rounded-lg text-center min-h-32 flex items-center justify-center"
            aria-live="polite"
          >
            <p className="text-lg text-gray-900">
              {flipped[question.id] ? question.back : question.front}
            </p>
          </div>
          <button
            type="button"
            aria-pressed={!!flipped[question.id]}
            onClick={() => setFlipped((prev) => ({ ...prev, [question.id]: !prev[question.id] }))}
            className="mt-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            {flipped[question.id] ? 'Show front' : 'Flip card'}
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => (isLast ? setStage('review') : setIndex((i) => i + 1))}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
        >
          {isLast ? 'Review & submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
