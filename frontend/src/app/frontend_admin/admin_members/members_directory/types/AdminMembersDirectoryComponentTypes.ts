import type useAdminMembersDirectoryMain from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain';
import type { ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import type { AdminMembersDirectoryScenario } from '@/app/frontend_admin/admin_members/members_directory/mocks/scenarios/admin_members_directory.scenarios';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { ReactNode } from 'react';

export type AdminMembersDirectoryDataToolsViewMode = 'export' | 'documents';

export interface AdminMembersDirectoryDataToolsViewProps { mode: AdminMembersDirectoryDataToolsViewMode; members: readonly AdminMembersMember[]; }

export type AdminMembersExportStatusFilter = (typeof ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS)[number]['value'];

export interface AdminMembersDirectoryMemberFormProps { model: ReturnType<typeof useAdminMembersDirectoryMain>; }

export interface AdminMembersMemberTableProps {
  members: readonly AdminMembersMember[];
  filterStatus?: AdminMembersMember['status'];
  onSelectMember: (member: AdminMembersMember) => void;
  onAction: (action: string, member: AdminMembersMember) => void;
  canMutate?: boolean;
}

export interface AdminMembersDirectorySecondaryViewsProps { model: ReturnType<typeof useAdminMembersDirectoryMain>; }

export interface AdminMembersDirectoryViewProps {
  model: ReturnType<typeof useAdminMembersDirectoryMain>;
}

export interface AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps {
  model: ReturnType<typeof useAdminMembersDirectoryMain>;
}

export interface AdminMembersDirectoryHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersDirectoryScenario;
}

export type AdminMembersRenewalUnit = 'day' | 'week';
