import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_whatsapp_templates E2E', () => {
  test('loads WhatsApp Templates page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_whatsapp_templates', { checkSearchInput: true });
  });
});
