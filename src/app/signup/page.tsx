import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthTabs } from '@/components/auth-tabs';
import { SignUpForm } from './signup-form';

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-semibold"
            aria-hidden="true"
          >
            LQ
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 text-center">
            Choose a role, sign up, and declare your age band (US-001).
          </p>
        </div>

        <AuthTabs active="signup" />

        <SignUpForm />
      </div>
    </div>
  );
}
