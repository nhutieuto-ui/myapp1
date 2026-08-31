'use client';

import { useActionState } from 'react';
import { deleteQuiz } from './actions';

export function DeleteQuizButton({ quizId, title }: { quizId: string; title: string }) {
  const [state, formAction, pending] = useActionState(deleteQuiz, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={quizId} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      {state?.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
