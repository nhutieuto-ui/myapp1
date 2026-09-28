'use client';

import { useActionState } from 'react';
import { joinByCode, type JoinByCodeState } from './actions';

export function JoinForm() {
  const [state, formAction, isPending] = useActionState<JoinByCodeState, FormData>(joinByCode, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Join code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="e.g. AB12CD"
          maxLength={12}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
      >
        {isPending ? 'Joining…' : 'Join quiz'}
      </button>
    </form>
  );
}

