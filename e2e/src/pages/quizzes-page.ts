import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { HeaderComponent } from '../components/header-component';

/**
 * Page object for `/quizzes` (src/app/quizzes/page.tsx) — a tutor's own quiz list.
 * Used by US-001 TC_AUTH_005/008/009 to create a quiz and to resolve its edit URL
 * (needed to exercise draft access-control from a different session).
 */
export class QuizzesPage extends BasePage {
  readonly header: HeaderComponent;
  readonly newQuizButton: Locator;
  readonly quizTitleTextbox: Locator;
  readonly contentLanguageSelect: Locator;
  readonly createQuizSubmitButton: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.newQuizButton = page.getByRole('button', { name: '+ New quiz' });
    this.quizTitleTextbox = page.getByLabel('Quiz title *');
    this.contentLanguageSelect = page.getByLabel('Content language');
    this.createQuizSubmitButton = page.getByRole('button', { name: 'Create quiz' });
    this.pageHeading = page.getByRole('heading', { name: 'My quizzes' });
  }

  async navigate(): Promise<void> {
    await this.goto('/quizzes');
  }

  /** Row for a given quiz title, scoped to the quizzes table. */
  quizRow(title: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(title) });
  }

  async openCreateQuizDialog(): Promise<void> {
    await this.newQuizButton.click();
  }

/** Composite business action: opens the dialog, fills the title (and optionally the
   * content language — defaults to "English" if not provided), and submits. */
  async createQuiz(title: string, contentLanguageLabel?: string): Promise<void> {
    await this.openCreateQuizDialog();
    await this.quizTitleTextbox.fill(title);
    if (contentLanguageLabel) {
      await this.contentLanguageSelect.selectOption({ label: contentLanguageLabel });
    }
    await this.createQuizSubmitButton.click();
  }

  /**
   * Reads the quiz editor URL (`/quizzes/{id}`) for an owned quiz directly off its
   * "Edit" link, so the quiz id can be reused (e.g. opened from a different
   * session) without needing direct database access.
   */
  async getQuizEditUrl(title: string): Promise<string> {
    const href = await this.quizRow(title).getByRole('link', { name: 'Edit' }).getAttribute('href');
    if (!href) {
      throw new Error(`Could not resolve the edit URL for quiz "${title}"`);
    }
    return href;
  }
}
