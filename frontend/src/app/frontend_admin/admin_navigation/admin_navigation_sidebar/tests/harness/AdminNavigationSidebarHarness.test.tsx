import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminNavigationSidebarHarness } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/tests/harness/AdminNavigationSidebarHarness';
import { AdminNavigationSidebarScenarios } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/tests/harness/bootstrap';

describe('admin_navigation_sidebar local scenario harness', () => {
  it.each(AdminNavigationSidebarScenarios)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    render(<AdminNavigationSidebarHarness scenario={scenario}>Feature content</AdminNavigationSidebarHarness>);
    expect(screen.getByTestId('admin_navigation_sidebar-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    expect(screen.getByText('Feature content')).toBeTruthy();
  });
});
