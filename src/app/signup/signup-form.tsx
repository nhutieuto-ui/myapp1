'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/github-icon';
import { loginWithGitHub } from '@/app/login/actions';
import { ageBandOptions } from '@/lib/validation/auth';
import { signup } from './actions';

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<'learner' | 'tutor'>('learner');

  return (
    <div className="space-y-4">
      <form action={loginWithGitHub}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <GitHubIcon className="w-4 h-4" />
          Continue with GitHub
        </button>
      </form>
      <p className="text-xs text-center text-gray-400 -mt-2">
        You&apos;ll pick your role and age band on the next step (US-001).
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        or continue with email
        <div className="h-px flex-1 bg-gray-200" />
      </div>

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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          {state?.fieldErrors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          {state?.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          {state?.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        {role === 'tutor' ? (
          // Tutors are assumed 18+; age band is still required server-side (AC3) but not shown.
          <input type="hidden" name="ageBand" value="eighteen_plus" />
        ) : (
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
              Required to create an account (AC3). Minimum age is 6, applied globally (DEC-9).
            </p>
            {state?.fieldErrors?.ageBand && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.ageBand[0]}</p>
            )}
          </div>
        )}

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
          {pending ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

