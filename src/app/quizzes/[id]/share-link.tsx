'use client';

import { useState } from 'react';

// US-010 AS-010.3: the play link is the primary distribution path for a published quiz
export function ShareLink({ quizId }: { quizId: string }) {
  const [copied, setCopied] = useState(false);
  const playUrl = typeof window !== 'undefined' ? `${window.location.origin}/play/${quizId}` : `/play/${quizId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(playUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm font-medium text-gray-700">Play link</p>
      <p className="text-sm text-gray-500 mt-1">
        Anyone with this link can play the quiz — no account required.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          readOnly
          value={playUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Preview
        </a>
      </div>
    </div>
  );
}
