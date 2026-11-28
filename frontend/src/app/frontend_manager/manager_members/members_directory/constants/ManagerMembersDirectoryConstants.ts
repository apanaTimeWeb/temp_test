import type { ManagerMembersDirectoryRecord, ManagerMembersDirectoryStatusLabelKey } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

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
  Blocked: { className: 'mgr-badge--danger', labelKey: 'member_status_blocked' },
  'On Leave': { className: 'mgr-badge--info', labelKey: 'member_status_on_leave' },
} as const satisfies Record<ManagerMembersDirectoryRecord['status'], { className: string; labelKey: ManagerMembersDirectoryStatusLabelKey }>;
