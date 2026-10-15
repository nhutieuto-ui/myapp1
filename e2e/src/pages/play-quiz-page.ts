import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page object for `/play/{quizId}` (src/app/play/[id]/play-quiz.tsx) — the
 * no-account-required quiz-playing flow. Used by US-001 TC_AUTH_005 to prove a
 * single signed-in account can both author and play a quiz, and by
 * TC_AUTH_008/009 to confirm a draft quiz is NOT reachable through this page.
 */
export class PlayQuizPage extends BasePage {
  readonly notAvailableHeading: Locator;
  readonly displayNameTextbox: Locator;
  readonly startQuizButton: Locator;
  readonly reviewAndSubmitButton: Locator;
  readonly submitAttemptButton: Locator;
  readonly resultHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.notAvailableHeading = page.getByRole('heading', { name: 'Quiz not available' });
    this.displayNameTextbox = page.getByPlaceholder('Your display name');
    this.startQuizButton = page.getByRole('button', { name: 'Start quiz' });
    this.reviewAndSubmitButton = page.getByRole('button', { name: 'Review & submit' });
    this.submitAttemptButton = page.getByRole('button', { name: 'Submit attempt' });
    this.resultHeading = page.getByRole('heading', { name: /^Nice work,/ });
  }

  async navigate(quizId: string): Promise<void> {
    await this.goto(`/play/${quizId}`);
  }

  /** The MCQ answer card for a given option's visible text. */
  mcqOption(optionText: string): Locator {
    return this.page.getByRole('button', { name: optionText, exact: true });
  }

  /**
   * Composite business action for a single-question MCQ quiz: enters a display
   * name, selects the given option, and submits the attempt.
   */
  async playSingleMcqQuestion(displayName: string, optionText: string): Promise<void> {
    await this.displayNameTextbox.fill(displayName);
    await this.startQuizButton.click();
    await this.mcqOption(optionText).click();
    await this.reviewAndSubmitButton.click();
    await this.submitAttemptButton.click();
  }
}
