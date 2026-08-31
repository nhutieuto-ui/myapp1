import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { OnboardingForm } from './onboarding-form';

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role && session.user.ageBand) {
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
          <h1 className="text-lg font-semibold text-gray-900">One more step</h1>
          <p className="text-sm text-gray-500 text-center">
            Tell us your role and age band to finish setting up your account (US-001).
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
