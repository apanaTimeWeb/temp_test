import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceTrustScoreHarness } from '@/app/frontend_admin/admin_finance/finance_trust_score/tests/harness/AdminFinanceTrustScoreHarness';
import { AdminFinanceTrustScoreScenarios } from '@/app/frontend_admin/admin_finance/finance_trust_score/tests/harness/bootstrap';

describe('admin_finance_trust_score local scenario harness', () => {
  it.each(AdminFinanceTrustScoreScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminFinanceTrustScoreHarness scenario={scenario}>Feature content</AdminFinanceTrustScoreHarness>);
    expect(screen.getByTestId('admin_finance_trust_score-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    if (scenario === 'ACTIVE') {
      expect(screen.getByText('Feature content')).toBeTruthy();
      expect(screen.queryByRole('alert')).toBeNull();
      return;
    }

    expect(screen.queryByText('Feature content')).toBeNull();
    if (scenario === 'EMPTY') {
      expect(screen.getByRole('status').textContent).toContain('No records available');
      return;
    }
    if (scenario === 'SERVER_500') {
      expect(screen.getByRole('alert').textContent).toContain('HTTP 500');
      return;
    }
    if (scenario === 'TIMEOUT') {
      expect(screen.getByRole('alert').textContent).toContain('timeout');
      return;
    }
    expect(screen.getByRole('alert').textContent).toContain('HTTP 401');
  });
});
