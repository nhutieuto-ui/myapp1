'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { signIn } from '@/auth';
import { signUpSchema } from '@/lib/validation/auth';

export type SignUpState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
    }
  | undefined;

export async function signup(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    ageBand: formData.get('ageBand'),
    rightsConfirmed: formData.get('rightsConfirmed') === 'on',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, role, ageBand, rightsConfirmed } = parsed.data;

  // AC5: block sign-up below the global minimum age (DEC-9) — no account, no data stored
  if (ageBand === 'under_6') {
    return {
      error:
        'This age band is below the minimum age of 6. No account has been created and no further information has been stored.',
    };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role,
    ageBand,
    // AC8 / DEC-27: tutor confirms content rights once, at sign-up
    tutorRightsConfirmedAt: role === 'tutor' && rightsConfirmed ? new Date() : null,
  });

  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created, but sign-in failed. Try signing in.' };
    }
    throw error; // re-throw redirects and unexpected errors
  }
}
