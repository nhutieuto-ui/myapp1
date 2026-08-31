import { logout } from '@/app/actions/sign-out';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="shrink-0 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="Log out of LinguaQuiz"
      >
        Log out
      </button>
    </form>
  );
}
