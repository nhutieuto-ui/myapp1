import Link from 'next/link';

const tabClass =
  'px-3 py-2 text-sm font-medium rounded-md text-center transition-colors';

export function AuthTabs({ active }: { active: 'signin' | 'signup' }) {
  return (
    <div
      role="tablist"
      aria-label="Sign in or sign up"
      className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mb-6"
    >
      <Link
        href="/login"
        role="tab"
        aria-selected={active === 'signin'}
        className={`${tabClass} ${
          active === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
        }`}
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        role="tab"
        aria-selected={active === 'signup'}
        className={`${tabClass} ${
          active === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
        }`}
      >
        Sign up
      </Link>
    </div>
  );
}
