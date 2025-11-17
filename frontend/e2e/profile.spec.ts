import { test, expect, Page } from '@playwright/test';

test.describe('Profile Management', () => {
  const testPassword = 'Test123456';

  async function setupUser(page: Page, emailSuffix: string) {
    const testEmail = `profile-${emailSuffix}-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.fill('input[id="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(dashboard|onboarding)/, { timeout: 10000 });
  }

  test('should update personal information', async ({ page }) => {
    await setupUser(page, 'personal');
    // Navigate directly to profile (bypassing onboarding)
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');

    // Wait for form to load
    await page.waitForTimeout(500);

    // Fill personal info using label-based selectors (inputs don't have name attributes)
    await page.fill('input[placeholder*="first name" i]', 'John');
    await page.fill('input[placeholder*="last name" i]', 'Doe');
    await page.fill('input[placeholder*="170" i]', '175'); // Height
    await page.fill('input[placeholder*="70" i]', '75'); // Weight

    // Submit form
    await page.click('button:has-text("Save Profile")');

    // Should show success (wait for mutation to complete)
    await page.waitForTimeout(1000);

    // Verify data persists - check that form fields have the values
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.locator('input[placeholder*="first name" i]')).toHaveValue('John');
  });

  test('should update fitness preferences', async ({ page }) => {
    await setupUser(page, 'preferences');
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');

    // Wait for form to load
    await page.waitForTimeout(500);

    // The preferences section is much simpler now - only workout duration
    // Look for "Workout Preferences" heading
    await page.locator('text=Workout Preferences').scrollIntoViewIfNeeded();

    // Fill the workout duration field (placeholder shows "60")
    const durationInput = page.locator('input[placeholder*="60" i]').last();
    await durationInput.fill('45');

    // Submit preferences
    await page.click('button:has-text("Save Preferences")');

    await page.waitForTimeout(1000);

    // Verify change persists
    await page.reload();
    await page.waitForTimeout(500);
    const reloadedInput = page.locator('input[placeholder*="60" i]').last();
    await expect(reloadedInput).toHaveValue('45');
  });
});

