/**
 * Test data for the DB-seeded "another author's published quiz" used by
 * US-001 TC_AUTH_005 (same account authors + plays a quiz) and reused as the
 * draft fixture for TC_AUTH_008/009 (draft quiz access control).
 */

export function uniqueQuizTitle(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export const MCQ_PROMPT = 'Which word means "hello" in English?';
export const MCQ_CORRECT_OPTION = 'Hello';
export const MCQ_INCORRECT_OPTION = 'Goodbye';

/** Shape matches the `data` jsonb payload read by src/app/play/[id]/page.tsx (McqData). */
export function buildSingleMcqQuestionData() {
  return {
    prompt: MCQ_PROMPT,
    options: [
      { text: MCQ_CORRECT_OPTION, correct: true },
      { text: MCQ_INCORRECT_OPTION, correct: false },
    ],
  };
}
