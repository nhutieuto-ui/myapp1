'use client';

import { useState, useTransition } from 'react';
import { checkMcqAnswer, submitAttempt } from './actions';

export type PlayableQuestion =
  | { id: string; type: 'mcq'; prompt: string; options: string[]; multiple: boolean }
  | { id: string; type: 'sentence_rearrangement'; pool: string[] }
  | { id: string; type: 'flashcard'; front: string; back: string };

type McqAnswer = { selectedOptions: number[] };
type SentenceAnswer = { orderIndexes: number[] };
type AnswerState = Record<string, McqAnswer | SentenceAnswer | undefined>;
type McqFeedback = { correct: boolean; correctOptions: number[] };

// Fixed per-slot colors for the card grid (matches position, not option content)
const CARD_GRADIENTS = [
  'from-lime-600 to-yellow-800',
  'from-purple-500 to-violet-800',
  'from-orange-500 to-red-700',
  'from-teal-400 to-cyan-700',
];

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-10.2-9.2C.2 8.9 1.4 5.4 4.7 4.3c2-.7 4 .1 5.3 1.9C11.3 4.4 13.3 3.6 15.3 4.3c3.3 1.1 4.5 4.6 2.9 7.5C15.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V5a1 1 0 011-1h4M20 9V5a1 1 0 00-1-1h-4M4 15v4a1 1 0 001 1h4M20 15v4a1 1 0 01-1 1h-4" />
    </svg>
  );
}

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
  const [mcqFeedback, setMcqFeedback] = useState<Record<string, McqFeedback>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isChecking, startChecking] = useTransition();

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

  function runMcqCheck(questionId: string, selectedOptions: number[]) {
    startChecking(async () => {
      const res = await checkMcqAnswer(quizId, { questionId, selectedOptions });
      if ('error' in res) {
        setSubmitError(res.error);
        return;
      }
      setMcqFeedback((prev) => ({ ...prev, [questionId]: res }));
    });
  }

  // Single-answer MCQ: tapping a card immediately commits and reveals feedback
  function handleSingleCardTap(questionId: string, optionIndex: number) {
    if (mcqFeedback[questionId] || isChecking) return;
    setAnswers((prev) => ({ ...prev, [questionId]: { selectedOptions: [optionIndex] } }));
    runMcqCheck(questionId, [optionIndex]);
  }

  // Multi-answer MCQ: cards toggle selection, an explicit "Check answer" reveals feedback
  function handleCheckMultiple(questionId: string) {
    const selected = (answers[questionId] as McqAnswer | undefined)?.selectedOptions ?? [];
    if (selected.length === 0 || isChecking) return;
    runMcqCheck(questionId, selected);
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
            setMcqFeedback({});
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
  const feedback = mcqFeedback[question.id];
  // Answering an MCQ card gates the "Continue" action; other question types advance freely
  const canAdvance = question.type !== 'mcq' || !!feedback;

  const promptText =
    question.type === 'mcq'
      ? question.prompt
      : question.type === 'flashcard'
        ? question.front
        : 'Put the words in the correct order';

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-gradient-to-b from-[#4a1942] via-[#3a1140] to-[#2a0d2e] text-white">
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm" aria-hidden="true">
              Q
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 rounded-full px-3 py-1.5 text-sm font-semibold" aria-hidden="true">
              <HeartIcon className="w-4 h-4 text-rose-400" />0
            </div>
            <div className="bg-black/25 rounded-full px-3 py-1.5 text-sm font-semibold" aria-hidden="true">
              Reward
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              aria-label="Exit quiz"
              className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
            >
              <MenuIcon className="w-5 h-5" />
            </a>
            <button
              type="button"
              aria-label="Toggle fullscreen"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
            >
              <ExpandIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <span className="bg-black/25 text-amber-300 rounded-full px-4 py-1 text-sm font-semibold">
            {index + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl px-6 py-8 text-center">
          <p className="text-xl sm:text-2xl font-semibold">{promptText}</p>
        </div>

        <div className="mt-6">
          {question.type === 'mcq' && (() => {
            const selected = (answers[question.id] as McqAnswer | undefined)?.selectedOptions ?? [];
            return (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, i) => {
                    const isSelected = selected.includes(i);
                    const isCorrectOption = feedback?.correctOptions.includes(i) ?? false;
                    let stateClasses = '';
                    if (feedback) {
                      if (isCorrectOption) stateClasses = 'ring-4 ring-emerald-400';
                      else if (isSelected) stateClasses = 'ring-4 ring-rose-500 opacity-80';
                      else stateClasses = 'opacity-40';
                    } else if (isSelected) {
                      stateClasses = 'ring-4 ring-white/70';
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!!feedback || isChecking}
                        onClick={() =>
                          question.multiple
                            ? toggleMcqOption(question.id, i)
                            : handleSingleCardTap(question.id, i)
                        }
                        className={`relative rounded-2xl p-6 min-h-32 flex items-center justify-center text-center font-semibold shadow-lg bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} ${stateClasses} transition disabled:cursor-default`}
                      >
                        <span className="absolute top-2 right-2 bg-black/25 rounded-md px-2 py-0.5 text-xs">
                          {i + 1}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {question.multiple && !feedback && (
                  <button
                    type="button"
                    onClick={() => handleCheckMultiple(question.id)}
                    disabled={selected.length === 0 || isChecking}
                    className="mt-4 w-full bg-amber-400 text-gray-900 font-bold rounded-xl px-6 py-3 hover:bg-amber-300 disabled:opacity-40"
                  >
                    {isChecking ? 'Checking…' : 'Check answer'}
                  </button>
                )}

                {feedback && (
                  <div
                    className={`mt-4 rounded-xl p-4 text-center font-semibold ${
                      feedback.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {feedback.correct ? 'Correct!' : 'Not quite — the correct card is highlighted.'}
                  </div>
                )}
              </div>
            );
          })()}

          {question.type === 'sentence_rearrangement' && (() => {
            const orderIndexes = (answers[question.id] as SentenceAnswer | undefined)?.orderIndexes ?? [];
            const used = new Set(orderIndexes);
            return (
              <div className="bg-white rounded-2xl p-6 text-gray-900">
                <div className="flex flex-wrap gap-2 min-h-12 p-3 border border-dashed border-gray-300 rounded-lg">
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
                className="p-10 bg-white text-gray-900 rounded-2xl text-center min-h-32 flex items-center justify-center shadow-lg"
                aria-live="polite"
              >
                <p className="text-xl font-semibold">
                  {flipped[question.id] ? question.back : question.front}
                </p>
              </div>
              <button
                type="button"
                aria-pressed={!!flipped[question.id]}
                onClick={() => setFlipped((prev) => ({ ...prev, [question.id]: !prev[question.id] }))}
                className="mt-4 mx-auto block px-5 py-2.5 bg-white/10 border border-white/30 text-white text-sm font-medium rounded-xl hover:bg-white/20"
              >
                {flipped[question.id] ? 'Show front' : 'Flip card'}
              </button>
            </div>
          )}
        </div>

        {submitError && <p className="text-sm text-rose-300 mt-4 text-center">{submitError}</p>}

        <div className="mt-8 flex justify-between gap-3 pb-6">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="px-4 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-xl hover:bg-white/20 disabled:opacity-30"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => (isLast ? setStage('review') : setIndex((i) => i + 1))}
            disabled={!canAdvance}
            className="px-5 py-2.5 bg-amber-400 text-gray-900 text-sm font-bold rounded-xl hover:bg-amber-300 disabled:opacity-30"
          >
            {isLast ? 'Review & submit' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

