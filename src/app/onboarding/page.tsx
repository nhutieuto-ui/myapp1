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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-background p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold">One more step</h1>
          <p className="text-sm text-muted-foreground">
            Tell us your role and age band to finish setting up your account (US-001).
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
