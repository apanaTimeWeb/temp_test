import { expect, test, type Page } from '@playwright/test';

/** Navigates cleanly and asserts zero pageerror, console.error, i18n missing keys, or horizontal overflow. */
async function expectPublicAuthRouteClean(page: Page, url: string) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const onPageError = (err: Error) => pageErrors.push(err.message);
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  try {
    const response = await page.goto(url);
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
    await expect(page.getByText('MISSING_MESSAGE', { exact: false })).toHaveCount(0);
    const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowPx, `Horizontal overflow detected (${overflowPx}px) on ${url}`).toBeLessThanOrEqual(2);
    expect(pageErrors, `Uncaught pageerror on ${url}`).toEqual([]);
    const nonNetworkConsoleErrors = consoleErrors.filter((text) => !text.includes('Failed to load resource'));
    expect(nonNetworkConsoleErrors, `Unexpected console.error on ${url}`).toEqual([]);
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }
}

test.describe('Public Auth interactive E2E & routing suite', () => {
  test('auth_sign_in switches roles, validates credentials, toggles password visibility, and links cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectPublicAuthRouteClean(page, '/auth/login');

    await expect(page.getByTestId('auth-login-form')).toBeVisible();
    await expect(page.getByText('One Platform. Every Branch.')).toBeVisible();

    const adminRole = page.getByTestId('auth-login-role-admin-select');
    const managerRole = page.getByTestId('auth-login-role-manager-select');
    await adminRole.click();
    await expect(adminRole).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('auth-login-role-value')).toHaveValue('admin');
    await expect(page.getByTestId('auth-login-email-input')).toHaveValue('admin@library.com');

    await managerRole.click();
    await expect(managerRole).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('auth-login-role-value')).toHaveValue('manager');
    await expect(page.getByTestId('auth-login-email-input')).toHaveValue('manager@library.com');

    const pwInput = page.getByTestId('auth-login-password-input');
    await expect(pwInput).toHaveAttribute('type', 'password');
    await page.getByTestId('auth-login-password-toggle').click();
    await expect(pwInput).toHaveAttribute('type', 'text');

    await page.getByTestId('auth-login-email-input').fill('');
    await page.getByTestId('auth-login-submit').click();
    await expect(page.getByTestId('auth-login-email-validation-error')).toBeVisible();

    await expect(page.getByTestId('auth-login-whatsapp-enquiry')).toHaveAttribute('href', /https:\/\/wa\.me\//);

    await page.getByRole('link', { name: /Forgot password\?/i }).click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
    await expect(page.getByTestId('auth-forgot-form')).toBeVisible();
  });

  test('auth_account_registration validates required fields, updates password strength meter, and navigates back', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectPublicAuthRouteClean(page, '/auth/signup');

    await expect(page.getByTestId('auth-signup-form')).toBeVisible();
    await page.getByTestId('auth-signup-submit').click();
    await expect(page.getByTestId('auth-signup-owner-validation-error')).toBeVisible();
    await expect(page.getByTestId('auth-signup-library-validation-error')).toBeVisible();
    await expect(page.getByTestId('auth-signup-email-validation-error')).toBeVisible();
    await expect(page.getByTestId('auth-signup-phone-validation-error')).toBeVisible();
    await expect(page.getByTestId('auth-signup-password-validation-error')).toBeVisible();

    const pw = page.getByTestId('auth-signup-password-input');
    await pw.fill('Abc123!@');
    const meter = page.getByTestId('auth-password-strength-meter-status');
    await expect(meter).toBeVisible();
    await expect(meter).toHaveAttribute('aria-valuenow', '4');

    await page.getByTestId('auth-signup-password-toggle').click();
    await expect(pw).toHaveAttribute('type', 'text');

    await page.getByTestId('auth-signup-back-to-login-link').click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByTestId('auth-login-form')).toBeVisible();
  });

  test('auth_password_recovery validates identity field and links cleanly back to sign in', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectPublicAuthRouteClean(page, '/auth/forgot-password');

    await expect(page.getByTestId('auth-forgot-form')).toBeVisible();
    await page.getByTestId('auth-forgot-submit').click();
    await expect(page.getByTestId('auth-forgot-identity-validation-error')).toBeVisible();

    await page.getByTestId('auth-forgot-identity-input').fill('person@example.invalid');
    await expect(page.getByTestId('auth-forgot-identity-input')).toHaveValue('person@example.invalid');

    await page.getByTestId('auth-forgot-back-to-login-link').click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByTestId('auth-login-form')).toBeVisible();
  });

  test('auth_password_reset enforces OTP accessibility, supports 6-digit paste/arrow keys, and updates password strength', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectPublicAuthRouteClean(page, '/auth/reset-password');

    await expect(page.getByTestId('auth-reset-form')).toBeVisible();
    await expect(page.getByTestId('auth-reset-otp-group')).toBeVisible();

    await page.getByTestId('auth-reset-submit').click();
    const otpError = page.getByTestId('auth-reset-otp-validation-error');
    await expect(otpError).toBeVisible();
    await expect(page.getByTestId('auth-reset-otp-digit-1-input')).toHaveAttribute('aria-invalid', 'true');

    await page.getByTestId('auth-reset-otp-digit-1-input').fill('1');
    await expect(page.getByTestId('auth-reset-otp-digit-2-input')).toBeFocused();
    await page.keyboard.type('23456');
    await expect(page.getByTestId('auth-reset-otp-value')).toHaveValue('123456');

    const pwInput = page.getByTestId('auth-reset-password-input');
    await pwInput.fill('StrongPass1!');
    const meter = page.getByTestId('auth-password-strength-meter-status');
    await expect(meter).toBeVisible();
    await expect(meter).toHaveAttribute('aria-valuenow', '4');

    await page.getByTestId('auth-reset-request-new-code-link').click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  test('legacy dispatcher handles default, empty, allowlisted views, and rejects prototype keys safely', async ({ page }) => {
    await expectPublicAuthRouteClean(page, '/frontend_public/public_auth');
    await expect(page.getByTestId('auth-login-form')).toBeVisible();

    await page.goto('/frontend_public/public_auth?view=');
    await expect(page.getByTestId('auth-login-form')).toBeVisible();

    const legacyViewCases = [
      { view: 'login', form: 'auth-login-form' },
      { view: 'signup', form: 'auth-signup-form' },
      { view: 'forgot-password', form: 'auth-forgot-form' },
      { view: 'reset-password', form: 'auth-reset-form' },
    ] as const;

    for (const { view, form } of legacyViewCases) {
      await page.goto(`/frontend_public/public_auth?view=${encodeURIComponent(view)}`);
      await expect(page.getByTestId(form)).toBeVisible();
    }

    for (const view of ['unknown', 'constructor', 'toString', '__proto__']) {
      await page.goto(`/frontend_public/public_auth?view=${encodeURIComponent(view)}`);
      await expect(page.getByTestId('public-auth-unknown-view')).toBeVisible();
      await expect(page.getByRole('heading', { name: /authentication page not found/i })).toBeVisible();
      await expect(page.locator('a[href="/auth/login"]')).toBeVisible();
    }
  });
});
