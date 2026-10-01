import { z } from 'zod';

// US-013 AS-013.5: link-joined players have no account; attributed by a self-reported display name
export const participantNameSchema = z
  .string()
  .trim()
  .min(1, 'A display name is required')
  .max(100, 'Display name must be 100 characters or fewer');

// One answer per question in the quiz, in any order
const answerSchema = z.object({
  questionId: z.string().trim().min(1),
  // AC2/AC3: selected option indices for MCQ
  selectedOptions: z.array(z.number().int().min(0)).optional(),
  // AC4/AC5: segment texts in the order the player arranged them
  orderedSegments: z.array(z.string()).optional(),
});

export const submitAttemptSchema = z.object({
  participantName: participantNameSchema,
  answers: z.array(answerSchema),
});

// Instant per-question feedback for the card-style MCQ play UI (not the final scored submission)
export const checkMcqAnswerSchema = z.object({
  questionId: z.string().trim().min(1),
  selectedOptions: z.array(z.number().int().min(0)).min(1),
});

export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
