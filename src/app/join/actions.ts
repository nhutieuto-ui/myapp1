'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { quizzes } from '@/lib/db/schema';
import { normalizeJoinCode } from '@/lib/join-code';

export type JoinByCodeState = { error?: string } | undefined;

// US-012 AC1/AC2 (code path), US-010 AC10: resolve a human-readable join code to its quiz
export async function joinByCode(
  _prevState: JoinByCodeState,
  formData: FormData
): Promise<JoinByCodeState> {
  const raw = formData.get('code');
  const code = normalizeJoinCode(typeof raw === 'string' ? raw : '');
  if (!code) {
    return { error: 'Enter a join code.' };
  }

  const [quiz] = await db
    .select({ id: quizzes.id, status: quizzes.status })
    .from(quizzes)
    .where(eq(quizzes.joinCode, code))
    .limit(1);

  if (!quiz || quiz.status === 'draft') {
    return { error: 'That code is not valid. Check it and try again.' };
  }

  redirect(`/play/${quiz.id}`);
}
