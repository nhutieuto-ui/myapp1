import type { Locator, Page } from '@playwright/test';

/**
 * Component object for the authenticated app header shown on `/` and `/quizzes`
 * (nav links + account summary + logout). Shared across pages, so it is a
 * component object rather than duplicated page-object locators (SRP).
 */
export class HeaderComponent {
  private readonly root: Locator;
  readonly discoverLink: Locator;
  readonly myQuizzesLink: Locator;
  readonly roleText: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('header');
    this.discoverLink = this.root.getByRole('link', { name: 'Discover' });
    this.myQuizzesLink = this.root.getByRole('link', { name: 'My quizzes' });
    this.roleText = this.root.getByText(/^(tutor|learner|no role yet)$/i);
    this.logoutButton = this.root.getByRole('button', { name: 'Log out' });
  }

  /** Ends the session (US-001 AC7) by submitting the logout form. */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
