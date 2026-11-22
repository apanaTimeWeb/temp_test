import { render,screen } from '@testing-library/react';
import { describe,expect,it } from 'vitest';
import { AdminFinanceSecurityDepositsHarness } from './AdminFinanceSecurityDepositsHarness';
import { AdminFinanceSecurityDepositsScenarios } from './bootstrap';

describe('admin_finance_security_deposits local scenario harness', () => {
  it.each(AdminFinanceSecurityDepositsScenarios)(
    'exposes the %s scenario without assuming a backend DTO',
    (scenario) => {
      render(
        <AdminFinanceSecurityDepositsHarness scenario={scenario}>
          Feature content
        </AdminFinanceSecurityDepositsHarness>
      );
      expect(
        screen.getByTestId('admin_finance_security_deposits-harness').getAttribute('data-scenario')
      ).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
      if (scenario === 'ACTIVE') {
        expect(screen.getByText('Feature content')).toBeTruthy();
      }
    }
  );
});
