import { expect, type Page } from '@playwright/test';

/** Verifies canonical Manager route load, zero runtime/i18n errors, single main landmark, and active nav link. */
export async function expectCanonicalManagerSubmoduleLoaded(
  page: Page,
  route: string,
  options?: { checkSearchInput?: boolean; checkNoHorizontalOverflow?: boolean },
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
    const response = await page.goto(route);
    expect(response, `No navigation response for ${route}`).not.toBeNull();
    expect(response!.status(), `HTTP error ${response!.status()} on ${route}`).toBeLessThan(400);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
    await expect(page.getByText('MISSING_MESSAGE', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Application error:', { exact: false })).toHaveCount(0);

    const navigation = page.getByTestId('manager-navigation');
    await expect(navigation.locator(`a[href="${route}"]`)).toHaveCount(1);

    if (options?.checkSearchInput) {
      const searchBox = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
      if ((await searchBox.count()) > 0 && (await searchBox.isVisible())) {
        await searchBox.fill('__NO_MATCH_999__');
        await expect(searchBox).toHaveValue('__NO_MATCH_999__');
        await searchBox.fill('');
        await expect(searchBox).toHaveValue('');
      }
    }

    if (options?.checkNoHorizontalOverflow) {
      const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflowPx, `Horizontal overflow detected (${overflowPx}px) on ${route}`).toBeLessThanOrEqual(2);
    }

    expect(pageErrors, `Unexpected uncaught pageerror on ${route}`).toEqual([]);
    const nonNetworkConsoleErrors = consoleErrors.filter((text) => !text.includes('Failed to load resource'));
    expect(nonNetworkConsoleErrors, `Unexpected console.error on ${route}`).toEqual([]);
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }
}
