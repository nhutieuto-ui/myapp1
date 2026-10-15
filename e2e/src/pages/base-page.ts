import type { Locator, Page } from '@playwright/test';

/**
 * Shared behaviour for every page object: navigation and the error-alert
 * pattern (`role="alert"`) used consistently across the sign-up/sign-in/
 * onboarding/quiz forms in this app.
 *
 * Page objects extending this class must not contain assertions — they only
 * expose locators and business-action methods. Assertions belong in spec files.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Server-rendered error banner (`<div role="alert">`) shown by form actions. */
  get errorAlert(): Locator {
    return this.page.getByRole('alert');
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** Returns the trimmed error banner text, or an empty string if not present. */
  async getErrorMessage(): Promise<string> {
    const text = await this.errorAlert.textContent();
    return text?.trim() ?? '';
  }
}
