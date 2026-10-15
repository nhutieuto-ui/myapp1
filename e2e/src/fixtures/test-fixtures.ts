import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { SignUpPage } from '../pages/signup-page';
import { OnboardingPage } from '../pages/onboarding-page';
import { HomePage } from '../pages/home-page';
import { QuizzesPage } from '../pages/quizzes-page';
import { PlayQuizPage } from '../pages/play-quiz-page';
import { deleteUserByEmail, seedPublishedQuizWithSingleMcq } from '../utils/db-client';
import { uniqueEmail } from '../test-data/user-data';
import { MCQ_CORRECT_OPTION, MCQ_INCORRECT_OPTION, uniqueQuizTitle } from '../test-data/quiz-data';

interface PageFixtures {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  onboardingPage: OnboardingPage;
  homePage: HomePage;
  quizzesPage: QuizzesPage;
  playQuizPage: PlayQuizPage;
}

interface DataFixtures {
  /**
   * Emails of any users created during a test (via the sign-up UI or direct
   * DB seeding). Deleting by email cascades (FK onDelete: 'cascade') to any
   * quizzes/questions/attempts/responses that user owns, so this is the only
   * cleanup tests need to register for idempotent reruns.
   */
  cleanupEmails: string[];
  /** A DB-seeded published quiz owned by a different tutor, with one MCQ question. */
  seededOtherAuthorQuiz: {
    quizId: string;
    ownerEmail: string;
    mcqOptionCorrectText: string;
    mcqOptionIncorrectText: string;
  };
}

export const test = base.extend<PageFixtures & DataFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  quizzesPage: async ({ page }, use) => {
    await use(new QuizzesPage(page));
  },
  playQuizPage: async ({ page }, use) => {
    await use(new PlayQuizPage(page));
  },

  cleanupEmails: async ({}, use) => {
    const emails: string[] = [];
    await use(emails);
    for (const email of emails) {
      try {
        await deleteUserByEmail(email);
      } catch (error) {
        console.warn(`cleanupEmails: failed to delete test user "${email}"`, error);
      }
    }
  },

  seededOtherAuthorQuiz: async ({}, use) => {
    const ownerEmail = uniqueEmail('other-tutor');
    const { quizId } = await seedPublishedQuizWithSingleMcq({
      ownerEmail,
      ownerName: 'Other Tutor',
      title: uniqueQuizTitle('Seeded Published Quiz'),
    });

    await use({
      quizId,
      ownerEmail,
      mcqOptionCorrectText: MCQ_CORRECT_OPTION,
      mcqOptionIncorrectText: MCQ_INCORRECT_OPTION,
    });

    try {
      await deleteUserByEmail(ownerEmail); // cascades: deletes the seeded quiz + question too
    } catch (error) {
      console.warn(`seededOtherAuthorQuiz: failed to delete seeded owner "${ownerEmail}"`, error);
    }
  },
});

export { expect } from '@playwright/test';
