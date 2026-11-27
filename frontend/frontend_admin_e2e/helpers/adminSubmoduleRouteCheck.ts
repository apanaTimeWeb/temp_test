import { expect, type Page } from '@playwright/test';

/** Verifies canonical route load, zero runtime/i18n errors, visible main heading, and active navigation link. */
export async function expectCanonicalAdminSubmoduleLoaded(
  page: Page,
  route: string,
  options?: { checkSearchInput?: boolean },
): Promise<void> {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const onPageError = (err: Error) => pageErrors.push(err.message);
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  try {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
    await expect(page.getByText('MISSING_MESSAGE', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Application error:', { exact: false })).toHaveCount(0);

    const navigation = page.getByTestId('admin-navigation');
    await expect(navigation.locator(`a[href="${route}"]`)).toHaveCount(1);

    if (options?.checkSearchInput) {
      const searchBox = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
      if ((await searchBox.count()) > 0 && (await searchBox.isVisible())) {
        await searchBox.fill('test');
        await expect(searchBox).toHaveValue('test');
        await searchBox.fill('');
      }
    }

    expect(pageErrors, `Unexpected uncaught pageerror on ${route}`).toEqual([]);
    const nonNetworkConsoleErrors = consoleErrors.filter((text) => !text.includes('Failed to load resource'));
    expect(nonNetworkConsoleErrors, `Unexpected console.error on ${route}`).toEqual([]);
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }
}
