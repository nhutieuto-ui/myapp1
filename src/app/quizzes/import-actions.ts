'use server';

import { count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { quizzes, questions } from '@/lib/db/schema';
import { createQuizSchema, MAX_QUIZZES_PER_AUTHOR } from '@/lib/validation/quiz';
import { IMPORT_FILE_EXTENSION, MAX_IMPORT_FILE_SIZE_BYTES } from '@/lib/validation/import';
import { generateJoinCode } from '@/lib/join-code';
import { parseQuizWorkbook } from '@/lib/import/parse-quiz-workbook';

const JOIN_CODE_INSERT_ATTEMPTS = 5;

export type ImportQuizState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
    }
  | undefined;

export async function importQuiz(_prevState: ImportQuizState, formData: FormData): Promise<ImportQuizState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be signed in to import a quiz.' };
  }
  if (session.user.role !== 'tutor') {
    return { error: 'Only tutors can import quizzes.' };
  }

  // AC7: the quota is checked, and the import rejected, before any file processing
  const [{ value: ownedCount }] = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.ownerId, session.user.id));
  if (ownedCount >= MAX_QUIZZES_PER_AUTHOR) {
    return { error: `You have reached your quota of ${MAX_QUIZZES_PER_AUTHOR} quizzes.` };
  }

  // US-021 AS-021.4: quiz metadata comes from the import form, not the sheet
  const parsedMeta = createQuizSchema.safeParse({
    title: formData.get('title'),
    contentLanguage: formData.get('contentLanguage'),
    description: formData.get('description'),
  });
  if (!parsedMeta.success) {
    return { fieldErrors: parsedMeta.error.flatten().fieldErrors };
  }
  const { title, contentLanguage, description } = parsedMeta.data;

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose an .xlsx file to import.' };
  }
  // AC8: only .xlsx files are accepted
  if (!file.name.toLowerCase().endsWith(IMPORT_FILE_EXTENSION)) {
    return { error: `The file must be an ${IMPORT_FILE_EXTENSION} workbook.` };
  }
  if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
    return { error: `The file must be no larger than ${MAX_IMPORT_FILE_SIZE_BYTES / (1024 * 1024)}MB.` };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await parseQuizWorkbook(buffer);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  // US-003 DEC-1 / US-021 DEC-17: imports always create a draft quiz
  const quizId = crypto.randomUUID();
  const questionValues = parsed.rows.map((row, index) => ({
    quizId,
    type: row.type,
    position: index,
    data: row.data,
  }));

  // AS-021.2: atomic all-or-nothing creation — a single batched round trip on the neon-http driver
  for (let attempt = 0; attempt < JOIN_CODE_INSERT_ATTEMPTS; attempt += 1) {
    try {
      await db.batch([
        db.insert(quizzes).values({
          id: quizId,
          ownerId: session.user.id,
          title,
          contentLanguage,
          description,
          questionCount: questionValues.length,
          joinCode: generateJoinCode(),
        }),
        db.insert(questions).values(questionValues),
      ]);
      revalidatePath('/quizzes');
      redirect(`/quizzes/${quizId}`);
    } catch (err) {
      const isUniqueViolation = err instanceof Error && (err as { code?: string }).code === '23505';
      if (!isUniqueViolation || attempt === JOIN_CODE_INSERT_ATTEMPTS - 1) {
        throw err;
      }
    }
  }

  return { error: 'Could not import the quiz. Please try again.' };
}
