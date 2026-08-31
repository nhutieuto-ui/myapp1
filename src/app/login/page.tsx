import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { LoginForm } from './login-form';

export default async function LoginPage() {
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
          <h1 className="text-lg font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to play, or sign up to start authoring quizzes.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          New to LinguaQuiz?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
