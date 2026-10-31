import { RefreshCw, Search, UserCheck, UserMinus, UserPlus, UserX, Users, type LucideIcon } from 'lucide-react';
import type { ManagerMembersDirectoryRecord, ManagerMembersDirectoryStatusLabelKey, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export const MANAGER_MEMBERS_TABS: readonly { name: ManagerMembersDirectoryTab; labelKey: string; icon: LucideIcon }[] = [
  { name: 'All Members', labelKey: 'tab_all_members', icon: Users },
  { name: 'Active Members', labelKey: 'tab_active_members', icon: UserCheck },
  { name: 'Expired Members', labelKey: 'tab_expired_members', icon: UserX },
  { name: 'Suspended Members', labelKey: 'tab_suspended_members', icon: UserMinus },
  { name: 'Add Member', labelKey: 'tab_add_member', icon: UserPlus },
  { name: 'Member Profile', labelKey: 'tab_member_profile', icon: Search },
  { name: 'Membership Renewal', labelKey: 'tab_membership_renewal', icon: RefreshCw },
];


export const MANAGER_MEMBERS_GENDER_OPTIONS = [
  { value: 'Male', labelKey: 'male' },
  { value: 'Female', labelKey: 'female' },
  { value: 'Other', labelKey: 'other' },
] as const;

export const MANAGER_MEMBERSHIP_TYPE_OPTIONS = [
  { value: 'Basic', labelKey: 'basic' },
  { value: 'Pro', labelKey: 'pro' },
  { value: 'Enterprise', labelKey: 'enterprise' },
] as const;


/** Static status presentation is kept in the feature constants boundary. */
export const MANAGER_MEMBERS_STATUS_BADGES = {
  Active: { className: 'mgr-badge--success', labelKey: 'member_status_active' },
  Expired: { className: 'mgr-badge--danger', labelKey: 'member_status_expired' },
  Suspended: { className: 'mgr-badge--warning', labelKey: 'member_status_suspended' },
} as const satisfies Record<ManagerMembersDirectoryRecord['status'], { className: string; labelKey: ManagerMembersDirectoryStatusLabelKey }>;

export const MANAGER_MEMBERS_DIRECTORY_SEARCH_DEBOUNCE_MS = 300;
