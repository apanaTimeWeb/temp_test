import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\satyam\\.gemini\\antigravity\\brain\\3adccbc6-d4df-4e5a-8463-974c4ad04474';

async function runVerification() {
  console.log('Starting Playwright browser verification with Chrome...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  const results = [];

  try {
    // 1. Sign In
    console.log('1. Testing /auth/login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="auth-login-form"]');
    
    // Check demo fill button
    const loginDemoBtn = page.locator('[data-testid="auth-login-demo-fill"]');
    if (await loginDemoBtn.isVisible()) {
      await loginDemoBtn.click();
    }
    await page.screenshot({ path: path.join(screenshotDir, '01_login_filled.png'), fullPage: true });

    const emailVal = await page.locator('[data-testid="auth-login-email-input"]').inputValue();
    const roleVal = await page.locator('[data-testid="auth-login-role-value"]').inputValue();
    console.log(`Login populated: email=${emailVal}, role=${roleVal}`);
    
    // Submit login
    await page.locator('[data-testid="auth-login-submit"]').click();
    await page.waitForURL('**/admin/admin_dashboard', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotDir, '02_login_redirect_success.png'), fullPage: true });
    results.push({ test: 'Sign In & Redirect', status: 'PASS', destination: page.url() });

    // 2. Registration
    console.log('2. Testing /auth/signup...');
    await page.goto('http://localhost:3000/auth/signup', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="auth-signup-form"]');

    const signupDemoBtn = page.locator('[data-testid="auth-signup-demo-fill"]');
    if (await signupDemoBtn.isVisible()) {
      await signupDemoBtn.click();
    }
    await page.screenshot({ path: path.join(screenshotDir, '03_signup_filled.png'), fullPage: true });

    const ownerVal = await page.locator('[data-testid="auth-signup-owner-name-input"]').inputValue();
    const libVal = await page.locator('[data-testid="auth-signup-library-name-input"]').inputValue();
    console.log(`Signup populated: owner=${ownerVal}, library=${libVal}`);

    // Submit registration
    await page.locator('[data-testid="auth-signup-submit"]').click();
    await page.waitForURL('**/superadmin/superadmin_setup-wizard', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotDir, '04_signup_redirect_success.png'), fullPage: true });
    results.push({ test: 'Registration & Redirect', status: 'PASS', destination: page.url() });

    // 3. Password Recovery
    console.log('3. Testing /auth/forgot-password...');
    await page.goto('http://localhost:3000/auth/forgot-password', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="auth-forgot-form"]');

    const forgotDemoBtn = page.locator('[data-testid="auth-forgot-demo-fill"]');
    if (await forgotDemoBtn.isVisible()) {
      await forgotDemoBtn.click();
    }
    await page.screenshot({ path: path.join(screenshotDir, '05_forgot_filled.png'), fullPage: true });

    const forgotIdentityVal = await page.locator('[data-testid="auth-forgot-identity-input"]').inputValue();
    console.log(`Forgot password populated: identity=${forgotIdentityVal}`);

    // Submit forgot password
    await page.locator('[data-testid="auth-forgot-submit"]').click();
    await page.waitForSelector('[data-testid="auth-forgot-accepted-state"]', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotDir, '06_forgot_accepted.png'), fullPage: true });
    results.push({ test: 'Password Recovery Feedback', status: 'PASS' });

    // 4. Password Reset
    console.log('4. Testing /auth/reset-password...');
    await page.goto('http://localhost:3000/auth/reset-password', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="auth-reset-form"]');

    const resetDemoBtn = page.locator('[data-testid="auth-reset-demo-fill"]');
    if (await resetDemoBtn.isVisible()) {
      await resetDemoBtn.click();
    }
    await page.screenshot({ path: path.join(screenshotDir, '07_reset_filled.png'), fullPage: true });

    const otp0 = await page.locator('[data-testid="auth-reset-otp-digit-1-input"]').inputValue();
    const otp5 = await page.locator('[data-testid="auth-reset-otp-digit-6-input"]').inputValue();
    console.log(`Reset OTP populated: slot0=${otp0}, slot5=${otp5}`);

    // Submit reset password
    await page.locator('[data-testid="auth-reset-submit"]').click();
    await page.waitForSelector('[data-testid="auth-reset-completed-state"]', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotDir, '08_reset_accepted.png'), fullPage: true });
    results.push({ test: 'Password Reset Feedback', status: 'PASS' });

    // 5. Unknown view safe fallback
    console.log('5. Testing /frontend_public/public_auth?view=unknown...');
    await page.goto('http://localhost:3000/frontend_public/public_auth?view=unknown', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="public-auth-unknown-view"]');
    await page.screenshot({ path: path.join(screenshotDir, '09_unknown_view.png'), fullPage: true });
    results.push({ test: 'Unknown View Fallback', status: 'PASS' });

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.table(results);
  } catch (err) {
    console.error('Verification failed:', err);
    await page.screenshot({ path: path.join(screenshotDir, 'verification_error.png'), fullPage: true });
    throw err;
  } finally {
    await browser.close();
  }
}

runVerification();
