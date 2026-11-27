'use client';

import type { AdminSettingsBranchesHarnessProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesTypes';

export function AdminSettingsBranchesHarness({
  scenario = 'ACTIVE_RECORDS',
  children,
}: AdminSettingsBranchesHarnessProps) {
  if (scenario === 'EMPTY_DATA') {
    return (
      <div data-testid="admin_settings_branches-harness" data-scenario="empty_data" role="status">
        No branches found.
      </div>
    );
  }
  if (scenario !== 'ACTIVE_RECORDS') {
    return (
      <div data-testid="admin_settings_branches-harness" data-scenario={scenario.toLowerCase()} role="alert">
        Unable to load branches ({scenario}).
      </div>
    );
  }
  return (
    <div data-testid="admin_settings_branches-harness" data-scenario="active_records">
      {children}
    </div>
  );
}
