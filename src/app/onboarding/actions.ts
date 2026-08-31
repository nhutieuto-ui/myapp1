'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { auth, unstable_update } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { onboardingSchema } from '@/lib/validation/auth';

export type OnboardingState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
    }
  | undefined;

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const parsed = onboardingSchema.safeParse({
    role: formData.get('role'),
    ageBand: formData.get('ageBand'),
    rightsConfirmed: formData.get('rightsConfirmed') === 'on',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { role, ageBand, rightsConfirmed } = parsed.data;

  // AC5: below the global minimum age (DEC-9) — leave role/ageBand unset so onboarding stays required
  if (ageBand === 'under_6') {
    return {
      error:
        'This age band is below the minimum age of 6. Sign out and contact support to close this account.',
    };
  }

  await db
    .update(users)
    .set({
      role,
      ageBand,
      // AC8 / DEC-27: tutor confirms content rights once, at sign-up/onboarding
      tutorRightsConfirmedAt: role === 'tutor' && rightsConfirmed ? new Date() : null,
    })
    .where(eq(users.id, session.user.id));

  await unstable_update({ user: { role, ageBand } });

  redirect('/');
}
