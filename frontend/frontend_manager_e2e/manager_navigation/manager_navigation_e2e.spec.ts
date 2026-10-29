import { expect, test, type Page } from '@playwright/test';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SOURCE_ROOT = [
  join(process.cwd(), 'frontend_manager'),
  join(process.cwd(), 'app', 'frontend_manager'),
  join(process.cwd(), 'src', 'app', 'frontend_manager'),
].find((candidate) => existsSync(candidate));
if (!SOURCE_ROOT) throw new Error('Cannot find frontend_manager source tree. Run Playwright from the ZIP root or the integrated host-app root.');

const browserExceptionsByPage = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const browserExceptions: string[] = [];
  browserExceptionsByPage.set(page, browserExceptions);
  page.on('pageerror', (error) => browserExceptions.push(error.message));
});
test.afterEach(({ page }) => {
  expect(browserExceptionsByPage.get(page) ?? [], 'Unhandled browser exceptions').toEqual([]);
});

/** Build the static route list from owned page files to prevent a second route registry drifting. */
function discoverStaticManagerRoutes(directory = SOURCE_ROOT): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    const fileStat = statSync(absolute);
    if (fileStat.isDirectory()) {
      routes.push(...discoverStaticManagerRoutes(absolute));
      continue;
    }
    if (entry !== 'page.tsx') continue;

    const routeSegments = relative(SOURCE_ROOT, directory).split(sep).filter(Boolean);
    // Dynamic segments need authoritative fixture identifiers and are tracked as NOT VERIFIED.
    if (routeSegments.some((segment) => segment.startsWith('[') && segment.endsWith(']'))) continue;
    routes.push(`/frontend_manager/${routeSegments.join('/')}`.replace(/\/$/, '') || '/frontend_manager');
  }
  return routes;
}

const staticRoutes = discoverStaticManagerRoutes().sort();

test.describe('Manager role shell — critical navigation and recovery', () => {
  test('public Manager entry route rewrites to the canonical dashboard without a duplicate page module', async ({ page }) => {
    const response = await page.goto('/manager');
    expect(response, 'Manager entry should return a document').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    // The public /manager entry keeps its URL while the canonical dashboard content renders.
    await expect(page).toHaveURL(/\/manager\/?$/);
    await expect(page.getByRole('main')).toContainText(/Manager Dashboard|Dashboard unavailable/);
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
  });
  test('dashboard renders the role shell and a single main landmark', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    expect(response, 'Dashboard navigation should return a document').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-header')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Manager navigation' })).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
  });

  test('sidebar navigation changes route and exposes the current page', async ({ page }) => {
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    const reportsLink = page.getByRole('link', { name: 'Reports', exact: true });
    await expect(reportsLink).toBeVisible();
    await reportsLink.click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_dashboard\/dashboard_reports\/?$/);
    await expect(page.getByRole('link', { name: 'Reports', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
  });

  test('sidebar domain groups expand and collapse without removing canonical destinations', async ({ page }) => {
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    const financeGroup = page.getByTestId('manager-nav-group-toggle-group_finance');
    const collectFeeLink = page.locator('a[href="/frontend_manager/manager_finance/finance_collect_fee"]');
    await expect(financeGroup).toHaveAttribute('aria-expanded', 'false');
    await expect(collectFeeLink).toBeHidden();
    await financeGroup.click();
    await expect(financeGroup).toHaveAttribute('aria-expanded', 'true');
    await expect(collectFeeLink).toBeVisible();
    await financeGroup.click();
    await expect(financeGroup).toHaveAttribute('aria-expanded', 'false');
    await expect(collectFeeLink).toBeHidden();
  });

  test('desktop sidebar can collapse and expand again', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    const sidebar = page.getByTestId('manager-sidebar');
    const toggle = page.getByRole('button', { name: 'Toggle sidebar' });
    await expect(sidebar).not.toHaveClass(/mgr-sidebar-collapsed/);
    await toggle.click();
    await expect(sidebar).toHaveClass(/mgr-sidebar-collapsed/);
    await page.getByRole('button', { name: 'Toggle sidebar' }).click();
    await expect(sidebar).not.toHaveClass(/mgr-sidebar-collapsed/);
  });

  test('mobile navigation opens and Escape closes it with focus return', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const closeButton = page.getByTestId('manager-sidebar-toggle');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close sidebar');
    await expect(closeButton).toBeFocused();
    await expect(page.getByRole('link', { name: 'Reports', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('manager-sidebar-toggle')).toHaveAttribute('aria-label', 'Toggle sidebar');
    await expect(page.getByTestId('manager-sidebar-toggle')).toBeFocused();
  });

  test('mobile navigation contains Tab focus within the open drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const sidebar = page.getByTestId('manager-sidebar');
    const focusable = sidebar.locator('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable.first();
    const last = focusable.last();
    await last.focus();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await first.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
  });

  test('cancelling the logout confirmation preserves the current session route', async ({ page }) => {
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    const currentURL = page.url();
    await page.getByTestId('manager-logout-open').click();
    const dialog = page.getByRole('dialog', { name: 'Sign out unavailable' });
    await expect(dialog.getByTestId('manager-signout-contract-warning')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Sign out unavailable' })).toBeDisabled();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(currentURL);
  });
});

// Every statically declared page must be registered by the host router. Route
// tests intentionally fail on auth redirects or missing page adapters rather
// than passing because a login page returned HTTP 200.
for (const route of staticRoutes) {
  test(`registered route ${route} loads without a redirect or browser exception`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response, `No document response for ${route}`).not.toBeNull();
    expect(response!.status(), `${route} returned HTTP ${response!.status()}`).toBeLessThan(400);
    expect(new URL(page.url()).pathname, `${route} redirected away; configure authenticated storage state if required`).toBe(route);
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
  });
}
