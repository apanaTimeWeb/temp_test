/** Canonical route and API contract for manager members referral bonus. */
export const MANAGER_MEMBERS_REFERRAL_BONUS_ROUTES = { root: '/frontend_manager/manager_members/members_referral_bonus' } as const;

export const MANAGER_MEMBERS_REFERRAL_BONUS_API = {
  LIST: '/api/v1/manager/members/referral-bonus' as const,
  CREATE: '/api/v1/manager/members/referral-bonus' as const,
  APPROVE: (id: string) => `/api/v1/manager/members/referral-bonus/${encodeURIComponent(id)}/approve` as const,
  EXPORT_CSV: '/api/v1/manager/members/referral-bonus/export-csv' as const,
} as const;
