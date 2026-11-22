// RESPONSIBILITY: Define source-level test coverage for system data export jobs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_data_export_jobs/tests/SuperadminCanonicalMockScenarioHarness.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Harness from './harness/SuperadminDataExportJobsHarness';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS } from '../mocks/scenarios/superadmin_system_data_export_jobs.scenarios';

describe('system_data_export_jobs canonical mock scenario harness', () => {
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
    render(<Harness><div data-testid="superadmin_system_data_export_jobs-scenario-test-child">child</div></Harness>);
    const selector = screen.getByRole('combobox', { name: 'Mock scenario' });
    fireEvent.change(selector, { target: { value: 'EMPTY_DATA' } });
    expect(screen.getByTestId("superadmin_system_data_export_jobs-mock-scenario-selector-panel").getAttribute('data-active-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId("superadmin_system_data_export_jobs-mock-scenario-content").getAttribute('data-mock-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId('superadmin_system_data_export_jobs-scenario-test-child').textContent).toBe('child');
  });
});
