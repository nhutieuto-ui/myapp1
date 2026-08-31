'use client';

import { useActionState } from 'react';
import { moveQuestion } from './actions';

export function MoveQuestionButtons({
  quizId,
  questionId,
  disableUp,
  disableDown,
}: {
  quizId: string;
  questionId: string;
  disableUp: boolean;
  disableDown: boolean;
}) {
  const [, upAction, upPending] = useActionState(moveQuestion, undefined);
  const [, downAction, downPending] = useActionState(moveQuestion, undefined);

  return (
    <div className="flex flex-col">
      <form action={upAction}>
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="id" value={questionId} />
        <input type="hidden" name="direction" value="up" />
        <button
          type="submit"
          disabled={disableUp || upPending}
          aria-label="Move question up"
          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </form>
      <form action={downAction}>
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="id" value={questionId} />
        <input type="hidden" name="direction" value="down" />
        <button
          type="submit"
          disabled={disableDown || downPending}
          aria-label="Move question down"
          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
