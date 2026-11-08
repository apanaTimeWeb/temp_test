/** Module-owned routes. Student endpoints below are the exact source-backed URL values; mutation contracts remain separately blocked. */
const ROOT = '/frontend_manager/manager_members/members_alumni' as const;
export const MANAGER_MEMBERS_ALUMNI_ROUTES = {
  root: ROOT,
  LIST: ROOT,
  MEMBERS_DIRECTORY: '/frontend_manager/manager_members/members_directory',
  NEW: '/frontend_manager/manager_members/members_new_admission',
  GROUP: '/frontend_manager/manager_members/members_group_admission',
  ALUMNI: ROOT,
  REFERRALS: '/frontend_manager/manager_members/members_referral_bonus',
  ID_CARD: '/frontend_manager/manager_members/members_id_card_generator',
  DETAIL: (id: string) => `/frontend_manager/manager_members/members_directory?${new URLSearchParams({ view: 'profile', id }).toString()}`,
  EDIT: (id: string) => `/frontend_manager/manager_members/members_directory?${new URLSearchParams({ view: 'edit', id }).toString()}`,
} as const;
export const MANAGER_MEMBERS_ALUMNI_API = {
  LIST: '/students',
  DETAIL: (id: string) => `/students/${encodeURIComponent(id)}`,
} as const;

