// RESPONSIBILITY: Define source-level test coverage for libraries library capacity gap filling using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_capacity_gap_filling/tests/SuperadminCanonicalMockScenarioHarness.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/tests/harness/bootstrap';
import { describe, expect, it } from 'vitest';
import Harness from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/tests/harness/SuperadminLibrariesOverviewLibraryCapacityGapFillingHarness';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/scenarios/superadmin_libraries_library_capacity_gap_filling.scenarios';

describe('libraries_library_capacity_gap_filling canonical mock scenario harness', () => {
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
    render(<Harness><div data-testid="superadmin_libraries_library_capacity_gap_filling-scenario-test-child">child</div></Harness>);
    const selector = screen.getByRole('combobox', { name: 'Mock scenario' });
    fireEvent.change(selector, { target: { value: 'EMPTY_DATA' } });
    expect(screen.getByTestId("superadmin_libraries_library_capacity_gap_filling-mock-scenario-selector-panel").getAttribute('data-active-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId("superadmin_libraries_library_capacity_gap_filling-mock-scenario-content").getAttribute('data-mock-scenario')).toBe('EMPTY_DATA');
    expect(screen.getByTestId('superadmin_libraries_library_capacity_gap_filling-scenario-test-child').textContent).toBe('child');
  });
});
