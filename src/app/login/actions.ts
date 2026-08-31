'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { signInSchema } from '@/lib/validation/auth';

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: 'Enter a valid email and password.' };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' };
    }
    throw error; // re-throw redirects and unexpected errors
  }
}

export async function loginWithGitHub() {
  await signIn('github', { redirectTo: '/' });
}
