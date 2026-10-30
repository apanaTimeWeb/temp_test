import { describe, expect, it } from 'vitest';
import en from '@/app/frontend_admin/application_infrastructure/application_infrastructure_locales/admin_shell_en.json';
import hi from '@/app/frontend_admin/application_infrastructure/application_infrastructure_locales/admin_shell_hi.json';

describe('admin shell locale contracts', () => {
  it('keeps English and Hindi keys aligned for role-shell UI copy', () => {
    expect(Object.keys(en.ADMIN_SHELL).sort()).toEqual(Object.keys(hi.ADMIN_SHELL).sort());
  });
  it('marks demo identity and unavailable notifications clearly', () => {
    expect(en.ADMIN_SHELL.DEMO_PROFILE_TOOLTIP).toMatch(/Demo profile/);
    expect(hi.ADMIN_SHELL.DEMO_PROFILE_TOOLTIP).toMatch(/डेमो प्रोफ़ाइल/);
    expect(en.ADMIN_SHELL.NOTIFICATIONS_BLOCKED).toMatch(/API\/route is not supplied/);
  });
});
