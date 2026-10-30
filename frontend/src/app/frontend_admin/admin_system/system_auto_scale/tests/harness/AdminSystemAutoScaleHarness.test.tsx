import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSystemAutoScaleHarness } from '@/app/frontend_admin/admin_system/system_auto_scale/tests/harness/AdminSystemAutoScaleHarness';
import { AdminSystemAutoScaleScenarios } from '@/app/frontend_admin/admin_system/system_auto_scale/tests/harness/bootstrap';

describe('admin_system_auto_scale local scenario harness', () => {
  it.each(AdminSystemAutoScaleScenarios)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    render(<AdminSystemAutoScaleHarness scenario={scenario}>Feature content</AdminSystemAutoScaleHarness>);
    expect(screen.getByTestId('admin_system_auto_scale-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    expect(screen.getByText('Feature content')).toBeTruthy();
  });
});
