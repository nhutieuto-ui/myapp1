'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetPassword } from './actions';

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, undefined);

  // AC1/AC2/AC5: identical confirmation regardless of whether the email matched an account
  if (state?.success) {
    return (
      <div className="space-y-4">
        <div
          className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
          role="status"
        >
          If that email is registered with a password, its password has been updated. You can
          now sign in with your new password.
        </div>
        <p className="text-sm text-center text-gray-500">
          <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
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
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        {state?.fieldErrors?.newPassword && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.newPassword[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm new password
        </label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        {state?.fieldErrors?.confirmNewPassword && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.confirmNewPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
      >
        {pending ? 'Updating…' : 'Reset password'}
      </button>
      <p className="text-sm text-center text-gray-500">
        <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
