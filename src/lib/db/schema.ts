import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// US-001 DEC-11: role is chosen explicitly at sign-up, not inferred
export const userRole = pgEnum('user_role', ['tutor', 'learner']);

// US-001 AC3: age band is mandatory; only bands at or above the global minimum (DEC-9) are ever persisted
export const ageBand = pgEnum('age_band', ['under_13', 'thirteen_to_17', 'eighteen_plus']);

// US-003 AS-003.3 / DEC-2: target content languages
export const quizContentLanguage = pgEnum('quiz_content_language', ['chinese', 'japanese', 'english']);

// US-003: draft until published (US-009); public/unlisted distinction is DEC-30
export const quizStatus = pgEnum('quiz_status', ['draft', 'unlisted', 'public']);

// US-004/005/006: the three supported question types
export const questionType = pgEnum('question_type', ['mcq', 'sentence_rearrangement', 'flashcard']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  // Only set for accounts created via the email/password (Credentials) flow
  password: text('password'),
  // Null until sign-up (credentials) or onboarding (OAuth) completes
  role: userRole('role'),
  ageBand: ageBand('age_band'),
  // US-001 AC8 / DEC-27: tutor confirms content rights once, at sign-up
  tutorRightsConfirmedAt: timestamp('tutorRightsConfirmedAt', { mode: 'date' }),
});

export const quizzes = pgTable('quiz', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ownerId: text('ownerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  contentLanguage: quizContentLanguage('content_language').notNull(),
  // US-003 AC1: quizzes are created as drafts; published visibility is set later (US-009)
  status: quizStatus('status').notNull().default('draft'),
  // Denormalized count, updated as questions are added/removed (US-004/005/006, not yet implemented)
  questionCount: integer('question_count').notNull().default(0),
  // US-010 AC10/DEC-33: short human-readable code, an alternative to the join link/QR
  joinCode: text('join_code').unique(),
  // US-009 AC6: author's content-rights/acceptable-use acceptance, recorded with a timestamp at publish time
  rightsConfirmedAt: timestamp('rightsConfirmedAt', { mode: 'date' }),
  publishedAt: timestamp('publishedAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

export const questions = pgTable('question', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: text('quizId')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  type: questionType('type').notNull(),
  // US-003 AC2: display/play order within the quiz
  position: integer('position').notNull(),
  // Type-specific payload (MCQ options, sentence segments, or flashcard sides)
  data: jsonb('data').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// US-013 AS-013.5: link/QR-joined players have no account — attributed by a self-reported display name
export const attempts = pgTable('attempt', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: text('quizId')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  participantName: text('participantName').notNull(),
  // AS-013.1: score counts only auto-scored question types (mcq, sentence_rearrangement)
  score: integer('score').notNull(),
  scoredQuestionCount: integer('scoredQuestionCount').notNull(),
  submittedAt: timestamp('submittedAt', { mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

export const responses = pgTable('response', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  attemptId: text('attemptId')
    .notNull()
    .references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: text('questionId')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  // Participant's submitted answer (selected option indices, ordered segment list, or null for flashcards)
  answer: jsonb('answer'),
  // Null for unscored question types (flashcard, AS-013.1)
  correct: boolean('correct'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (a) => [primaryKey({ columns: [a.userId, a.credentialID] })]
);
