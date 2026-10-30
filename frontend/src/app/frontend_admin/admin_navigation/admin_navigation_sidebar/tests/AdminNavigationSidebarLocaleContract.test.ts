import { describe, expect, it } from 'vitest';
import en from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_en.json';
import hi from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_hi.json';

describe('admin navigation locale ownership', () => {
  it('uses a module-owned namespace and keeps English/Hindi keys aligned', () => {
    expect(en).toHaveProperty('ADMIN_NAVIGATION');
    expect(hi).toHaveProperty('ADMIN_NAVIGATION');
    expect(en).not.toHaveProperty('ADMIN_SHELL');
    expect(hi).not.toHaveProperty('ADMIN_SHELL');
    expect(Object.keys(en.ADMIN_NAVIGATION).sort()).toEqual(Object.keys(hi.ADMIN_NAVIGATION).sort());
  });
});
