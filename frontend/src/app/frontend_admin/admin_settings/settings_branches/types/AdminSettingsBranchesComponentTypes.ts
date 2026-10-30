import type useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';
import type { AdminSettingsBranchesScenario } from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminBranchesListViewsProps { model: ReturnType<typeof useAdminSettingsBranchesMain>; }

export interface AdminSettingsBranchesViewProps {
  model: ReturnType<typeof useAdminSettingsBranchesMain>;
}

export interface AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps {
  model: ReturnType<typeof useAdminSettingsBranchesMain>;
}

export interface AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps {
  model: ReturnType<typeof useAdminSettingsBranchesMain>;
}

export interface AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps {
  model: ReturnType<typeof useAdminSettingsBranchesMain>;
}

export interface AdminSettingsBranchesHarnessProps {
  children: ReactNode;
  scenario?: AdminSettingsBranchesScenario;
}
