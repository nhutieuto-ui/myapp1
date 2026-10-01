'use server';

import { and, asc, eq, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { attempts, questions, quizzes, responses } from '@/lib/db/schema';
import { checkMcqAnswerSchema, submitAttemptSchema } from '@/lib/validation/attempt';

type McqData = { prompt: string; options: { text: string; correct: boolean }[] };
type SentenceData = { sentence: string; segments: string[]; distractors: string[] };

export type SubmitAttemptResult =
  | { error: string }
  | { success: true; score: number; total: number };

function sameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameSelection(selected: number[], correctIndexes: number[]): boolean {
  if (selected.length !== correctIndexes.length) return false;
  const correctSet = new Set(correctIndexes);
  return selected.every((index) => correctSet.has(index));
}

// US-013 AC1-AC4/AC7/AC9: grade server-side only — the client never receives correct answers pre-submission
export async function submitAttempt(
  quizId: string,
  input: unknown
): Promise<SubmitAttemptResult> {
  const parsed = submitAttemptSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid submission.' };
  }

  // AC9: only a quiz that is public or unlisted may be played or submitted
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, quizId), ne(quizzes.status, 'draft')))
    .limit(1);
  if (!quiz) {
    return { error: 'This quiz is not available to play.' };
  }

  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.position));
  if (quizQuestions.length === 0) {
    return { error: 'This quiz is not available to play.' };
  }

  const answersByQuestionId = new Map(parsed.data.answers.map((answer) => [answer.questionId, answer]));

  let score = 0;
  let scoredQuestionCount = 0;
  const responseRows: (typeof responses.$inferInsert)[] = [];

  for (const question of quizQuestions) {
    const answer = answersByQuestionId.get(question.id);

    if (question.type === 'mcq') {
      scoredQuestionCount += 1;
      const data = question.data as McqData;
      const correctIndexes = data.options
        .map((option, index) => (option.correct ? index : -1))
        .filter((index) => index >= 0);
      const selected = answer?.selectedOptions ?? [];
      // AC7: an unanswered question is scored incorrect
      const correct = selected.length > 0 && sameSelection(selected, correctIndexes);
      if (correct) score += 1;
      responseRows.push({ attemptId: '', questionId: question.id, answer: selected, correct });
    } else if (question.type === 'sentence_rearrangement') {
      scoredQuestionCount += 1;
      const data = question.data as SentenceData;
      const ordered = answer?.orderedSegments ?? [];
      // AC4: exact sequence match against the author-defined order
      const correct = ordered.length > 0 && sameOrder(ordered, data.segments);
      if (correct) score += 1;
      responseRows.push({ attemptId: '', questionId: question.id, answer: ordered, correct });
    } else {
      // AS-013.1: flashcards are unscored practice
      responseRows.push({ attemptId: '', questionId: question.id, answer: null, correct: null });
    }
  }

  const [attempt] = await db
    .insert(attempts)
    .values({
      quizId,
      participantName: parsed.data.participantName,
      score,
      scoredQuestionCount,
    })
    .returning({ id: attempts.id });

  await db.insert(responses).values(
    responseRows.map((row) => ({ ...row, attemptId: attempt.id }))
  );

  return { success: true, score, total: scoredQuestionCount };
}

export type CheckMcqAnswerResult = { error: string } | { correct: boolean; correctOptions: number[] };

// Instant per-question feedback for the card-style MCQ play UI. Does not persist a response —
// submitAttempt() at the end of the quiz remains the sole authoritative grading/storage path.
export async function checkMcqAnswer(quizId: string, input: unknown): Promise<CheckMcqAnswerResult> {
  const parsed = checkMcqAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid request.' };
  }

  // AC9: only a quiz that is public or unlisted may be played
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, quizId), ne(quizzes.status, 'draft')))
    .limit(1);
  if (!quiz) {
    return { error: 'This quiz is not available to play.' };
  }

  const [question] = await db
    .select()
    .from(questions)
    .where(and(eq(questions.id, parsed.data.questionId), eq(questions.quizId, quizId)))
    .limit(1);
  if (!question || question.type !== 'mcq') {
    return { error: 'This question is not available.' };
  }

  const data = question.data as McqData;
  const correctOptions = data.options
    .map((option, index) => (option.correct ? index : -1))
    .filter((index) => index >= 0);
  const correct = sameSelection(parsed.data.selectedOptions, correctOptions);
  return { correct, correctOptions };
}
