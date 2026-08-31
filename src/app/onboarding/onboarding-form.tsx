'use client';

import { useActionState, useState } from 'react';
import { ageBandOptions } from '@/lib/validation/auth';
import { completeOnboarding } from './actions';

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(completeOnboarding, undefined);
  const [role, setRole] = useState<'learner' | 'tutor'>('learner');

  return (
    <form action={formAction} className="space-y-4">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          I am signing up as a... (DEC-11)
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="role"
              value="learner"
              checked={role === 'learner'}
              onChange={() => setRole('learner')}
            />
            <span className="text-sm font-medium text-gray-900">Learner</span>
          </label>
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="role"
              value="tutor"
              checked={role === 'tutor'}
              onChange={() => setRole('tutor')}
            />
            <span className="text-sm font-medium text-gray-900">Tutor</span>
          </label>
        </div>
        {state?.fieldErrors?.role && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.role[0]}</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="ageBand" className="block text-sm font-medium text-gray-700 mb-1">
          Age band *
        </label>
        <select
          id="ageBand"
          name="ageBand"
          required
          defaultValue=""
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="" disabled>
            Select an age band
          </option>
          {ageBandOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Required to continue (AC3). Minimum age is 6, applied globally (DEC-9).
        </p>
        {state?.fieldErrors?.ageBand && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.ageBand[0]}</p>
        )}
      </div>

      {role === 'tutor' && (
        <div>
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" name="rightsConfirmed" className="mt-1" />
            I confirm any media I later upload will be rights-cleared by me (AC8, DEC-27).
          </label>
          {state?.fieldErrors?.rightsConfirmed && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.rightsConfirmed[0]}</p>
          )}
        </div>
      )}

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
        disabled={pending}
        className="w-full px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Continue'}
      </button>
    </form>
  );
}
