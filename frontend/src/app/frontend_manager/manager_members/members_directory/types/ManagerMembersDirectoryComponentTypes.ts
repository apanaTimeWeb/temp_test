/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersDirectoryRecord, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export type ManagerMembersDirectoryMainProps = { view?: string; id?: string; name?: string; phone?: string; smartId?: string; seat?: string };

export interface ManagerMembersDirectoryProfileSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  member: ManagerMembersDirectoryRecord | null;
}

export interface ManagerMembersDirectorySupportingSectionsProps {
  activeTab: ManagerMembersDirectoryTab;
}

export type ManagerMembersDirectoryRouteQueryProps = { view?: string; id?: string; name?: string; phone?: string; smartId?: string; seat?: string };

export type ManagerMembersDirectorySearchParams = {
  view?: string | string[];
  id?: string | string[];
  name?: string | string[];
  phone?: string | string[];
  smartId?: string | string[];
  seat?: string | string[];
};

export type ManagerMembersDirectoryPageProps = { searchParams?: Promise<ManagerMembersDirectorySearchParams> };
