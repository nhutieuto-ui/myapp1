import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { SignUpForm } from './signup-form';

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            LQ
          </div>
          <h1 className="text-lg font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Choose a role, sign up, and declare your age band (US-001).
          </p>
        </div>

        <SignUpForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
