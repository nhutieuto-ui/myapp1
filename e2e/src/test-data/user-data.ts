/**
 * Test data factories for US-001 (sign-up / sign-in / onboarding).
 *
 * Age band values and labels mirror src/lib/validation/auth.ts exactly —
 * duplicated here (rather than imported) so automation test data stays
 * decoupled from application source, per the "no app-source import for
 * fixtures that model UI test data" convention. Database-seeding utilities
 * (e2e/src/utils/db-client.ts) intentionally DO import the app's schema/db
 * client directly, since that is genuinely shared infrastructure.
 */

export type Role = 'tutor' | 'learner';

/** Age band select option labels, exactly as rendered in the sign-up/onboarding forms. */
export const AGE_BAND_LABELS = {
  belowMinimum: 'Under 6', // AC5: must always be rejected (DEC-9 global minimum age of 6)
  minimumValid: 'Under 13', // AC5 boundary: lowest band that may ever be persisted
  teen: '13\u201317',
  adult: '18+',
} as const;

/** Meets the sign-up password policy (8–72 chars) without being a guessable fixed value. */
export const DEFAULT_PASSWORD = 'Str0ng-Passw0rd!';

export interface SignUpUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  /** Age band select label; omitted for tutors (the field is hidden and forced server-side). */
  ageBandLabel?: string;
  /** Only meaningful for role: 'tutor'. */
  rightsConfirmed?: boolean;
}

/** Generates a unique, collision-free email so sign-up tests are idempotent across reruns. */
export function uniqueEmail(prefix: string): string {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return `${prefix}.${unique}@e2e-test.linguaquiz.dev`;
}

export function buildTutorSignUpUser(overrides: Partial<SignUpUser> = {}): SignUpUser {
  return {
    name: 'Automation Tutor',
    email: uniqueEmail('tutor'),
    password: DEFAULT_PASSWORD,
    role: 'tutor',
    rightsConfirmed: true,
    ...overrides,
  };
}

export function buildLearnerSignUpUser(overrides: Partial<SignUpUser> = {}): SignUpUser {
  return {
    name: 'Automation Learner',
    email: uniqueEmail('learner'),
    password: DEFAULT_PASSWORD,
    role: 'learner',
    ageBandLabel: AGE_BAND_LABELS.minimumValid,
    ...overrides,
  };
}
