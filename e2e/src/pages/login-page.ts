import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page object for `/login` (src/app/login/login-form.tsx).
 */
export class LoginPage extends BasePage {
  readonly emailTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly signInButton: Locator;
  readonly continueWithGitHubButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailTextbox = page.getByLabel('Email');
    this.passwordTextbox = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.continueWithGitHubButton = page.getByRole('button', { name: 'Continue with GitHub' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
  }

  async navigate(): Promise<void> {
    await this.goto('/login');
  }

  /** Fills and submits the credentials sign-in form. Does not wait for navigation. */
  async signIn(email: string, password: string): Promise<void> {
    await this.emailTextbox.fill(email);
    await this.passwordTextbox.fill(password);
    await this.signInButton.click();
  }

  /** Starts the GitHub OAuth sign-in flow; the browser will navigate to github.com. */
  async continueWithGitHub(): Promise<void> {
    await this.continueWithGitHubButton.click();
  }
}
