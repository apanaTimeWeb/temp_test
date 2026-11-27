import { AdminSettingsBranchesHarness } from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/AdminSettingsBranchesHarness';
import {
  AdminSettingsBranchesScenarioLabel,
  AdminSettingsBranchesScenarios,
} from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AdminSettingsBranchesHarness scenarios', () => {
  it('renders active children for ACTIVE_RECORDS', () => {
    render(
      <AdminSettingsBranchesHarness scenario="ACTIVE_RECORDS">
        <p>Active branches loaded</p>
      </AdminSettingsBranchesHarness>,
    );
    expect(screen.getByText('Active branches loaded')).toBeTruthy();
  });

  it.each(AdminSettingsBranchesScenarios.filter((s) => s !== 'ACTIVE_RECORDS'))(
    'renders the visible %s state',
    (scenario) => {
      render(
        <AdminSettingsBranchesHarness scenario={scenario}>
          <p>Must not be visible</p>
        </AdminSettingsBranchesHarness>,
      );
      expect(screen.queryByText('Must not be visible')).toBeNull();
      expect(screen.getByTestId('admin_settings_branches-harness').getAttribute('data-scenario')).toBe(
        AdminSettingsBranchesScenarioLabel(scenario),
      );
    },
  );
});
