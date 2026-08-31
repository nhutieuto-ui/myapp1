'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/github-icon';
import { login, loginWithGitHub } from './actions';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

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

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        or continue with email
        <div className="h-px flex-1 bg-gray-200" />
      </div>

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
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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
          disabled={pending}
          className="w-full px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-sm text-center text-gray-500">
          New to LinguaQuiz?{' '}
          <Link href="/signup" className="text-brand-600 font-medium hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
