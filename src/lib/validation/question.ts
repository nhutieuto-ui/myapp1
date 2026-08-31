import { z } from 'zod';

// US-003 DEC-16: quiz-level question cap
export const MAX_QUESTIONS_PER_QUIZ = 30;

// US-004 DEC-19: MCQ option cap
export const MAX_MCQ_OPTIONS = 4;
export const MIN_MCQ_OPTIONS = 2;

const mcqOptionSchema = z.object({
  text: z.string().trim().min(1),
  correct: z.boolean(),
});

export const mcqSchema = z
  .object({
    prompt: z.string().trim().min(1, 'Prompt is required').max(500),
    options: z
      .array(mcqOptionSchema)
      .min(MIN_MCQ_OPTIONS, `At least ${MIN_MCQ_OPTIONS} options are required (AC4)`)
      .max(MAX_MCQ_OPTIONS, `A question may have at most ${MAX_MCQ_OPTIONS} options (AC6, DEC-19)`),
  })
  .refine((data) => data.options.some((option) => option.correct), {
    message: 'At least one correct option is required (AC3)',
    path: ['options'],
  });

export type McqInput = z.infer<typeof mcqSchema>;


export const sentenceSchema = z
  .object({
    sentence: z.string().trim().min(1, 'Target sentence is required').max(500),
    segments: z
      .array(z.string().trim())
      .transform((segments) => segments.filter((segment) => segment.length > 0)),
    distractors: z
      .array(z.string().trim())
      .transform((segments) => segments.filter((segment) => segment.length > 0))
      .default([]),
  })
  .refine((data) => data.segments.length >= 2, {
    message: 'At least two segments are required (AC4)',
    path: ['segments'],
  });

export type SentenceInput = z.infer<typeof sentenceSchema>;

export const flashcardSchema = z.object({
  front: z.string().trim().min(1, 'Front content is required (AC2)').max(1000),
  back: z.string().trim().min(1, 'Back content is required (AC2)').max(1000),
});

export type FlashcardInput = z.infer<typeof flashcardSchema>;
