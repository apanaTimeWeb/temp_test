import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminSystemSettingsHarness as HarnessScenarioComponent } from '@/app/frontend_admin/admin_system/system_settings/tests/harness/AdminSystemSettingsHarness';
import { AdminSystemSettingsScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_system/system_settings/tests/harness/bootstrap';

HarnessVitest.describe('admin_system_settings local scenario harness', () => {
  HarnessVitest.it('renders feature content in the active scenario', () => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario="ACTIVE"><p>Active settings content</p></HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Active settings content')).toBeTruthy();
  });
  HarnessVitest.it.each(HarnessScenarioList.filter((scenario) => scenario !== 'ACTIVE'))('renders an accessible %s state', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}><p>Must not render during a non-active state</p></HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.queryByText('Must not render during a non-active state')).toBeNull();
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByTestId('admin_system_settings-harness').getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByRole(scenario === 'EMPTY' ? 'status' : 'alert')).toBeTruthy();
  });
});
