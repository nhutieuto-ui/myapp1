'use server';

import { and, count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { quizzes } from '@/lib/db/schema';
import { createQuizSchema, MAX_QUIZZES_PER_AUTHOR } from '@/lib/validation/quiz';
import { generateJoinCode } from '@/lib/join-code';

const JOIN_CODE_INSERT_ATTEMPTS = 5;

export type CreateQuizState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      success?: boolean;
    }
  | undefined;

export async function createQuiz(
  _prevState: CreateQuizState,
  formData: FormData
): Promise<CreateQuizState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in to create a quiz.' };
  }
  if (session.user.role !== 'tutor') {
    return { error: 'Only tutors can create quizzes.' };
  }

  const parsed = createQuizSchema.safeParse({
    title: formData.get('title'),
    contentLanguage: formData.get('contentLanguage'),
    description: formData.get('description'),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // US-003 AC10 / DEC-26: reject creating a quiz beyond the per-author quota
  const [{ value: ownedCount }] = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.ownerId, session.user.id));
  if (ownedCount >= MAX_QUIZZES_PER_AUTHOR) {
    return { error: `You have reached your quota of ${MAX_QUIZZES_PER_AUTHOR} quizzes.` };
  }

  const { title, contentLanguage, description } = parsed.data;

  // US-010 AC10/DEC-33: assign a unique join code, retrying on the rare collision
  for (let attempt = 0; attempt < JOIN_CODE_INSERT_ATTEMPTS; attempt += 1) {
    try {
      await db.insert(quizzes).values({
        ownerId: session.user.id,
        title,
        contentLanguage,
        description,
        joinCode: generateJoinCode(),
      });
      revalidatePath('/quizzes');
      return { success: true };
    } catch (err) {
      const isUniqueViolation = err instanceof Error && (err as { code?: string }).code === '23505';
      if (!isUniqueViolation || attempt === JOIN_CODE_INSERT_ATTEMPTS - 1) {
        throw err;
      }
    }
  }

  return { error: 'Could not create the quiz. Please try again.' };
}

export type DeleteQuizState = { error?: string } | undefined;

export async function deleteQuiz(
  _prevState: DeleteQuizState,
  formData: FormData
): Promise<DeleteQuizState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const id = formData.get('id');
  if (typeof id !== 'string' || !id) {
    return { error: 'Missing quiz id.' };
  }

  // US-003 AC6/AC7: only the owner may delete; ownership is enforced in the WHERE clause
  const deleted = await db
    .delete(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.ownerId, session.user.id)))
    .returning({ id: quizzes.id });

  if (deleted.length === 0) {
    return { error: 'Quiz not found, or you do not have permission to delete it.' };
  }

  revalidatePath('/quizzes');
  return undefined;
}
