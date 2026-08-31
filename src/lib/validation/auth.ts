import { z } from 'zod';

const AGE_BAND_VALUES = ['under_6', 'under_13', 'thirteen_to_17', 'eighteen_plus'] as const;

// Extra "under_6" option exists only so sign-up can detect and reject it (US-001 AC5, DEC-9);
// it is never a persistable AgeBand value.
export const ageBandOptions: { value: (typeof AGE_BAND_VALUES)[number]; label: string }[] = [
  { value: 'under_6', label: 'Under 6' },
  { value: 'under_13', label: 'Under 13' },
  { value: 'thirteen_to_17', label: '13\u201317' },
  { value: 'eighteen_plus', label: '18+' },
];

export const persistableAgeBands = ['under_13', 'thirteen_to_17', 'eighteen_plus'] as const;
export type PersistableAgeBand = (typeof persistableAgeBands)[number];

const ageBandSchema = z.enum(AGE_BAND_VALUES, { message: 'Choose an age band' });
const roleSchema = z.enum(['tutor', 'learner'], { message: 'Choose a role' });

const emailSchema = z.email('Enter a valid email address').max(255);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema,
    ageBand: ageBandSchema,
    rightsConfirmed: z.boolean().optional(),
  })
  .refine((data) => data.role !== 'tutor' || data.rightsConfirmed === true, {
    message: 'Tutors must confirm content rights to sign up (AC8)',
    path: ['rightsConfirmed'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const onboardingSchema = z
  .object({
    role: roleSchema,
    ageBand: ageBandSchema,
    rightsConfirmed: z.boolean().optional(),
  })
  .refine((data) => data.role !== 'tutor' || data.rightsConfirmed === true, {
    message: 'Tutors must confirm content rights to continue (AC8)',
    path: ['rightsConfirmed'],
  });

export type OnboardingInput = z.infer<typeof onboardingSchema>;

