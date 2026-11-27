import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('settings_profile E2E', () => {
  test('loads Admin Profile & Branches Settings page cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_profile');
  });
});
