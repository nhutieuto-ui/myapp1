import { expect, test } from '../../src/fixtures/test-fixtures';
import {
  AGE_BAND_LABELS,
  buildLearnerSignUpUser,
  buildTutorSignUpUser,
  DEFAULT_PASSWORD,
  uniqueEmail,
} from '../../src/test-data/user-data';
import { uniqueQuizTitle } from '../../src/test-data/quiz-data';
import { getTutorRightsConfirmedAt, seedCredentialsUser } from '../../src/utils/db-client';
import { SignUpPage } from '../../src/pages/signup-page';

/**
 * US-001 — Sign up and sign in.
 * Traceability: working-artifacts/test-cases/TC-US-001-sign-up-and-sign-in.md
 *
 * Implementation approach: frontend source-code analysis (signup-form.tsx,
 * login-form.tsx, onboarding-form.tsx, their server actions, validation
 * schemas, auth.config.ts, and schema.ts) — no pre-existing page objects
 * existed for this story, so this suite also introduces them.
 *
 * Known test-case/implementation discrepancy: the test-case document's
 * TC_AUTH_002 describes signing up via a "Google" OAuth provider. The
 * implemented app (src/auth.ts) only wires up GitHub OAuth — there is no
 * Google provider. See the TC_AUTH_002 test below for how this is handled.
 */

test.describe('US-001 sign-up and sign-in', () => {
  test('TC_AUTH_001 — a visitor can sign up as a tutor using email/password', async ({
    page,
    signUpPage,
    homePage,
    cleanupEmails,
  }) => {
    const user = buildTutorSignUpUser();
    cleanupEmails.push(user.email);

    await signUpPage.navigate();
    await signUpPage.signUp(user);

    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.header.myQuizzesLink).toBeVisible();
    await expect(homePage.header.roleText).toHaveText('tutor');
  });

  test('TC_AUTH_002 — a visitor can sign up via OAuth and declare role/age band', async () => {
    test.skip(
      true,
      'Test-case/implementation mismatch: TC_AUTH_002 specifies a "Google" OAuth provider, ' +
        'but the implemented app only wires up GitHub OAuth (src/auth.ts) — no Google provider ' +
        'exists to test. Automating the live GitHub OAuth consent screen itself would require ' +
        'a dedicated, non-2FA GitHub test account and depends on a third-party UI outside this ' +
        "team's control, so it is not automated here to keep this suite deterministic. " +
        'SignUpPage.continueWithGitHub()/LoginPage.continueWithGitHub() and OnboardingPage are ' +
        'provided so this can be wired up later against a mocked OAuth provider (or a seeded ' +
        'session), pending BA confirmation of the intended provider.'
    );
  });

  test('TC_AUTH_003 — an existing user can sign in with their registered credentials', async ({
    page,
    loginPage,
    homePage,
    cleanupEmails,
  }) => {
    const email = uniqueEmail('signin');
    cleanupEmails.push(email);
    await seedCredentialsUser({
      name: 'Existing Learner',
      email,
      password: DEFAULT_PASSWORD,
      role: 'learner',
      ageBand: 'thirteen_to_17',
    });

    await loginPage.navigate();
    await loginPage.signIn(email, DEFAULT_PASSWORD);

    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.greetingHeading).toBeVisible();
  });

  test('TC_AUTH_004 — sign-up is blocked when no age band is declared', async ({
    page,
    signUpPage,
    cleanupEmails,
  }) => {
    const user = buildLearnerSignUpUser({ ageBandLabel: undefined });
    cleanupEmails.push(user.email);

    await signUpPage.navigate();
    await signUpPage.signUp(user);

    // The age band <select required> blocks native HTML5 form submission client-side,
    // so no server round-trip (and no account) is produced.
    await expect(page).toHaveURL(/\/signup$/);
    expect(await signUpPage.isAgeBandValid()).toBe(false);
  });

  test('TC_AUTH_005 — one account can author a quiz and play another author\'s quiz', async ({
    page,
    signUpPage,
    quizzesPage,
    playQuizPage,
    cleanupEmails,
    seededOtherAuthorQuiz,
  }) => {
    const user = buildTutorSignUpUser();
    cleanupEmails.push(user.email);
    const myQuizTitle = uniqueQuizTitle('My Authored Quiz');

    await signUpPage.navigate();
    await signUpPage.signUp(user);
    await expect(page).toHaveURL(/\/$/);

    await quizzesPage.navigate();
    await quizzesPage.createQuiz(myQuizTitle);
    await expect(quizzesPage.quizRow(myQuizTitle)).toBeVisible();

    await playQuizPage.navigate(seededOtherAuthorQuiz.quizId);
    await playQuizPage.playSingleMcqQuestion('Automation Player', seededOtherAuthorQuiz.mcqOptionCorrectText);

    await expect(playQuizPage.resultHeading).toBeVisible();
    await expect(page.getByText('1 / 1')).toBeVisible();
  });

  test('TC_AUTH_006 — sign-up is blocked for an age band below the minimum age of 6', async ({
    page,
    signUpPage,
    cleanupEmails,
  }) => {
    const user = buildLearnerSignUpUser({ ageBandLabel: AGE_BAND_LABELS.belowMinimum });
    cleanupEmails.push(user.email);

    await signUpPage.navigate();
    await signUpPage.signUp(user);

    await expect(page).toHaveURL(/\/signup$/);
    await expect(signUpPage.errorAlert).toHaveText(/below the minimum age of 6/i);
  });

  test('TC_AUTH_007 — sign-up succeeds at the minimum-age boundary (age band containing 6)', async ({
    page,
    signUpPage,
    homePage,
    cleanupEmails,
  }) => {
    const user = buildLearnerSignUpUser({ ageBandLabel: AGE_BAND_LABELS.minimumValid });
    cleanupEmails.push(user.email);

    await signUpPage.navigate();
    await signUpPage.signUp(user);

    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.greetingHeading).toBeVisible();
  });

  test('TC_AUTH_008 — a draft quiz is inaccessible to a different signed-in user', async ({
    browser,
    signUpPage,
    quizzesPage,
    cleanupEmails,
  }) => {
    const owner = buildTutorSignUpUser();
    const otherUser = buildTutorSignUpUser();
    cleanupEmails.push(owner.email, otherUser.email);
    const draftTitle = uniqueQuizTitle('Private Draft');

    await signUpPage.navigate();
    await signUpPage.signUp(owner);
    await quizzesPage.navigate();
    await quizzesPage.createQuiz(draftTitle);
    const draftEditUrl = await quizzesPage.getQuizEditUrl(draftTitle);

    const otherContext = await browser.newContext();
    try {
      const otherPage = await otherContext.newPage();
      const otherSignUpPage = new SignUpPage(otherPage);
      await otherSignUpPage.navigate();
      await otherSignUpPage.signUp(otherUser);

      const response = await otherPage.goto(draftEditUrl);
      expect(response?.status()).toBe(404);
    } finally {
      await otherContext.close();
    }
  });

  test('TC_AUTH_009 — a draft quiz is inaccessible to an anonymous visitor', async ({
    browser,
    signUpPage,
    quizzesPage,
    cleanupEmails,
  }) => {
    const owner = buildTutorSignUpUser();
    cleanupEmails.push(owner.email);
    const draftTitle = uniqueQuizTitle('Private Draft');

    await signUpPage.navigate();
    await signUpPage.signUp(owner);
    await quizzesPage.navigate();
    await quizzesPage.createQuiz(draftTitle);
    const draftEditUrl = await quizzesPage.getQuizEditUrl(draftTitle);

    const anonymousContext = await browser.newContext();
    try {
      const anonymousPage = await anonymousContext.newPage();
      await anonymousPage.goto(draftEditUrl);
      await expect(anonymousPage).toHaveURL(/\/login$/);
    } finally {
      await anonymousContext.close();
    }
  });

  test('TC_AUTH_010 — signing out ends the session and requires re-authentication', async ({
    loginPage,
    homePage,
    page,
    cleanupEmails,
  }) => {
    const email = uniqueEmail('signout');
    cleanupEmails.push(email);
    await seedCredentialsUser({
      name: 'Logout Tester',
      email,
      password: DEFAULT_PASSWORD,
      role: 'learner',
      ageBand: 'eighteen_plus',
    });

    await loginPage.navigate();
    await loginPage.signIn(email, DEFAULT_PASSWORD);
    await expect(page).toHaveURL(/\/$/);

    await homePage.header.logout();
    await expect(page).toHaveURL(/\/login$/);

    await homePage.navigate();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC_AUTH_011 — a tutor\'s content-rights confirmation is recorded at sign-up', async ({
    page,
    signUpPage,
    cleanupEmails,
  }) => {
    const user = buildTutorSignUpUser({ rightsConfirmed: true });
    cleanupEmails.push(user.email);

    await signUpPage.navigate();
    await signUpPage.signUp(user);
    await expect(page).toHaveURL(/\/$/);

    const confirmedAt = await getTutorRightsConfirmedAt(user.email);
    expect(confirmedAt).not.toBeNull();
  });
});
