import type useAdminStaffDirectory from '@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory';
import type { AdminStaffDirectoryCreateManagerFormValues, AdminStaffDirectoryManager, AdminStaffDirectoryTab } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { AdminStaffDirectoryScenario } from '@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminStaffDirectoryAuditSectionProps {
  tab: Extract<AdminStaffDirectoryTab, AdminStaffDirectoryAuditSectionTabSubset>;
}

export interface AdminStaffDirectoryCreateManagerFormProps {
  onCreate: (values: AdminStaffDirectoryCreateManagerFormValues) => AdminStaffDirectoryCreateManagerFormOnCreateSubset;
  canCreate: boolean;
}

export interface AdminStaffDirectoryDetailLogsSectionProps { model: ReturnType<typeof useAdminStaffDirectory>; onBack: () => void; }

export interface AdminStaffDirectoryManagerTableProps {
  managers: readonly AdminStaffDirectoryManager[];
  filterStatus?: AdminStaffDirectoryManager['status'];
  tab?: Extract<AdminStaffDirectoryTab, AdminStaffDirectoryManagerTableTabSubset>;
  onSelectManager: (manager: AdminStaffDirectoryManager) => void;
}

export interface AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps {
  model: ReturnType<typeof useAdminStaffDirectory>;
}

export interface AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps {
  model: ReturnType<typeof useAdminStaffDirectory>;
}

export interface AdminStaffDirectoryHarnessProps {
  children: ReactNode;
  scenario?: AdminStaffDirectoryScenario;
}

export type AdminStaffDirectoryNavigationItemLabelKey = 'NAV_ALL' | 'NAV_ADD' | 'NAV_ACTIVE' | 'NAV_SUSPENDED' | 'NAV_DEACTIVATED' | 'NAV_SESSIONS' | 'NAV_HISTORY' | 'NAV_ACTIVITY';
export type AdminStaffDirectoryManagerDetailTab = 'overview' | 'history' | 'activity';

export type AdminStaffDirectoryAuditSectionTabSubset = 'sessions' | 'history' | 'activity';
export type AdminStaffDirectoryCreateManagerFormOnCreateSubset = 'created' | 'duplicate' | 'blocked';
export type AdminStaffDirectoryManagerTableTabSubset = 'all' | 'active' | 'suspended' | 'deactivated';
