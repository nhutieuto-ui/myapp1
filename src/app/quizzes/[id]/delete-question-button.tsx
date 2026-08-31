'use client';

import { useActionState } from 'react';
import { deleteQuestion } from './actions';

export function DeleteQuestionButton({ quizId, questionId }: { quizId: string; questionId: string }) {
  const [state, formAction, pending] = useActionState(deleteQuestion, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm('Delete this question? This cannot be undone.')) {
          event.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="quizId" value={quizId} />
      <input type="hidden" name="id" value={questionId} />
      <button type="submit" disabled={pending} className="text-sm text-red-600 hover:text-red-700 disabled:opacity-60">
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      {state?.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
    </form>
  );
}
