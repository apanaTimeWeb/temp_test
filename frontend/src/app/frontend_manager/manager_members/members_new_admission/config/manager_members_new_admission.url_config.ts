/** Module-owned routes. Student endpoints below are the exact source-backed URL values; mutation contracts remain separately blocked. */
const ROOT = '/frontend_manager/manager_members/members_new_admission' as const;
export const MANAGER_MEMBERS_NEW_ADMISSION_ROUTES = {
  root: ROOT,
  LIST: '/frontend_manager/manager_members/members_directory',
  NEW: '/frontend_manager/manager_members/members_new_admission',
  GROUP: '/frontend_manager/manager_members/members_group_admission',
  ALUMNI: '/frontend_manager/manager_members/members_alumni',
  REFERRALS: '/frontend_manager/manager_members/members_referral_bonus',
  ID_CARD: '/frontend_manager/manager_members/members_id_card_generator',
  DETAIL: (id: string) => `/frontend_manager/manager_members/members_directory?${new URLSearchParams({ view: 'profile', id }).toString()}`,
  EDIT: (id: string) => `/frontend_manager/manager_members/members_directory?${new URLSearchParams({ view: 'edit', id }).toString()}`,
  COLLECT_FEE_FOR_STUDENT: (smartId: string) => `/frontend_manager/manager_finance/finance_collect_fee?${new URLSearchParams({ id: smartId }).toString()}`,
} as const;
export const MANAGER_MEMBERS_NEW_ADMISSION_API = {
  LIST: '/students',
  DETAIL: (id: string) => `/students/${encodeURIComponent(id)}`,
} as const;

