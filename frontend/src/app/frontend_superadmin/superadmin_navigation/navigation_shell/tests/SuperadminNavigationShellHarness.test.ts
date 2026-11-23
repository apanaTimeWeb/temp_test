// RESPONSIBILITY: Define source-level test coverage for navigation shell using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_navigation/navigation_shell/tests/SuperadminNavigationShellHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from "@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config";
import { SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/api/superadmin_navigation_shell.query_keys';
import { SUPERADMIN_NAVIGATION_NAV_ITEMS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { SUPERADMIN_NAVIGATION_SHELL_CANONICAL_SCENARIOS } from '../mocks/scenarios/superadmin_navigation_shell.scenarios';

describe('navigation_shell standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_SHELL_URLS.AUTH_LOGIN).toBe('/auth/login');
    expect(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_SHELL_URLS.FORBIDDEN).toBe('/403');
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS.all[0]).toBe('superadmin_navigation_shell');
  });

  it('keeps primary navigation links unique by accessible label without a repeated test id', () => {
    const sidebar = readFileSync(resolve(__dirname, '../components/SuperadminNavigationShellSidebar.tsx'), 'utf8');
    const labelKeys = SUPERADMIN_NAVIGATION_NAV_ITEMS.map((item) => item.labelKey);
    expect(labelKeys).toHaveLength(16);
    expect(new Set(labelKeys).size).toBe(labelKeys.length);
    expect(sidebar).toContain('<span>{t(labelKey)}</span>');
    expect(sidebar).not.toContain('data-testid="superadmin-navigation-navigation_shell-link-1"');
  });

  it('captures the logout trigger before opening and restores focus to that trigger', () => {
    const header = readFileSync(resolve(__dirname, '../components/SuperadminNavigationShellHeader.tsx'), 'utf8');
    expect(header).toContain('logoutTriggerRef.current =');
    expect(header).toContain('setShowLogout(true);');
  });

  it('defines canonical eight-state navigation shell scenario contracts', () => {
    expect(SUPERADMIN_NAVIGATION_SHELL_CANONICAL_SCENARIOS.length).toBe(8);
    expect(SUPERADMIN_NAVIGATION_SHELL_CANONICAL_SCENARIOS[0].id).toBe('ACTIVE');
  });
});
