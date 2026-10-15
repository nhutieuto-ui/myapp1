import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import type { SignUpUser } from '../test-data/user-data';

/**
 * Page object for `/signup` (src/app/signup/signup-form.tsx).
 */
export class SignUpPage extends BasePage {
  readonly learnerRoleRadio: Locator;
  readonly tutorRoleRadio: Locator;
  readonly nameTextbox: Locator;
  readonly emailTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly ageBandSelect: Locator;
  readonly rightsConfirmedCheckbox: Locator;
  readonly createAccountButton: Locator;
  readonly continueWithGitHubButton: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    super(page);
    this.learnerRoleRadio = page.getByRole('radio', { name: 'Learner' });
    this.tutorRoleRadio = page.getByRole('radio', { name: 'Tutor' });
    this.nameTextbox = page.getByLabel('Name');
    this.emailTextbox = page.getByLabel('Email');
    this.passwordTextbox = page.getByLabel('Password');
    // Label text is "Age band *"; match by substring so the asterisk doesn't need to be typed.
    this.ageBandSelect = page.getByLabel(/Age band/);
    this.rightsConfirmedCheckbox = page.getByRole('checkbox', { name: /confirm any media/i });
    this.createAccountButton = page.getByRole('button', { name: 'Create account' });
    this.continueWithGitHubButton = page.getByRole('button', { name: 'Continue with GitHub' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
  }

  async navigate(): Promise<void> {
    await this.goto('/signup');
  }

  async selectRole(role: 'learner' | 'tutor'): Promise<void> {
    const radio = role === 'tutor' ? this.tutorRoleRadio : this.learnerRoleRadio;
    await radio.check();
  }

  async fillAccountDetails(name: string, email: string, password: string): Promise<void> {
    await this.nameTextbox.fill(name);
    await this.emailTextbox.fill(email);
    await this.passwordTextbox.fill(password);
  }

  /** Only applicable for role: 'learner' — the select is not rendered for tutors. */
  async selectAgeBand(label: string): Promise<void> {
    await this.ageBandSelect.selectOption({ label });
  }

  /** Only applicable for role: 'tutor' — the checkbox is not rendered for learners. */
  async confirmContentRights(): Promise<void> {
    await this.rightsConfirmedCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.createAccountButton.click();
  }

  /** Composite business action: fills out and submits the full form for the given role. */
  async signUp(user: SignUpUser): Promise<void> {
    await this.selectRole(user.role);
    await this.fillAccountDetails(user.name, user.email, user.password);
    if (user.role === 'learner' && user.ageBandLabel) {
      await this.selectAgeBand(user.ageBandLabel);
    }
    if (user.role === 'tutor' && user.rightsConfirmed) {
      await this.confirmContentRights();
    }
    await this.submit();
  }

  /** Starts the GitHub OAuth sign-up flow; the browser will navigate to github.com. */
  async continueWithGitHub(): Promise<void> {
    await this.continueWithGitHubButton.click();
  }

  /**
   * Native HTML5 constraint-validation state of the age band `<select required>`.
   * Used for TC_AUTH_004 (submit attempted with no age band chosen) — the browser
   * blocks the form submit client-side rather than the server returning a message.
   */
  async isAgeBandValid(): Promise<boolean> {
    return this.ageBandSelect.evaluate((el: HTMLSelectElement) => el.validity.valid);
  }
}
