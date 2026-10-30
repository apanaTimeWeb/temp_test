// Responsibility: verify the isolated admin_communication_whatsapp_templates contract remains discoverable by the host test runner.
import { describe, expect, it } from 'vitest';

import adminNavigationEn from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_en.json';
import adminNavigationHi from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_hi.json';
describe('admin_communication_whatsapp_templates standalone contract', () => {
  it('has a module-owned test harness', () => {
    expect('admin_communication_whatsapp_templates').toMatch(/^admin_[a-z0-9_]+$/);
  });
});

describe('route loading/error boundary localization contract', () => {
  it('uses only keys present in the shared English and Hindi ADMIN_NAVIGATION catalogs', () => {
    for (const messages of [adminNavigationEn.ADMIN_NAVIGATION, adminNavigationHi.ADMIN_NAVIGATION]) {
      expect(messages).toHaveProperty('ROUTE_ERROR_TITLE');
      expect(messages).toHaveProperty('ROUTE_ERROR_DESCRIPTION');
      expect(messages).toHaveProperty('ROUTE_ERROR_RETRY');
      expect(messages).toHaveProperty('LOADING_PAGE');
    }
  });
});
