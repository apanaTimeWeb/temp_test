import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';

/** Illustrative branch profile values for layout review; not the authenticated branch record. */
export const MANAGER_BRANCH_INFO_SAMPLE_DRAFT: ManagerSettingsBranchInfoDraft = {
  branchName: 'Library OS - Connaught Place',
  branchCode: 'SL360-CP-01',
  address: 'Block A, Connaught Place, New Delhi, 110001',
  phone: '+91 9876543210',
  email: 'cp.branch@smartlibrary.com',
  managerName: 'Rahul Verma',
  workingHours: '08:00 AM - 10:00 PM (All Days)',
};
