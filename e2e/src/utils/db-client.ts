import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { questions, quizzes, users } from '@/lib/db/schema';
import { generateJoinCode } from '@/lib/join-code';
import { buildSingleMcqQuestionData } from '../test-data/quiz-data';

/**
 * Direct-database test-data utility used ONLY to arrange/clean up preconditions
 * that are not themselves under test (e.g. "an account already exists", "another
 * author's quiz is already published"). It intentionally reuses the app's own
 * `db` client, schema, and `generateJoinCode()` helper rather than duplicating
 * that logic — per automation-standard's "maximize reuse" and "prefer API/DB
 * setup over UI arrange steps for speed and isolation" guidance.
 *
 * This module is test infrastructure, not application code: it is never
 * imported by `src/`, and it never modifies `src/`.
 */

export type SeededRole = 'tutor' | 'learner';
export type SeededAgeBand = 'under_13' | 'thirteen_to_17' | 'eighteen_plus';

export interface SeedUserInput {
  name: string;
  email: string;
  password: string;
  role: SeededRole;
  ageBand: SeededAgeBand;
}

/** Inserts a credentials-login user directly, bypassing the sign-up UI. */
export async function seedCredentialsUser(input: SeedUserInput): Promise<{ id: string }> {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      ageBand: input.ageBand,
      tutorRightsConfirmedAt: input.role === 'tutor' ? new Date() : null,
    })
    .returning({ id: users.id });
  return created;
}

/** Deletes a user (and, via FK cascade, their quizzes/accounts/sessions). Safe if absent. */
export async function deleteUserByEmail(email: string): Promise<void> {
  await db.delete(users).where(eq(users.email, email));
}

/** Reads back `tutorRightsConfirmedAt` for TC_AUTH_011 (rights-confirmation is recorded). */
export async function getTutorRightsConfirmedAt(email: string): Promise<Date | null> {
  const [row] = await db
    .select({ tutorRightsConfirmedAt: users.tutorRightsConfirmedAt })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return row?.tutorRightsConfirmedAt ?? null;
}

export interface SeedPublishedQuizInput {
  ownerEmail: string;
  ownerName: string;
  title: string;
}

/**
 * Seeds a distinct tutor account plus one published (status: 'public') quiz
 * with a single two-option MCQ question — enough to exercise the play flow
 * end-to-end (TC_AUTH_005) and to act as the "different user's quiz" fixture.
 */
export async function seedPublishedQuizWithSingleMcq(
  input: SeedPublishedQuizInput
): Promise<{ ownerId: string; quizId: string }> {
  const owner = await seedCredentialsUser({
    name: input.ownerName,
    email: input.ownerEmail,
    password: 'not-used-for-sign-in',
    role: 'tutor',
    ageBand: 'eighteen_plus',
  });

  const [quiz] = await db
    .insert(quizzes)
    .values({
      ownerId: owner.id,
      title: input.title,
      contentLanguage: 'english',
      status: 'public',
      joinCode: generateJoinCode(),
      publishedAt: new Date(),
      rightsConfirmedAt: new Date(),
      questionCount: 1,
    })
    .returning({ id: quizzes.id });

  await db.insert(questions).values({
    quizId: quiz.id,
    type: 'mcq',
    position: 0,
    data: buildSingleMcqQuestionData(),
  });

  return { ownerId: owner.id, quizId: quiz.id };
}

/** Deletes a quiz (and, via FK cascade, its questions/attempts/responses). Safe if absent. */
export async function deleteQuizById(quizId: string): Promise<void> {
  await db.delete(quizzes).where(eq(quizzes.id, quizId));
}
