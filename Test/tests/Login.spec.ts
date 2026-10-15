import { test, expect } from '@playwright/test';

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test.describe('Login', () => {
	test('logs in with valid credentials', async ({ page }) => {
		expect(email, 'Set TEST_USER_EMAIL before running this test').toBeTruthy();
		expect(password, 'Set TEST_USER_PASSWORD before running this test').toBeTruthy();

		// Requires baseURL to be configured in Playwright.
        await page.goto('/login');
        await page.getByLabel(/email/i).fill(email!);
        await page.getByLabel(/password/i).fill(password!);
        await page.getByRole('button', { name: /log in|sign in/i }).click();

		// Update this URL pattern to match the route shown after a successful login.
		await expect(page).toHaveURL(/dashboard|home/i);
        // take a screenshot 
	});
});
