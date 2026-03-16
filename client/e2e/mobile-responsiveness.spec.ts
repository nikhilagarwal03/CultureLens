import { expect, test } from '@playwright/test';

test.describe('Mobile responsiveness', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'culturelens.profile.v1',
        JSON.stringify({
          name: 'Nikhil',
          country: 'India',
          preferredLanguage: 'en',
        })
      );
    });

    await page.route('**/api/trending', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: {
            items: [
              {
                reference: 'Roman Empire meme',
                count: 12,
                latestAt: new Date().toISOString(),
              },
            ],
            windowDays: 14,
          },
        }),
      });
    });

    await page.route('**/api/explain', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: {
            reference: 'Met Gala',
            originCulture: 'United States',
            culturalImpact: 'Global fashion event.',
            localAnalogy: 'A high-visibility celebrity showcase.',
            context: 'Commonly discussed online after major appearances.',
            language: 'en',
          },
        }),
      });
    });
  });

  test('dashboard remains usable on mobile and reaches result view', async ({ page }) => {
    await page.goto('/app');

    await expect(page.getByRole('heading', { name: 'Welcome, Nikhil' })).toBeVisible();
    await expect(page.getByText('Recent history')).toBeVisible();

    const textbox = page.getByRole('textbox');
    await expect(textbox).toBeVisible();
    await textbox.fill('What is Met Gala?');

    const submit = page.getByRole('button', { name: 'Explain this' });
    await expect(submit).toBeVisible();
    await submit.click();

    await expect(page).toHaveURL(/\/app\/result$/);
    await expect(page.getByRole('heading', { name: 'Decoded insight' })).toBeVisible();
  });
});
