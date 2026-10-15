import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { HeaderComponent } from '../components/header-component';

/**
 * Page object for `/` (src/app/page.tsx), the authenticated landing page.
 */
export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly greetingHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.greetingHeading = page.getByRole('heading', { level: 1 });
  }

  async navigate(): Promise<void> {
    await this.goto('/');
  }
}
