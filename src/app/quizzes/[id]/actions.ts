'use server';

import { and, asc, count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { quizzes, questions } from '@/lib/db/schema';
import { flashcardSchema, mcqSchema, sentenceSchema, MAX_QUESTIONS_PER_QUIZ } from '@/lib/validation/question';
import { publishQuizSchema } from '@/lib/validation/quiz';

type ActionState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      success?: boolean;
    }
  | undefined;

async function getOwnedQuiz(quizId: string, userId: string) {
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.ownerId, userId)))
    .limit(1);
  return quiz;
}

export async function addQuestion(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const quizId = String(formData.get('quizId') ?? '');
  // US-003 AC6: only the owner may edit
  const quiz = await getOwnedQuiz(quizId, session.user.id);
  if (!quiz) {
    return { error: 'Quiz not found, or you do not have permission to edit it.' };
  }

  const type = String(formData.get('type') ?? '');
  if (!['mcq', 'sentence_rearrangement', 'flashcard'].includes(type)) {
    return { error: 'Invalid question type.' };
  }

  // US-003 AC8 / DEC-16: reject adding a question beyond the quiz's maximum
  const [{ value: existingCount }] = await db
    .select({ value: count() })
    .from(questions)
    .where(eq(questions.quizId, quizId));
  if (existingCount >= MAX_QUESTIONS_PER_QUIZ) {
    return { error: `This quiz has reached its maximum of ${MAX_QUESTIONS_PER_QUIZ} questions (AC8, DEC-16).` };
  }

  let data: unknown;

  if (type === 'mcq') {
    const optionTexts = formData.getAll('options').map(String);
    const correctFlags = new Set(formData.getAll('correct').map(String));
    const options = optionTexts
      .map((text, index) => ({ text: text.trim(), correct: correctFlags.has(String(index)) }))
      .filter((option) => option.text.length > 0);

    const parsed = mcqSchema.safeParse({ prompt: formData.get('prompt'), options });
    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors };
    }
    data = parsed.data;
  } else if (type === 'sentence_rearrangement') {
    const segments = String(formData.get('segments') ?? '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);
    const distractors = String(formData.get('distractors') ?? '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsed = sentenceSchema.safeParse({ sentence: formData.get('sentence'), segments, distractors });
    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    // US-005 AC3: segments joined in order must reconstruct the target sentence
    const delimiter = quiz.contentLanguage === 'english' ? ' ' : '';
    const reconstructed = parsed.data.segments.join(delimiter);
    if (reconstructed !== parsed.data.sentence) {
      return {
        error: `Segments must reconstruct the target sentence exactly (AC3). Joined result: "${reconstructed}".`,
      };
    }
    data = parsed.data;
  } else {
    const parsed = flashcardSchema.safeParse({ front: formData.get('front'), back: formData.get('back') });
    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors };
    }
    data = parsed.data;
  }

  await db.insert(questions).values({ quizId, type: type as typeof questions.$inferInsert.type, position: existingCount, data });
  await db
    .update(quizzes)
    .set({ questionCount: existingCount + 1, updatedAt: new Date() })
    .where(eq(quizzes.id, quizId));

  revalidatePath(`/quizzes/${quizId}`);
  return { success: true };
}

export async function deleteQuestion(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const quizId = String(formData.get('quizId') ?? '');
  const questionId = String(formData.get('id') ?? '');

  const quiz = await getOwnedQuiz(quizId, session.user.id);
  if (!quiz) {
    return { error: 'Quiz not found, or you do not have permission to edit it.' };
  }

  const deleted = await db
    .delete(questions)
    .where(and(eq(questions.id, questionId), eq(questions.quizId, quizId)))
    .returning({ id: questions.id });
  if (deleted.length === 0) {
    return { error: 'Question not found.' };
  }

  await db
    .update(quizzes)
    .set({ questionCount: Math.max(0, quiz.questionCount - 1), updatedAt: new Date() })
    .where(eq(quizzes.id, quizId));

  revalidatePath(`/quizzes/${quizId}`);
  return undefined;
}

export async function moveQuestion(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const quizId = String(formData.get('quizId') ?? '');
  const questionId = String(formData.get('id') ?? '');
  const direction = String(formData.get('direction') ?? '');

  const quiz = await getOwnedQuiz(quizId, session.user.id);
  if (!quiz) {
    return { error: 'Quiz not found, or you do not have permission to edit it.' };
  }

  // US-003 AC2: reorder questions
  const ordered = await db
    .select({ id: questions.id, position: questions.position })
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.position));

  const index = ordered.findIndex((q) => q.id === questionId);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= ordered.length) {
    return undefined;
  }

  const current = ordered[index];
  const swapWith = ordered[swapIndex];

  await db.update(questions).set({ position: swapWith.position }).where(eq(questions.id, current.id));
  await db.update(questions).set({ position: current.position }).where(eq(questions.id, swapWith.id));

  revalidatePath(`/quizzes/${quizId}`);
  return undefined;
}

export async function publishQuiz(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const quizId = String(formData.get('quizId') ?? '');
  const quiz = await getOwnedQuiz(quizId, session.user.id);
  if (!quiz) {
    return { error: 'Quiz not found, or you do not have permission to publish it.' };
  }

  const parsed = publishQuizSchema.safeParse({
    visibility: formData.get('visibility'),
    rightsConfirmed: formData.get('rightsConfirmed') === 'on',
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // US-009 AC2: block publishing an empty quiz
  if (quiz.questionCount < 1) {
    return { error: 'Add at least one question before publishing (AC2).' };
  }

  await db
    .update(quizzes)
    .set({
      status: parsed.data.visibility,
      publishedAt: new Date(),
      rightsConfirmedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(quizzes.id, quizId));

  revalidatePath(`/quizzes/${quizId}`);
  revalidatePath('/quizzes');
  return { success: true };
}

export async function unpublishQuiz(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in.' };
  }

  const quizId = String(formData.get('quizId') ?? '');
  const quiz = await getOwnedQuiz(quizId, session.user.id);
  if (!quiz) {
    return { error: 'Quiz not found, or you do not have permission to unpublish it.' };
  }

  // US-009 AC3: unpublish — no longer discoverable or startable, attempts remain visible to the author
  await db
    .update(quizzes)
    .set({ status: 'draft', updatedAt: new Date() })
    .where(eq(quizzes.id, quizId));

  revalidatePath(`/quizzes/${quizId}`);
  revalidatePath('/quizzes');
  return undefined;
}
