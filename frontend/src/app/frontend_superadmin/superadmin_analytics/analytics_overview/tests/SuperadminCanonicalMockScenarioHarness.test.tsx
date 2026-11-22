// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminCanonicalMockScenarioHarness.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Harness from './harness/SuperadminAnalyticsOverviewHarness';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS } from '../mocks/scenarios/superadmin_analytics_overview.scenarios';

describe('analytics_overview canonical mock scenario harness', () => {
  it('declares the six required canonical scenario keys', () => {
    expect(SUPERADMIN_CANONICAL_MOCK_SCENARIOS.map((scenario) => scenario.key)).toEqual([
      'ACTIVE_RECORDS',
      'EMPTY_DATA',
      'SERVER_500_ERROR',
      'NETWORK_TIMEOUT',
      'UNAUTHORIZED_401',
      'FORBIDDEN_403',
    ]);
  });

  it('updates the selected scenario in the isolated harness without fabricating API responses', () => {
    render(<Harness><div data-testid="superadmin_analytics_overview-scenario-test-child">child</div></Harness>);
    const selector = screen.getByRole('combobox', { name: 'Mock scenario' });
    fireEvent.change(selector, { target: { value: 'EMPTY_DATA' } });
    expect(screen.getByTestId("superadmin_analytics_overview-mock-scenario-selector-panel").getAttribute('data-active-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId("superadmin_analytics_overview-mock-scenario-content").getAttribute('data-mock-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId('superadmin_analytics_overview-scenario-test-child').textContent).toBe('child');
  });
});
