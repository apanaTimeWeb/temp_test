import { expect, test } from '@playwright/test';

/** Host-runtime E2E suite: requires the host baseURL and preserved public auth rewrites. */
test('public login URL reaches the isolated sign-in form', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByTestId('auth-login-form')).toBeVisible();
});

test('public signup URL reaches the isolated registration form', async ({ page }) => {
  await page.goto('/auth/signup');
  await expect(page.getByTestId('auth-signup-form')).toBeVisible();
});

test('public recovery URL reaches the isolated recovery form', async ({ page }) => {
  await page.goto('/auth/forgot-password');
  await expect(page.getByTestId('auth-forgot-form')).toBeVisible();
});

test('public reset URL reaches the isolated reset form and OTP slots', async ({ page }) => {
  await page.goto('/auth/reset-password');
  await expect(page.getByTestId('auth-reset-form')).toBeVisible();
  await expect(page.getByTestId('auth-reset-otp-group')).toBeVisible();
});

test('legacy dispatcher defaults an omitted or empty view to sign in', async ({ page }) => {
  await page.goto('/frontend_public/public_auth');
  await expect(page.getByTestId('auth-login-form')).toBeVisible();

  await page.goto('/frontend_public/public_auth?view=');
  await expect(page.getByTestId('auth-login-form')).toBeVisible();
});

const legacyViewCases = [
  { view: 'login', form: 'auth-login-form' },
  { view: 'signup', form: 'auth-signup-form' },
  { view: 'forgot-password', form: 'auth-forgot-form' },
  { view: 'reset-password', form: 'auth-reset-form' },
] as const;

for (const { view, form } of legacyViewCases) {
  test(`legacy view "${view}" redirects to its autonomous route`, async ({ page }) => {
    await page.goto(`/frontend_public/public_auth?view=${encodeURIComponent(view)}`);
    await expect(page.getByTestId(form)).toBeVisible();
  });
}

test('unknown and prototype-named legacy views render the safe unavailable state', async ({ page }) => {
  for (const view of ['unknown', 'constructor', 'toString', '__proto__']) {
    await page.goto(`/frontend_public/public_auth?view=${encodeURIComponent(view)}`);
    await expect(page.getByTestId('public-auth-unknown-view')).toBeVisible();
    await expect(page.getByRole('heading', { name: /authentication page not found/i })).toBeVisible();
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible();
  }
});
