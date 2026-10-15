import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export interface OnboardingSelection {
  role: 'learner' | 'tutor';
  ageBandLabel: string;
  rightsConfirmed?: boolean;
}

/**
 * Page object for `/onboarding` (src/app/onboarding/onboarding-form.tsx).
 *
 * Reached only via redirect: an OAuth sign-in (GitHub) skips role/age-band
 * capture at sign-up time, so `auth.config.ts`'s `authorized()` callback
 * routes a user with no role/ageBand here (US-001 DEC-11/AC1/AC3).
 */
export class OnboardingPage extends BasePage {
  readonly learnerRoleRadio: Locator;
  readonly tutorRoleRadio: Locator;
  readonly ageBandSelect: Locator;
  readonly rightsConfirmedCheckbox: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.learnerRoleRadio = page.getByRole('radio', { name: 'Learner' });
    this.tutorRoleRadio = page.getByRole('radio', { name: 'Tutor' });
    this.ageBandSelect = page.getByLabel(/Age band/);
    this.rightsConfirmedCheckbox = page.getByRole('checkbox', { name: /confirm any media/i });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async navigate(): Promise<void> {
    await this.goto('/onboarding');
  }

  async completeOnboarding(selection: OnboardingSelection): Promise<void> {
    const roleRadio = selection.role === 'tutor' ? this.tutorRoleRadio : this.learnerRoleRadio;
    await roleRadio.check();
    await this.ageBandSelect.selectOption({ label: selection.ageBandLabel });
    if (selection.role === 'tutor' && selection.rightsConfirmed) {
      await this.rightsConfirmedCheckbox.check();
    }
    await this.continueButton.click();
  }
}
