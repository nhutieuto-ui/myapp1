'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';

// US-010 AS-010.3: the play link is the primary distribution path for a published quiz
export function ShareLink({ quizId, joinCode }: { quizId: string; joinCode: string | null }) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  // Starts relative (matches SSR output) and fills in the origin post-mount to avoid a hydration mismatch.
  const [origin, setOrigin] = useState('');
  const playUrl = `${origin}/play/${quizId}`;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(playUrl, { width: 200, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [playUrl]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(playUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleCopyCode() {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setCodeCopied(false);
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

      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-start gap-6">
        <div>
          <p className="text-sm font-medium text-gray-700">QR code</p>
          <p className="text-sm text-gray-500 mt-1">Scan to open the play link on a phone.</p>
          <div className="mt-3">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt={`QR code linking to the play page for ${quizId}`}
                width={160}
                height={160}
                unoptimized
                className="border border-gray-200 rounded-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />
            )}
          </div>
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="quiz-join-qr.png"
              className="mt-2 inline-block text-sm text-brand-600 font-medium hover:text-brand-700"
            >
              Download QR code
            </a>
          )}
        </div>

        {joinCode && (
          <div>
            <p className="text-sm font-medium text-gray-700">Join code</p>
            <p className="text-sm text-gray-500 mt-1">
              Or share this code — students can enter it at{' '}
              <span className="font-medium text-gray-700">/join</span>.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold tracking-widest text-gray-900 bg-gray-50">
                {joinCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                {codeCopied ? 'Copied!' : 'Copy code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
