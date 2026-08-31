import { z } from 'zod';

// US-003 AS-003.3 / DEC-2: target content languages
export const CONTENT_LANGUAGE_VALUES = ['chinese', 'japanese', 'english'] as const;

export const contentLanguageOptions: { value: (typeof CONTENT_LANGUAGE_VALUES)[number]; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
];

// US-003 DEC-26: per-author quiz quota
export const MAX_QUIZZES_PER_AUTHOR = 50;

const contentLanguageSchema = z.enum(CONTENT_LANGUAGE_VALUES, {
  message: 'Choose a content language',
});

export const createQuizSchema = z.object({
  // US-003 AC4: title is mandatory
  title: z.string().trim().min(1, 'Title is required').max(200),
  contentLanguage: contentLanguageSchema,
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

// US-009 DEC-30: Public is fully discoverable, Unlisted is reachable only via direct link
export const publishVisibilitySchema = z.enum(['public', 'unlisted'], {
  message: 'Choose a visibility option',
});

export const publishQuizSchema = z.object({
  visibility: publishVisibilitySchema,
  // US-009 AC6: author accepts responsibility at publish time
  rightsConfirmed: z.literal(true, {
    message: 'You must confirm the content-rights and visibility statement to publish',
  }),
});

export type PublishQuizInput = z.infer<typeof publishQuizSchema>;

