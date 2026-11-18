import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceAutoSuspendHarness } from './AdminFinanceAutoSuspendHarness';
import { AdminFinanceAutoSuspendScenarios } from './bootstrap';

describe('admin_finance_auto_suspend local scenario harness', () => {
  it.each(AdminFinanceAutoSuspendScenarios)(
    'exposes the %s scenario without assuming a backend DTO',
    (scenario) => {
      render(
        <AdminFinanceAutoSuspendHarness scenario={scenario}>
          Feature content
        </AdminFinanceAutoSuspendHarness>
      );
      expect(
        screen.getByTestId('admin_finance_auto_suspend-harness').getAttribute('data-scenario')
      ).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
      if (scenario === 'ACTIVE') {
        expect(screen.getByText('Feature content')).toBeTruthy();
      }
    }
  );
});
